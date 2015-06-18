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
        <h1>This is a big header</h1>
        <h2>This is a subheading</h2>
        <h3>This is a subheading</h3>
        <h4>This is a subheading</h4>
        <h5>This is a subheading</h5>
        <h6>This is a subheading</h6>
        <p>This is some text blah de blah</p>
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
  React.render(<Handler/>, document.body);
});

module.hot.accept();
