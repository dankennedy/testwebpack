'use strict';

var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: {
        main: [
            'webpack/hot/only-dev-server',
            'webpack-dev-server/client?http://localhost:8080',
            __dirname + '/lib/client/main.js'
        ]
    },
    output: {
        devtool: '#eval-source-map',
        path: __dirname + '/build',
        filename: '[name].js',
        publicPath: '/build/'
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
            loaders: ['babel'],
            exclude: /node_modules/
        }, {
            test: /\.(css|scss)$/,
            loader: 'style!css!sass?outputStyle=expanded&includePaths[]=' + (__dirname + '/lib/client/css'),
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url?limit=8192'
        }],
        postLoaders: []
    },
    jsx: {
        //Options to jsx-loader https://github.com/petehunt/jsx-loader
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]

};
