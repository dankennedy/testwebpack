'use strict';

import './css/site.scss';
import 'react-date-picker/index.css';

import React from 'react';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import ReactDOM from 'react-dom';

import routes from './routes';

let history = createBrowserHistory();
ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('app-container'));

if (_environment_ === 'development') {
    module.hot.accept();
}
