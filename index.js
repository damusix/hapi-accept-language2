'use strict';

const ALparser = require('accept-language-parser');
const Package = require('./package');

module.exports.register = function (server, options, next) {

    let defaultLanguage = 'en';

    if (options.defaultLanguage) {

        defaultLanguage = options.defaultLanguage;
    }

    server.ext('onPreHandler', (request, reply) => {

        request.pre = request.pre || {};
        request.pre.language = ALparser.parse(request.raw.req.headers['accept-language'] || defaultLanguage);

        return reply.continue();
    });

    server.log(['accept-language'], 'registered accept-language plugin');

    next();
};

module.exports.register.attributes = {

    name: 'hapi-accept-language2',
    version: Package.version
};
