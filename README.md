# Hapi-ly Accept Languages

Parses `Accept-Language` header on requests for HapiJS and attaches them to request. Extracts language, region, script, and quality as per [RFC-5646](https://tools.ietf.org/html/rfc5646) best practices. Based on (hapi-accept-language)[https://github.com/opentable/hapi-accept-language] with better tests, options, and failovers.

### Installation

`npm install --save hapi-accept-language2`

### Usage

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
            pre: request.pre
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
