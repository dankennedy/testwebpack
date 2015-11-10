'use strict';

import React from 'react';
import { Link } from 'react-router';

let Home = React.createClass({

  render() {
    return(
      <div className="home page-container">
        <div className="content-block">
          <h2>Welcome</h2>
          <p>
              Thimble Cottage is a grade 2 listed fishermans cottage in one of Whitby's oldest smugglers yards.
              Loggerhead Yard runs between New Quay Road on the harbourside and Baxtergate, the main shopping street.
              Within a few yards of the door you can either browse through the shops or be looking across the upper
              harbour towards Captain Cook's house. All over the town you will find tea rooms and cafes to relax in.
              There are also many pubs and restaurants serving delicious locally caught seafood.
          </p>
          <p>
              The cottage sleeps four people with one double bedroom on the first floor and two single beds on the second.
              To help the research of your next outing or simply to keep yourself entertained, the cottage provides free Wifi.
              Central heated throughout, secondary double glazing and a cosy gas fire Thimble Cottage offers the ideal base
              from where to explore this magnificent part of the UK.
          </p>
          <p>
              While there is no parking directly attached to the cottage, there is 24 hour secure car parking 100 yards
              away on the harbourside. If you don't mind a little walk you can usually find free parking a 5 minute walk
              back out of town on the side of Pannett Park.
          </p>
        </div>

        <div className="content-block last">
          <h2>Facilities</h2>
          <ul>
              <li>Sleeps 4</li>
              <li>Kitchenette with oven and microwave</li>
              <li>Fridge freezer</li>
              <li>Bed linen provided</li>
              <li>You will need to bring your own towels</li>
              <li>Central heating</li>
              <li>Smart TV &amp; DVD</li>
              <li>Wifi</li>
              <li>No pets (sorry)</li>
          </ul>
          <Link className="large btn" to="book">Book Now</Link>
        </div>

        <div className="content-block">
          <h2>Nearby</h2>
          <p>
              There are a selection of walk leaflets and maps for your use in the cottage.
              Why not leave the car and visit the many villages in the beautiful Esk Valley by rail from Whitby.
              At Grosmont you can catch the North York Moors Steam Railway and travel to Pickering or stop off at
              Goathland (Aidensfield in Heartbeat). There is an excellent sandy beach, two miles long, within easy
              walking distance of the cottage.
          </p>
          <p>
              There are coastal villages, cliff top walks and woodland walks in Newtondale, but best of all is
              the heather time when the moors are alive with colour.
          </p>
        </div>

        <div className="content-block">
            <h2>Where Are We</h2>
            <p>
                15 Loggerhead Yard, Whitby, YO21 1DL
            </p>
            <div id="map-canvas"></div>
        </div>

      </div>
    );
  }
});

export default Home;


