'use strict';
var log = require('server/log'),
    fs  = require('fs'),
    path = require('path'),
    _ = require('lodash');

module.exports = function(api, config) {

    log.debug('api.gallery: initialising');

    api.get('/gallery/', listImages);

    function listImages(req, res, next) {
        fs.readdir(path.join(config.publicPath, 'images/gallery'), function(err, files) {
            if (err) return res.status(500).send(err);

            var images = _.map(files, function(img) {
                return {
                    original: '/images/gallery/' + img,
                    thumbnail: '/images/gallery/' + img,
                    description: path.basename(img, path.extname(img))
                };
            });

            res.set('Cache-Control', 'public, max-age=3600');
            res.json(images);
        });

    }

};
