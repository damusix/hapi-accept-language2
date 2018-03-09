'use strict';

const ALparser = require('accept-language-parser');
const Package = require('./package');

module.exports = {
    name: Package.name,
    version: Package.version,
    register: function (server, options) {

        let defaultLanguage = 'en';

        if (options.defaultLanguage) {

            defaultLanguage = options.defaultLanguage;
        }

        server.ext('onPreHandler', (request, h) => {

            request.pre = request.pre || {};
            request.pre.language = ALparser.parse(request.raw.req.headers['accept-language'] || defaultLanguage);

            return h.continue;
        });

        server.log(['accept-language'], 'registered accept-language plugin');
    }
};
