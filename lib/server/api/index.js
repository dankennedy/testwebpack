'use strict';
var log      = require('server/log');

module.exports = function(api) {
  log.debug('api: initialising');

  require('server/api/bookings')(api);

  api.use(notFound);
  api.use(errorHandler);

  return api;

  function notFound(req, res, next) {
    log.debug("api: not found '%s'", req.originalUrl);
    res.status(404).json({ status: 404, error: 'not found' });
  }

  function errorHandler(err, req, res, next) {
    var status = err.status || 500;
    log.error(err, "api: error [%d] '%s'", status, req.originalUrl);
    res.status(status).json({
      status: status,
      error: err.message || err.toString(),
      stack: err.stack
    });
  }
};
