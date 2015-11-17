'use strict';

import React from 'react';
import Notifications from './components/Notify';
import Nav from './components/Nav';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        <Notifications />
        <div className="content-wrapper">
          {this.props.children}
        </div>
      </div>
    );
  }
};
