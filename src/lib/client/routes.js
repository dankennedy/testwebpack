'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import Home from './pages/Home';
import Book from './pages/Book';
import Diary from './pages/Diary';
import Gallery from './pages/Gallery';
import Prices from './pages/Prices';
import Pay from './pages/Pay';

const routes = (
  <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
      <Route path="book" component={Book} />
      <Route path="gallery" component={Gallery} />
      <Route path="diary" component={Diary} />
      <Route path="prices" component={Prices} />
      <Route path="pay/:bookingId" component={Pay} />

      <Route path="*" component={Home} />
  </Route>
);

export default routes;
