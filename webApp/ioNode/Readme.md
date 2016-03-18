How to install

```bash
$ npm install
```
Run with the following ENV vars:

- `CROWDMU_PORT` - pointing to the port you want to listen on (defaults to `3001`)
- `CROWDMU_REDIS` - redis uri (defaults to `localhost:6379`)
- `CROWDMU_SERVER_UID` - unique persistent identifier for this server's
  instance. Used for keeping track of # of clients in redis
  (defaults to `CROWDMU_PORT`)
- `CROWDMU_IP_THROTTLE` - the least amount of time in ms that need to
  pass between moves from the same IP address (`defaults to 100`)

Make sure Redis is running. Then:

```bash
$ node index
```



This will start the IO server.