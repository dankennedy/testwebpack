'use strict';

import React from 'react';
import { Link } from 'react-router';

let Nav = React.createClass({

  render() {
    return(

      <nav className="nav-row">
        <ul>
          <li><Link to="home">Home</Link></li>
          <li><Link to="book">Book</Link></li>
          <li><Link to="gallery">Gallery</Link></li>
          <li><Link to="prices">Prices</Link></li>
          <li><Link to="diary">Availability</Link></li>
        </ul>
      </nav>
    );
  }
});

export default Nav;


