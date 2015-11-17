'use strict';

import React from 'react';
import { Link } from 'react-router';
const logo = 'images/header_logo.png';

export default class Nav extends React.Component {

  render() {
    return(
      <div className="nav-wrapper">
        <nav className="nav-row">
          <img src={logo} />
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/book">Book</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/prices">Prices</Link></li>
            <li><Link to="/diary">Availability</Link></li>
          </ul>
        </nav>
      </div>
    );
  }
};
