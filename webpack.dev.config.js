'use strict';

var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    debug: true,
    entry: {
        main: [
            'webpack/hot/only-dev-server',
            'webpack-dev-server/client?http://localhost:8080',
            path.join(__dirname, 'lib', 'client', 'main.js')
        ]
    },
    output: {
        pathinfo: true,
        path: path.join(__dirname, 'public', 'build'),
        publicPath: 'build/',
        filename: '[name].js'
    },
    resolve: {
        'extensions': [
            '',
            '.js',
            '.jsx'
        ]
    },
    module: {
        preLoaders: [{
            test: /\.jsx?/,
            exclude: /node_modules/,
            loader: 'eslint'
        }],
        loaders: [{
            test: /(\.js|\.jsx)?$/,
            exclude: /node_modules/,
            loader: 'babel',
        }, {
            test: /\.(css|scss)$/,
            loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap'),
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url?limit=8192'
        }]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]

};
