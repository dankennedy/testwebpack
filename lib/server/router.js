'use strict';

var express  = require('express'),
    log      = require('server/log'),
    api      = require('server/api');

module.exports = function(app, config) {

  app.get('/', function(req, res) {
      res.sendFile('index.html', {
          root: './public'
      });
  });

  app.get('/test', function(req, res) {
    log.warn('test');
    res.send('test content updated');
  });

  app.use('/api/', api(express.Router(), config)); // eslint-disable-line new-cap
};
