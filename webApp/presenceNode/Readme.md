## How to install

```bash
$ npm install
```

And run it with the following ENV vars:

- `CROWDMU_REDIS` - redis uri (`defaults to localhost:6379`)
- `CROWDMU_INTERVAL` - how often we update clients on the total
  number of connected peers. We use an interval to avoid client slowdowns
  when too many clients connect at once (`defaults to 5000`)

```bash
$ node index
```
