'use strict';

require('./css/site.scss');

import React from 'react';
import Router from 'react-router';
import { Route, RouteHandler } from 'react-router';

import Nav from './components/Nav';
import Home from './pages/Home';

let App = React.createClass({
  render() {
    return (
      <div>
      <Nav />
      <RouteHandler/>
      </div>
    );
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
      <Route name="home" path="/home" handler={Home} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById("reactapp"));
});

module.hot.accept();
