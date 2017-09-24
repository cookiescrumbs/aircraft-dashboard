# Aircraft Dashboard

![testing diagram](./dashboard-testing.png)

In order for me to write effective tests that didn't require me to change the JS application directly. I decided I would need to point the applicationto a mock socket server. 

Having a mock socket server I can send JSON via a client connection in my Cucumber step to the server which is relayed to the dashboard.
As well has sending data via the a client connection in the Cucumber steps, I have tested against the messages recieved by the socket client and asserted expected outcomes when certain interractions are executed on the dashboard.

This setup has enabled me to test the dahsboard application as a blackbox.

I've used Cucumber, Capbyara, Selenium and Chrome to test the dashboard and Sinatra to boostrap the client-side application.

Cucumber feature files are located in the features folder.

You will need ruby xxx to run mock-socket-server and Cucumber tests.

Clone this repo and cd into the root and start the mock socket server by the following bash script

```./start-mock-socket-server```

Open another terminal window and cd into the root folder of this project and run the following bash script

```./run-tests```





```SOCKET_SERVER=ws://localhost:3001 bundle exec thin start -p 8080```


