require 'sinatra'
require 'sinatra/reloader'
require 'digest/md5'
require 'json'
require 'net/http'
require 'uri'



def fetch(uri_str, directory, limit = 10)
  # You should choose better exception.
  raise ArgumentError, 'HTTP redirect too deep' if limit == 0
  
  url = URI.parse(uri_str)
  req = Net::HTTP::Get.new(url.path, { 'User-Agent' => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.53 Safari/536.5" })
  response = Net::HTTP.start(url.host, url.port) { |http| http.request(req) }
  puts response
  case response
  when Net::HTTPSuccess     then 
    puts "Downloaded!"
    filename = directory+"/dataset"
    open(filename, "wb") { |file|
      file.write(response.body)
    }
  when Net::HTTPRedirection then 
    puts "Redirected to "+response['location']
    fetch(response['location'], directory, limit - 1)
  else
    response.error!
  end
end

get '/dataset/*' do |p|
  dataset = 'http://'+p.to_s()
  digest = Digest::MD5.hexdigest(dataset)
  directory = "tmp/#{digest}"
  content_type 'json'
  ""+directory
  begin
    threads = Thread.new(dataset, directory) {
      Dir.mkdir(directory) unless File::directory?( directory )
      puts "Downloading "+dataset
      fetch(dataset, directory)
    }
  rescue
    puts e.message  
    puts e.backtrace.inspect 
  end
end
