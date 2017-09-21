Given(/^I load the dashboard$/) do
  visit '/'
end

Given(/^the base station transmits the following parameters$/) do |table|
  data = table.raw.to_h
  message = '{
    "control": {
      "landing_gear": ' + data['landing gear'] +',
      "flaps": ' + data['flaps'] + '
    },
    "telemetry": {
      "altitude":  ' + data['altitude'] + ',
      "airspeed": ' + data['airspeed'] + '
    }
  }'

  WebSocket::Client::Simple.connect 'ws://localhost:3001' do |ws|
    ws.on :open do
      ws.send message
      ws.close
    end
  end
end

Then(/^the airspeed dail will be point at (\d+)$/) do |airspeed|
  expect(find(:css, '#speed-gauge-canvas')['gauge-value']).to eql airspeed
end
