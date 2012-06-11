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

def store(dataset = "default", md5 = "")
  endpoint = "http://alia:3030/gov/data?graph=http://alia/gov/metadata"
  
  twc = RDF::Vocabulary.new('http://purl.org/twc/vocab/conversion/')
  void = RDF::Vocabulary.new('http://rdfs.org/ns/void#')
  dc = RDF::Vocabulary.new('http://purl.org/dc/terms/')
  nfo = RDF::Vocabulary.new('http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#')
  t = Time.now
  
  graphName = dataset
  puts "Loading #{graphName} "
  begin
    output = RDF::Writer.for(:ntriples).buffer do |writer|
      subject = RDF::URI('http://alia/gov/dataset/'+md5)#dataset.sub(/(\/)+$/,'')+'/'+t.to_i.to_s)
      dump = RDF::URI('http://alia/gov/dataset/'+md5+'/data')
      hashNode = RDF::Node.new
      writer << [subject, RDF.type, twc.VersionedDataset]
      writer << [subject, dc.source, RDF::URI(dataset)]
      writer << [subject, nfo.hasHash, hashNode]
      writer << [subject, void.dataDump, dump]
      writer << [hashNode, RDF.type, nfo.FileHash]
      writer << [hashNode, nfo.hashAlgorithm, "MD5"]
      writer << [hashNode, nfo.hashValue, md5]
    end
    response = RestClient.post endpoint , output, :content_type => 'text/turtle'
  rescue => e
    puts "Error #{e}"
  end
  puts "Response #{response.code}"
end

def exist(md5)
  r = nil
  sparql = SPARQL::Client.new("http://alia:3030/gov/query")
  result = sparql.query("PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
    PREFIX void: <http://rdfs.org/ns/void#>
    SELECT ?dataset ?data WHERE {GRAPH <http://alia/gov/metadata>{
    ?dataset nfo:hasHash [ nfo:hashValue '#{md5}' ];
             void:dataDump ?data .
    }} LIMIT 1")
  result.each do |line|
    r = [line[:dataset].to_s, line[:data].to_s]
  end
  return r
end

def fetch(uri_str, limit = 10)
  # You should choose better exception.
  raise ArgumentError, 'HTTP redirect too deep' if limit == 0
  
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
      new_uri, new_data = exist(file_digest) 
      if new_uri.nil? || new_uri == 0
        store(uri_str, file_digest)
        #Saving 
        directory = "tmp/#{file_digest}"
        Dir.mkdir(directory) unless File::directory?( directory )
        filename = directory+"/data"
        puts "New file, saving at "+filename
        open(filename, "wb") { |file|
          file.write(response.body)
        }
        return ['http://alia/gov/dataset/'+file_digest, 'http://alia/gov/dataset/'+file_digest+'/data']
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
  'callback({"uri": "'+uri+'", "data": "'+data+'"})'
end

error do
  'Sorry there was a nasty error - ' + env['sinatra.error'].name
end
