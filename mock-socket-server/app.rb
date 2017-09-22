require 'em-websocket'

EM.run do
  @clients = []
  puts "Server started"
  EM::WebSocket.start( host: '0.0.0.0', port: '3001') do |ws|
    ws.onopen do |handshake|
      @clients << ws
      ws.send "Connected to #{handshake.path}."
    end

    ws.onclose do
      ws.send "Closed."
      @clients.delete ws
    end

    ws.onmessage do |msg|
      puts "Received Message: #{msg}"
      @clients.each do |socket|
        socket.send msg
      end
    end
  end
end