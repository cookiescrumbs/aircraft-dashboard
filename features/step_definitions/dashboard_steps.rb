Given(/^the operator loads the dashboard$/) do
  visit '/'
end

Given(/^the base station transmits the following parameters$/) do |table|
  data = table.raw.to_h

  message =  {
    control: {
      landing_gear: data['landing gear'].to_i,
      flaps: data['flaps'].to_i
    },
    telemetry: {
      altitude: data['altitude'].to_i,
      airspeed: data['airspeed'].to_i
    }
  }.to_json

  WebSocket::Client::Simple.connect @socket_server do |ws|
    ws.on :open do
      puts "connected to mock-socket-server"
      ws.send message
      ws.close
    end
  end
end

Then(/^the airspeed dail will be point at (\d+)$/) do |airspeed|
  expect(find(:css, '#speed-gauge-canvas')['gauge-value']).to eql airspeed
end


Then(/^the altitude dail will be pointing at (\d+)$/) do |altitude|
  expect(find(:css, '#altitude-gauge-canvas')['gauge-value']).to eql altitude
end

Then(/^the flaps gauge will be toggled to (\d+)$/) do |flaps|
  expect(find(:css, 'a.ui-slider-handle')['text']).to eql flaps
end

Then(/^the landing gear will be "([^"]*)"$/) do |gear_state|
  expect(find(:css, "#landingGear .slide-checkbox label span").text).to eql gear_state
end

When(/^the user flicks the landing gear switch "([^"]*)" and a message is sent to the base station$/) do |gear_state|

  message = nil

  WebSocket::Client::Simple.connect @socket_server do |ws|
    ws.on :open do
      puts "connected to mock-socket-server"
    end

    ws.on :message do |msg|
      message = JSON.parse(msg.data)
      puts "message recieved by mock-socket-server: #{message}"
      ws.close
    end
  end

  find('[for=toggle-landing-gear]').click

  expect(message["type"]).to eql "landing_gear"
  expect(message["value"]).to eql (gear_state.eql? "OFF") ? 0 : 1
end

Then(/^the airspeed summary will contain the following values$/) do |table|
  data = table.raw.to_h
  speed_list = all(:css, 'ul#speed-history-summary li')
  expect(speed_list[0].text).to eql "Min: #{data['min']}"
  expect(speed_list[1].text).to eql "Max: #{data['max']}"
  expect(speed_list[2].text).to eql "Avg: #{data['avg']}"
end

Then(/^the altitude summary will contain the following values$/) do |table|
  data = table.raw.to_h
  speed_list = all(:css, 'ul#altitude-history-summary li')
  expect(speed_list[0].text).to eql "Min: #{data['min']}"
  expect(speed_list[1].text).to eql "Max: #{data['max']}"
  expect(speed_list[2].text).to eql "Avg: #{data['avg']}"
end

When(/^the dashboard is disconnected to the base station$/) do
  pending  # Write code here that turns the phrase above into concrete actions
end

Then(/^the dashboard is connected to the base station$/) do
  pending # Write code here that turns the phrase above into concrete actions
end
