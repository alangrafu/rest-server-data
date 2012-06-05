require "sinatra"
require "sinatra/reloader"
require 'digest/md5'
require 'json'


get '/dataset/*' do
  dataset = params[:splat].first.to_s().gsub /^http:\//, 'http://' # => ["path/to/file", "xml"]
  puts "Dataset => #{dataset}"
  digest = Digest::MD5.hexdigest(dataset)
  file = "tmp/#{digest}"
  Dir.mkdir(file) unless File::directory?( file )
  content_type 'json'
  "hello world => #{digest}"
end

