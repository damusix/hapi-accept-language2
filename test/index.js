'use strict';

const Lab = require('lab');
const { expect } = require('code');
const Hapi = require('hapi');

const AcceptLanguagePlugin = require('..');

const { experiment, before, it } = exports.lab = Lab.script();


let server;

experiment('Accept Language plugin w/o options', () => {

    before(async () => {

        server = new Hapi.Server({ port: 4111 });

        server.route({

            method: 'GET',
            path: '/',
            handler: (request, h) => {

                return {
                    headers: request.raw.req.headers,
                    pre: request.pre
                };
            }
        });

        await server.register([AcceptLanguagePlugin]);
        await server.initialize();
    });

    it('should default to english when no language header is present', async () => {

        const request = {
            method: 'GET',
            url: '/'
        };

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.object();

        const pre = response.result.pre;
        const headers = response.result.headers;

        expect(pre.language).to.exist();
        expect(headers['accept-language']).to.not.exist();

        expect(pre.language).to.be.an.array();
        expect(pre.language[0]).to.be.an.object();
        expect(pre.language[0].code).to.equal('en');
    });

    it('should set a language cookie from browser language header', async () => {

        const request = {
            method: 'GET',
            url: '/',
            headers: {

                // Se habla español?
                'accept-language': 'es, en'
            }
        };

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.object();

        const pre = response.result.pre;
        const headers = response.result.headers;

        expect(pre.language).to.exist();
        expect(headers['accept-language']).to.exist();

        expect(pre.language).to.be.an.array();
        expect(pre.language.length).to.be.above(1);
        expect(pre.language[0]).to.be.an.object();
        expect(pre.language[0].code).to.equal('es'); // Si señor!

    });

    it('should decode language tags to extract region, script and quality an from browser language header as per RFC-5646 best practices', async () => {

        const request = {
            method: 'GET',
            url: '/',
            headers: {

                // Pero hombre, como que no hablath ethpañol?
                'accept-language': 'es-Latn-ES,en-US;q=0.9,en-GR;q=0.8,pt-PT;q=0.7,pt-BR;q=0.6'
            }
        };

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.object();

        const pre = response.result.pre;
        const headers = response.result.headers;

        expect(pre.language).to.exist();
        expect(headers['accept-language']).to.exist();

        console.log(pre);

        expect(pre.language).to.be.an.array();
        expect(pre.language.length).to.be.above(4);

        expect(pre.language[0].code).to.equal('es');
        expect(pre.language[0].region).to.equal('ES'); // Ethpaña!
        expect(pre.language[0].script).to.equal('Latn');
        expect(pre.language[0].quality).to.equal(1);

        expect(pre.language[1].code).to.equal('en');
        expect(pre.language[1].region).to.equal('US');
        expect(pre.language[1].script).to.equal(null);
        expect(pre.language[1].quality).to.equal(0.9);

        expect(pre.language[2].code).to.equal('en');
        expect(pre.language[2].region).to.equal('GR');
        expect(pre.language[2].script).to.equal(null);
        expect(pre.language[2].quality).to.equal(0.8);

        expect(pre.language[3].code).to.equal('pt');
        expect(pre.language[3].region).to.equal('PT');
        expect(pre.language[3].script).to.equal(null);
        expect(pre.language[3].quality).to.equal(0.7);

        expect(pre.language[4].code).to.equal('pt');
        expect(pre.language[4].region).to.equal('BR');
        expect(pre.language[4].script).to.equal(null);
        expect(pre.language[4].quality).to.equal(0.6);
    });
});



experiment('Accept Language plugin w/ options', () => {

    before(async () => {

        server = new Hapi.Server({ port: 4111 });

        server.route({

            method: 'GET',
            path: '/',
            handler: (request, reply) => {

                return {
                    headers: request.raw.req.headers,
                    pre: request.pre
                };
            }
        });

        // Set default language to spanish
        // AcceptLanguagePlugin.options.defaultLanguage = 'es';

        await server.register([{
            plugin: AcceptLanguagePlugin,
            options: { defaultLanguage: 'es' }
        }]);
        await server.initialize();
    });

    it('should default to defaultLanguage option when no language header is present', async () => {

        const request = {
            method: 'GET',
            url: '/'
        };

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.object();

        const pre = response.result.pre;
        const headers = response.result.headers;

        expect(pre.language).to.exist();
        expect(headers['accept-language']).to.not.exist();

        expect(pre.language).to.be.an.array();
        expect(pre.language[0]).to.be.an.object();
        expect(pre.language[0].code).to.equal('es');
    });
});
