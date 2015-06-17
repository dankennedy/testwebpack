'use strict';

var log = require('server/log');

module.exports = function(app) {
  app.get('/', function(req, res) {
      res.sendFile('index.html', {
          root: './public'
      });
  });

  app.get('/test', function(req, res) {
    log.warn('test');
    res.send('test content updated');
  });
};
