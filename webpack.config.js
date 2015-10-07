'use strict';

var webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: [
        'webpack/hot/only-dev-server',
        // The script refreshing the browser on none hot updates
        'webpack-dev-server/client?http://localhost:8080',
        './lib/client/app.js'
    ],
    output: {
        devtool: '#eval-source-map',
        path: __dirname + '/public/build',
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
        //new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]

};
