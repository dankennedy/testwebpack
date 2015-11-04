'use strict';

var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: [
            path.join(__dirname, 'lib', 'client', 'main.js')
        ]
    },
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '',
        filename: '[name].[hash].js'
    },
    resolve: {
        extensions: [
            '',
            '.js',
            '.jsx'
        ],
        modulesDirectories: [
            'node_modules'
        ]
    },
    module: {
        preLoaders: [{
            test: /\.jsx?/,
            loader: 'eslint'
        }],
        loaders: [{
            test: /(\.js|\.jsx)?$/,
            loader: 'babel',
        }, {
            test: /\.(css|scss)$/,
            loader: 'style!css!sass?outputStyle=expanded&includePaths[]=' + path.join(__dirname, 'lib', 'client', 'css'),
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url?limit=8192'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './views/layout.html',
            inject: 'body'
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        })
    ]

};
