To run the webApp, you must start all four node servers.

*ioNode* must be running for socket connections to work between server and client.

- ioNode handles the storing connections, messages, and moves in Redis and 
  broadcasting these to all other IO instance(s) that users are connected 
  to.
- clientServer serves the HTML pages and static assets to run the game. 
  It also serves initial state from Redis with the page for optimal 
  performance.
- emulatorNode runs an emulator and broadcasts the image data from it with
  socket.io-emitter to the IO instance(s) that users are connected to.
- presenceNode notifies all the IO instance(s) of the aggregate number
  of online users.