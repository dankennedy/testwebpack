'use strict';
var log      = require('server/log');

module.exports = function(api, config) {
  log.debug('api: initialising');

  require('server/api/bookings')(api, config);
  require('server/api/pricebands')(api, config);
  require('server/api/gallery')(api, config);

  api.use(notFound);
  api.use(errorHandler);

  return api;

  function notFound(req, res, next) {
    log.debug("api: not found '%s'", req.originalUrl);
    res.sendStatus(404);
  }

  function errorHandler(err, req, res, next) {
    var status = err.status || 500;
    log.error(err, "api: error [%d] '%s'", status, req.originalUrl);

    if (config.isProduction) {
      return res.sendStatus(500);
    }

    res.status(status).json({
      status: status,
      error: err.message || err.toString(),
      stack: err.stack
    });
  }
};
