'use strict';

import React from 'react';

let Home = React.createClass({

  render() {
    return(
      <div className="Home">
          <h2>Welcome</h2>
          <p>
              Thimble Cottage is a grade 2 listed fishermans cottage in one of Whitby's oldest smugglers yards. Loggerhead Yard runs between New Quay Road on the harbourside and Baxtergate, the main shopping street. Within a few yards of the door you can either browse through the shops or be looking across the upper harbour towards Captain Cook's house. All over the town you will find tea rooms and cafes to relax in. There are also many pubs and restaurants serving delicious locally caught seafood.
          </p>
          <p>
              The cottage sleeps four people with one double bedroom on the first floor and two single beds on the second. To help the research of your next outing or simply to keep yourself entertained, the cottage provides free Wifi. Central heated throughout, secondary double glazing and a cosy gas fire Thimble Cottage offers the ideal base from where to explore this magnificent part of the UK.
          </p>
          <p>
              While there is no parking directly attached to the cottage, there is 24 hour secure car parking 100 yards
              away on the harbourside. If you don't mind a little walk you can usually find free parking a 5 minute walk
              back out of town on the side of Pannett Park.
          </p>
          <h2>Facilities</h2>
          <ul>
              <li>Sleeps 4</li>
              <li>Kitchenette with oven and microwave</li>
              <li>Fridge freezer</li>
              <li>Bed linen provided</li>
              <li>Central heating</li>
              <li>Smart TV &amp; DVD</li>
              <li>Wifi</li>
              <li>No pets (sorry)</li>
          </ul>

      </div>
    );
  }
});

export default Home;


