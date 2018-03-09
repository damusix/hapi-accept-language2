# Hapi-ly Accept Languages

Parses `Accept-Language` header on requests for HapiJS and attaches them to request. Extracts language, region, script, and quality as per [RFC-5646](https://tools.ietf.org/html/rfc5646) best practices. Based on [hapi-accept-language](https://github.com/opentable/hapi-accept-language) with better tests, options, and failovers; uses [accept-language-parser](https://github.com/opentable/accept-language-parser). Special thanks to [OpenTable](https://github.com/opentable) for their work.

### Installation

- Hapi 17: `npm install --save hapi-accept-language2`
- Hapi 16: `npm install --save hapi-accept-language2@1`

### Usage

##### Hapi 17

``` javascript
const Hapi = require('hapi');

const hapiAcceptLanguage = {
    plugin: 'hapi-accept-language2',
    options: {

        // Set server default language using RFC-5646 language tags
        // Optional
        defaultLanguage: 'es-Latn-ES'
    }
};


server = new Hapi.Server({ port: 4111 });

server.route({

    method: 'GET',
    path: '/',
    handler: (request, reply) => {

        return {
            headers: request.raw.req.headers,
            pre: request.pre,
            languages: request.pre.language
        }
    }
});

await server.register([hapiAcceptLanguage]);

await server.start(/* ... */);
```


##### Hapi 16
``` javascript
const Hapi = require('hapi');

const hapiAcceptLanguage = {
    register: 'hapi-accept-language2',
    options: {

        // Set server default language using RFC-5646 language tags
        // Optional
        defaultLanguage: 'es-Latn-ES'
    }
};

server = new Hapi.Server();
server.connection({ port: 4111 });

server.route({

    method: 'GET',
    path: '/',
    handler: (request, reply) => {

        reply({
            headers: request.raw.req.headers,
            pre: request.pre,
            languages: request.pre.language
        }).code(200);
    }
});

server.register([hapiAcceptLanguage], {}, (err) => {

    if (err) {
        return done(err);
    }

    server.start(/* ... */);
});
```


### Contributing

```
git clone git://github.com/damusix/hapi-accept-language2.git
cd hapi-accept-language2
npm install
```

Please include tests and submit a pull request with your contributions.

### Running Tests

`npm test`
