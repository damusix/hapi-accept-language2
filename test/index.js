'use strict';

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

const hapiAcceptLanguage = {
    register: require('..'),
    options: {}
};

const lab = exports.lab = Lab.script();
let server;

lab.experiment('Accept Language plugin w/o options', () => {

    lab.before((done) => {

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

            server.initialize(done);
        });
    });

    lab.test('it should default to english when no language header is present', (done) => {

        const request = {
            method: 'GET',
            url: '/'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            const pre = response.result.pre;
            const headers = response.result.headers;

            Code.expect(pre.language).to.exist();
            Code.expect(headers['accept-language']).to.not.exist();

            Code.expect(pre.language).to.be.an.array();
            Code.expect(pre.language[0]).to.be.an.object();
            Code.expect(pre.language[0].code).to.equal('en');

            done();
        });
    });

    lab.test('it should set a language cookie from browser language header', (done) => {

        const request = {
            method: 'GET',
            url: '/',
            headers: {

                // Se habla español?
                'accept-language': 'es, en'
            }
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            const pre = response.result.pre;
            const headers = response.result.headers;

            Code.expect(pre.language).to.exist();
            Code.expect(headers['accept-language']).to.exist();

            Code.expect(pre.language).to.be.an.array();
            Code.expect(pre.language.length).to.be.above(1);
            Code.expect(pre.language[0]).to.be.an.object();
            Code.expect(pre.language[0].code).to.equal('es'); // Si señor!

            done();
        });
    });

    lab.test('it should decode language tags to extract region, script and quality an from browser language header as per RFC-5646 best practices', (done) => {

        const request = {
            method: 'GET',
            url: '/',
            headers: {

                // Pero hombre, como que no hablath ethpañol?
                'accept-language': 'es-Latn-ES,en-US;q=0.9,en-GR;q=0.8,pt-PT;q=0.7,pt-BR;q=0.6'
            }
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            const pre = response.result.pre;
            const headers = response.result.headers;

            Code.expect(pre.language).to.exist();
            Code.expect(headers['accept-language']).to.exist();

            console.log(pre);

            Code.expect(pre.language).to.be.an.array();
            Code.expect(pre.language.length).to.be.above(4);

            Code.expect(pre.language[0].code).to.equal('es');
            Code.expect(pre.language[0].region).to.equal('ES'); // Ethpaña!
            Code.expect(pre.language[0].script).to.equal('Latn');
            Code.expect(pre.language[0].quality).to.equal(1);

            Code.expect(pre.language[1].code).to.equal('en');
            Code.expect(pre.language[1].region).to.equal('US');
            Code.expect(pre.language[1].script).to.equal(null);
            Code.expect(pre.language[1].quality).to.equal(0.9);

            Code.expect(pre.language[2].code).to.equal('en');
            Code.expect(pre.language[2].region).to.equal('GR');
            Code.expect(pre.language[2].script).to.equal(null);
            Code.expect(pre.language[2].quality).to.equal(0.8);

            Code.expect(pre.language[3].code).to.equal('pt');
            Code.expect(pre.language[3].region).to.equal('PT');
            Code.expect(pre.language[3].script).to.equal(null);
            Code.expect(pre.language[3].quality).to.equal(0.7);

            Code.expect(pre.language[4].code).to.equal('pt');
            Code.expect(pre.language[4].region).to.equal('BR');
            Code.expect(pre.language[4].script).to.equal(null);
            Code.expect(pre.language[4].quality).to.equal(0.6);

            done();
        });
    });
});



lab.experiment('Accept Language plugin w/ options', () => {

    lab.before((done) => {

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

        // Set default language to spanish
        hapiAcceptLanguage.options.defaultLanguage = 'es';

        server.register([hapiAcceptLanguage], {}, (err) => {

            if (err) {
                return done(err);
            }

            server.initialize(done);
        });
    });

    lab.test('it should default to defaultLanguage option when no language header is present', (done) => {

        const request = {
            method: 'GET',
            url: '/'
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            const pre = response.result.pre;
            const headers = response.result.headers;

            Code.expect(pre.language).to.exist();
            Code.expect(headers['accept-language']).to.not.exist();

            Code.expect(pre.language).to.be.an.array();
            Code.expect(pre.language[0]).to.be.an.object();
            Code.expect(pre.language[0].code).to.equal('es');

            done();
        });
    });
});
