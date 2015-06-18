'use strict';

import React from 'react';
import { Link } from 'react-router';

let Nav = React.createClass({

  render() {
    return(

      <nav className="nav-row">
        <ul>
          <li><Link to="home">Home</Link></li>
          <li><Link to="app">Home</Link></li>
          <li><Link to="app">Home</Link></li>
          <li><Link to="app">Home</Link></li>
        </ul>
      </nav>
    );
  }
});

export default Nav;


