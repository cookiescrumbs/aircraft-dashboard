require 'thin'
require 'sinatra/base'

class AircraftDashboard < Sinatra::Base

  set :socket_server, ENV['SOCKET_SERVER'] || 'ws://interview.dev.ctx.ef.com/telemetry'

  get '/' do
    @socket_server = settings.socket_server
    erb :index
  end
end
