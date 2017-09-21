require 'capybara'
require 'capybara/cucumber'
require 'selenium/webdriver'
require 'websocket-client-simple'
require 'byebug'
require 'rspec'

RSpec.configure do |config|
  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end

@socket_server = ENV['SOCKET_SERVER'] = 'ws://localhost:3001'

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

Capybara.javascript_driver = :selenium

require_relative '../../app.rb'

Capybara.app = AircraftDashboard
