'use strict';

require('./css/site.scss');

import React from 'react';
import Router from 'react-router';
import { Route, RouteHandler } from 'react-router';

import Nav from './components/Nav';
import Home from './pages/Home';
import Book from './pages/Book';
import Diary from './pages/Diary';
import Gallery from './pages/Gallery';
import Prices from './pages/Prices';

let App = React.createClass({
  render() {
    return (
      <div>
      <Nav />
      <div className="content-wrapper">
        <div className="content-container">
          <RouteHandler/>
        </div>
      </div>
      </div>
    );
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
      <Route name="home" path="/home" handler={Home} />
      <Route name="book" path="/book" handler={Book} />
      <Route name="diary" path="/diary" handler={Diary} />
      <Route name="gallery" path="/gallery" handler={Gallery} />
      <Route name="prices" path="/prices" handler={Prices} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

module.hot.accept();
