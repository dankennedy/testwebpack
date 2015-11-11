'use strict';

var path = require('path'),
    _    = require('lodash'),

    assign  = _.assign,

    env    = process.env.NODE_ENV || 'local';

var config = module.exports = initConfig(env);

config.path = function(p) {
  if (p.indexOf('/') !== 0 ) {
    p = '/'+p;
  }
  return path.normalize(config.root+p);
};

function initConfig(env) {
  var envConfig = require(path.normalize(__dirname+'/../../config/' + env + '.json'));

  var config = assign({ env: env, root: path.normalize(__dirname+'/../../') },
                        require(__dirname+'/../../config/common.json') || {} );
  config = _.partialRight(_.merge, function deep(value, other) {
    return _.merge(value, other, deep);
  })(envConfig, config);

  config.env = env;
  config.publicPath = path.resolve('./public');
  config.isProduction = env === 'production';
  config.port = config.isProduction ? 8080 : 3001;
  config.dbUser = process.env.DBUSR;
  config.dbPwd = process.env.DBPWD;
  config.email.smtpUser = process.env.SMTPUSR;
  config.email.smtpPwd = process.env.SMTPPWD;

  return config;
}
