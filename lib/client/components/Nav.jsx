'use strict';

import React from 'react';
import { Link } from 'react-router';
var logo = require('../img/header_logo.png');

let Nav = React.createClass({

  render() {
    return(
      <div className="nav-wrapper">
        <nav className="nav-row">
          <img src={logo} />
          <ul>
            <li><Link to="home">Home</Link></li>
            <li><Link to="book">Book</Link></li>
            <li><Link to="gallery">Gallery</Link></li>
            <li><Link to="prices">Prices</Link></li>
            <li><Link to="diary">Availability</Link></li>
          </ul>
        </nav>
      </div>
    );
  }
});

export default Nav;


