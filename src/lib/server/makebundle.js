'use strict';

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./../../webpack.dev.config.js');

module.exports = function(log, config) {

    // First we fire up Webpack and pass in the configuration we
    // created
    var bundleStart = null;
    var compiler = webpack(webpackConfig);

    compiler.plugin('compile', function() {
        log.info('bundler: Bundling...');
        bundleStart = Date.now();
    });

    compiler.plugin('done', function() {
        log.info('bundler: Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    });

    var bundler = new WebpackDevServer(compiler, {

        // We need to tell Webpack to serve our bundled application
        // from the build path. When proxying:
        // http://localhost:3000/build -> http://localhost:8080/build
        publicPath: '/build/',

        // Configure hot replacement
        hot: true,

        // The rest is terminal configurations
        quiet: false,
        noInfo: true,
        stats: {
            colors: true
        }
    });

    bundler.listen(8080, 'localhost', function() {
        log.info('bundler: Bundling project, please wait...');
    });

};
