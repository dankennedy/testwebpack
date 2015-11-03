'use strict';

import React from 'react';
import Router from 'react-router';
import { Route } from 'react-router';

import App from './App';
import Home from './pages/Home';
import Book from './pages/Book';
import Diary from './pages/Diary';
import Gallery from './pages/Gallery';
import Prices from './pages/Prices';
import Pay from './pages/Pay';

let DefaultRoute = Router.DefaultRoute,
    NotFoundRoute = Router.NotFoundRoute,
    routes = (
  <Route name="app" path="/" handler={App}>
      <Route name="home" path="home" handler={Home} />
      <Route name="book" path="book" handler={Book} />
      <Route name="diary" path="diary" handler={Diary} />
      <Route name="gallery" path="gallery" handler={Gallery} />
      <Route name="prices" path="prices" handler={Prices} />
      <Route name="pay" path="pay/:bookingId" handler={Pay} />

      <DefaultRoute handler={Home} />
      <NotFoundRoute handler={Home} />
  </Route>
);

export default routes;
