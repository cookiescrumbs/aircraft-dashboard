require 'capybara'
require 'capybara/cucumber'
require 'selenium/webdriver'
require 'websocket-client-simple'
require 'byebug'

ENV['SOCKET_SERVER'] = 'ws://localhost:3001'

Before do
  @socket_server = ENV['SOCKET_SERVER']
end

Capybara.register_driver :chrome do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

Capybara.register_driver :headless_chrome do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    chromeOptions: { args: %w(headless disable-gpu) }
  )

  Capybara::Selenium::Driver.new app,
    browser: :chrome,
    desired_capabilities: capabilities
end

Capybara.javascript_driver = :chrome

require_relative '../../app.rb'

Capybara.app = AircraftDashboard
