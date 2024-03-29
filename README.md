# Aircraft Dashboard

![testing diagram](./dashboard-testing.png)

In order for me to write effective tests that didn't require me to change the JS application directly, I decided I would need to point the application to a mock socket server. 

Having a mock socket server has enabled me to send JSON via a client connection in my Cucumber steps to the dashboard via the socket server.
As well as sending data, I have tested against the messages received by the socket client and asserted expected outcomes when certain interactions are executed in the dashboard.

This setup has enabled me to test the dashboard application as a blackbox.

I've used Cucumber, Capybara, Selenium and Chrome to test the dashboard, Sinatra to bootstrap the client-side application and Event Machine WebSocket for the Mock Socket Server.

Cucumber feature files are located in the features folder.

You will need ruby-2.3.1 or higher to run mock-socket-server and Cucumber tests.

Clone this repo and cd into the root and start the mock socket server with the following bash script

```./start-mock-socket-server```

Open another terminal window and cd into the root folder of this project and run the following bash script

```./run-tests```


### Extras 

You can view the dashboard by running the following 

```SOCKET_SERVER=ws://localhost:3001 bundle exec thin start -p 8080``` 

in the terminal and going to http://localhost:8080 in a browser. 

I've written a test client page so you can send data to the dashboard and watch the dials change. You will also see the messages that are sent from the dashboard when you interact with it.

The test socket client can be found by visiting http://localhost:8080/socket-client


