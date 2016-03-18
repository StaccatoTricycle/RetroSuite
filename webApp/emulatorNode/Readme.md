
## How to install

Make sure [Cairo](https://github.com/Automattic/node-canvas/wiki) is installed, then run:

```bash
$ npm install
```

Then run it with the following ENV vars:

- `CROWDMU_ROM` - pointing to the rom you want to emulate (needs to be set!)
- `CROWDMU_REDIS` - redis uri (`defaults to localhost:6379`)
- `CROWDMU_SAVE_INTERVAL` - state save frequency (`defaults to 60000`)

```
$ CROWDMU_ROM=path/to/rom.gb node index
```