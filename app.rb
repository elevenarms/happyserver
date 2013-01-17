require 'sinatra'
require 'twilio-ruby'
require 'aws-sdk'
require 'base64'
require 'pp'
require 'time'
require 'data_mapper'
require 'dm-sqlite-adapter'



#DataMapper.setup(:default, ENV['HEROKU_POSTGRESQL_COBALT_URL'] || 'postgres://localhost/mydb')
#DataMapper.setup(:default, ENV['HEROKU_POSTGRESQL_COBALT_URL'] || 'postgres://localhost/mydb')
DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/development.db")


class Disk
  include DataMapper::Resource  
  property :id, Serial
  property :counter, Integer
end

class Ram
  include DataMapper::Resource  
  property :id, Serial
  property :counter, Integer
end

class Processor
  include DataMapper::Resource  
  property :id, Serial
  property :counter, Integer
end

DataMapper.auto_upgrade!







# A hack around multiple routes in Sinatra
def get_or_post(path, opts={}, &block)
  get(path, opts, &block)
  post(path, opts, &block)
end

# Home page and reference
get '/' do

  r = Random.new
  r = '%' + r.rand(1...100).to_s
end
get '/pic/:id' do
  @image = Image.get(params[:id])
  erb :mobilepic
end
get '/start.json' do
    @t= State.last

   content_type :json
  { :start => @t.start }.to_json
end



 



post '/setup/t' do

  @t= State.new
  @t.start = false
  @t.save
  return "setup"
  

end
# Twilio Client URL
get_or_post '/client/?' do

  erb :client
end