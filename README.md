# Node DDNS
Application created for everyone with dynamic IP who want to open access to local services. Update Cloudflare DNS record with your current IP address.

### Configuration
To configure required parameters you need to create new `config.yml` file or simply copy existing template file:
```bash
$ cp config.yml.dist config.yml
```
When configuration file exist open it and set required parameters:

```yaml
app:
    cloudflare:
        record_details:
            type: A
            name: example.com
            ttl: 1
            proxied: false
```

```yaml
services:
    cloudflare:
        account:
        api_key:
        zone_id:
```

### Run it
This application use [node.js](https://nodejs.org/en) to run. Simply install node.js on your machine and then run the command:
```bash
$ npm install
$ node lib/index.js
```

You can also run `lib/forever.js` to use [forever.js](https://github.com/foreverjs/forever) library:
```bash
$ node lib/forever.js
```

### Development
Application is written in [Typescript](https://www.typescriptlang.org) and all source files are included in `src` directory.
To compile changes just run the command:
```bash
$ npm build
```
