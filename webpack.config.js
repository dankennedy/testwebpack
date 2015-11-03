'use strict';

var webpack = require('webpack'),
    path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: [
        'webpack/hot/only-dev-server',
        'webpack-dev-server/client?http://localhost:8080',
        './lib/client/main.js'
    ],
    output: {
        devtool: '#eval-source-map',
        path: __dirname + '/views/build',
        filename: 'bundle.js',
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
            exclude: __dirname + '/node_modules',
            loader: 'eslint-loader'
        }],
        loaders: [{
            test: /(\.js|\.jsx)?$/,
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/
        }, {
            test: /\.(css|scss)$/,
            loader: 'style!css!sass?outputStyle=expanded&includePaths[]=' + (path.resolve(__dirname, './css')),
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url-loader?limit=8192'
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
