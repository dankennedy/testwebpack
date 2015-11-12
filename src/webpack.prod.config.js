'use strict';

var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

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
            exclude: /node_modules/,
            loader: 'babel',
        }, {
            test: /\.(css|scss)$/,
            loader: ExtractTextPlugin.extract('css!sass'),
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './views/production.tmpl',
            inject: 'body',
            minify: {collapseWhitespace: true},
            filename: 'index.tmpl'
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
        }),
        new webpack.DefinePlugin({
          _environment_: JSON.stringify(process.env.NODE_ENV || 'production'),
        }),
        new ExtractTextPlugin('styles.[hash].css')
    ]

};
