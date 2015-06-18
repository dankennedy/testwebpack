'use strict';

import React from 'react';
import FormField from '../components/FormField';

let Book = React.createClass({

  render() {
    return(
      <div className="Book">
        <FormField id="arrivaldate" label="Arrival Date" type="date" />
        <FormField id="numberofnights" label="Number of nights" type="number" />
        <FormField id="firstname" label="First name" />
        <FormField id="lastname" label="Last name" />
        <FormField id="email" label="Email" type="email" />
        <FormField id="address" label="Address" />
      </div>
    );
  }
});

export default Book;


