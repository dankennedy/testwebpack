'use strict';

import './css/site.scss';
import 'react-date-picker/index.css';

import React from 'react';
import Router from 'react-router';

import routes from './routes';

Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.body);
});

// if (module.hot) {
  module.hot.accept();
// }
