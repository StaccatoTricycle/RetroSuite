## How to install

```bash
$ npm install
```

Then run it with the following ENV vars:

- `CROWDMU_PORT` - pointing to the port you want to listen on (`defaults to 3000`)
- `CROWDMU_IO_URL` - io server url (`defaults to http://localhost:3001`)
- `CROWDMU_REDIS` - redis uri (`defaults to localhost:6379`)



```bash
$ make
$ node index
```