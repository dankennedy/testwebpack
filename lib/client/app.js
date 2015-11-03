'use strict';

import React from 'react';
import { RouteHandler } from 'react-router';
import Notifications from 'react-notify-toast';
import Nav from './components/Nav';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        <Notifications />
        <div className="content-wrapper">
          <RouteHandler/>
        </div>
      </div>
    );
  }
};
