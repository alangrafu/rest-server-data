require 'sinatra'
require 'sinatra/reloader'
require 'digest/md5'
require 'json'
require 'net/http'
require 'uri'
require 'rest_client'
require 'time'
require 'rdf'
require 'rdf/raptor'
require 'sparql/client'

set :public_folder, 'tmp'
set :baseUri, 'http://alia/gov'
set :sparqlEndpoint, 'http://alia:3030/gov/query'
set :sparqlUpdateEndpoint, 'http://alia:3030/gov/data'
set :namedGraph, settings.baseUri+'/metadata'
set :baseDatasetUri, settings.baseUri+'/dataset/'
set :baseVizUri, settings.baseUri+'/id/'

def saveGraph(graph = nil, namedGraph=settings.namedGraph)
  endpoint = settings.sparqlUpdateEndpoint+"?graph="+namedGraph
  puts "posting to "+endpoint
  puts graph
  begin
    response = RestClient.post endpoint , graph, :content_type => 'text/turtle'
  rescue => e
    puts "Error #{e}"
  end
  puts "Response #{response.code}"
end

def storeDataset(dataset = "default", md5 = "")
  twc = RDF::Vocabulary.new('http://purl.org/twc/vocab/conversion/')
  void = RDF::Vocabulary.new('http://rdfs.org/ns/void#')
  dc = RDF::Vocabulary.new('http://purl.org/dc/terms/')
  nfo = RDF::Vocabulary.new('http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#')
  t = Time.now
  
  graphName = dataset
  puts "Loading #{graphName} "
  output = RDF::Writer.for(:ntriples).buffer do |writer|
    subject = RDF::URI(settings.baseDatasetUri+md5)#dataset.sub(/(\/)+$/,'')+'/'+t.to_i.to_s)
    dump = RDF::URI(settings.baseDatasetUri+md5+'/data')
    hashNode = RDF::Node.new
    writer << [subject, RDF.type, twc.VersionedDataset]
    writer << [subject, dc.source, RDF::URI(dataset)]
    writer << [subject, dc.created, (t + (60 * 60 * 24)).to_s]
    writer << [subject, nfo.hasHash, hashNode]
    writer << [subject, void.dataDump, dump]
    writer << [hashNode, RDF.type, nfo.FileHash]
    writer << [hashNode, nfo.hashAlgorithm, "MD5"]
    writer << [hashNode, nfo.hashValue, md5]
  end
  saveGraph(output)  
end

def storeViz(encodedgraph, uri)
  viz = RDF::Vocabulary.new('http://graves.cl/vizon/')
  cnt = RDF::Vocabulary.new('http://www.w3.org/2011/content#')
  void = RDF::Vocabulary.new('http://rdfs.org/ns/void#')
  dc = RDF::Vocabulary.new('http://purl.org/dc/terms/')
  nfo = RDF::Vocabulary.new('http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#')
  t = Time.now
  graph = URI::decode(encodedgraph)
  graphMd5 = Digest::MD5.hexdigest(graph)
  puts "Loading viz #{graphMd5} "
  output = RDF::Writer.for(:ntriples).buffer do |writer|
    subject = RDF::URI(uri)
    hashNode = RDF::Node.new
    writer << [subject, RDF.type, viz.Visualization]
    writer << [subject, dc.created, (t + (60 * 60 * 24)).to_s]
    writer << [subject, nfo.hasHash, hashNode]
    writer << [hashNode, RDF.type, nfo.FileHash]
    writer << [hashNode, nfo.hashAlgorithm, "MD5"]
    writer << [hashNode, nfo.hashValue, graphMd5]
  end
  saveGraph(output)
  puts "Storing in "+uri
  saveGraph(graph, uri)
  return uri
end

def existDataset(md5)
  r = nil
  sparql = SPARQL::Client.new(settings.sparqlEndpoint)
  result = sparql.query("PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
    PREFIX void: <http://rdfs.org/ns/void#>
    SELECT ?dataset ?data WHERE {GRAPH <"+settings.namedGraph+">{
    ?dataset nfo:hasHash [ nfo:hashValue '#{md5}' ];
             void:dataDump ?data .
    }} LIMIT 1")
  result.each do |line|
    r = [line[:dataset].to_s, line[:data].to_s]
  end
  return r
end

def existViz(uri)
  r = nil
  sparql = SPARQL::Client.new(settings.sparqlEndpoint)
  result = sparql.query("PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
    PREFIX viz: <http://graves.cl/vizon/>
    SELECT *  WHERE {GRAPH <"+settings.namedGraph+">{
    <#{uri}> a viz:Visualization .
    }
    graph <#{uri}>{
      ?s ?p ?o
    }
    } LIMIT 1") #Certainly not the smartest query ever, got to revisit later
  result.each do |line|
    return true
  end
  return false
end

def fetch(uri_str, limit = 10)
  # You should choose better exception.
  if limit == 0
    puts "Recursion is too deep"
    return [nil,nil]
  end
  
  url = URI.parse(uri_str)
  req = Net::HTTP::Get.new(url.path, { 'User-Agent' => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.53 Safari/536.5" })
  response = Net::HTTP.start(url.host, url.port) { |http| http.request(req) }
  puts response
  begin
    case response
    when Net::HTTPSuccess then 
      new_uri = nil
      #Storing in triple store
      puts "Downloaded!"
      file_digest = Digest::MD5.hexdigest(response.body)
      new_uri, new_data = existDataset(file_digest) 
      if new_uri.nil? || new_uri == 0
        storeDataset(uri_str, file_digest)
        #Saving 
        directory = "tmp/#{file_digest}"
        Dir.mkdir(directory) unless File::directory?( directory )
        filename = directory+"/data"
        puts "New file, saving at "+filename
        open(filename, "wb") { |file|
          file.write(response.body)
        }
        return [settings.baseDatasetUri+file_digest, settings.baseDatasetUri+file_digest+'/data']
      else
        puts "Already stored! => "+new_uri.to_s   
        return new_uri, new_data
      end
    when Net::HTTPRedirection then 
      puts "Redirected to "+response['location']
      fetch(response['location'], limit - 1)
    else
      response.error!
    end
  rescue =>  e
    puts "Error in fetch #{e}"
  end
end

get '/dataset/*' do |p|
  dataset = 'http://'+p.to_s()
  content_type 'json'
  uri = "nil"
  data = "nil"
  begin
  #  threads = Thread.new(dataset, directory, uri) {
      puts "Downloading "+dataset
      uri, data = fetch(dataset)
  #  }
  rescue => e
    puts e.message  
    puts e.backtrace.inspect 
  end
  'callback({"uri": "'+uri.to_s+'", "data": "'+data.to_s+'"})'
end

get '/registerViz' do
  content_type 'json'
  graph = params[:encodedgraph]
  uri = params[:uri]
  finalUri = uri
  finalUri = storeViz(graph, uri) if existViz(uri) == false
  'callback({"uri": "'+finalUri.to_s+'"})'
end

error do
  'Sorry there was a nasty error - ' + env['sinatra.error'].name
end
