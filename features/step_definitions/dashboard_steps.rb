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

  WebSocket::Client::Simple.connect @socket_server do |ws|
    ws.on :open do
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

When(/^the user flicks the landing gear switch$/) do
  find('[for=toggle-landing-gear]').click
end