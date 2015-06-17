'use strict';

var _ = require('lodash'),
  utils = require('shared/utils');

module.exports = function(app) {
  console.log('in router ' + app);

  app.get('/test', function(req, res) {
    console.log(_);
    utils.outputSomeStuff('blah de blah from the server');
    res.send('test content');
  });
};
