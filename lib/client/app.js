'use strict';

require('./css/site.scss');

import React from 'react';
import Router from 'react-router';
import { Link, Route, RouteHandler } from 'react-router';

import LoginHandler from './components/Login.js';

let App = React.createClass({
  render() {
    return (
      <div>
        <div className="nav">
          <Link to="app">Home</Link>
          <Link to="login">Login</Link>
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="login" path="/login" handler={LoginHandler}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById("reactapp"));
});

module.hot.accept();
