'use strict';
var log = require('server/log'),
    fs  = require('fs'),
    path = require('path'),
    _ = require('lodash');

module.exports = function(api, config) {
    log.debug('api.gallery: initialising');

    api.get('/gallery/', listImages);

    function listImages(req, res, next) {
        fs.readdir(path.join(config.publicPath, 'gallery'), function(err, files) {
            if (err) return res.status(500).send(err);

            var images = _.map(files, function(img) {
                return {
                    original: '/gallery/' + img,
                    thumbnail: '/gallery/' + img,
                    description: path.basename(img, path.extname(img))
                };
            });

            res.json(images);
        });

    }

};
