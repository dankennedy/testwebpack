'use strict';
var validations = require('../../shared/validations');

import React from 'react';
import {Input, NumberInput} from '../components/Inputs';

let Book = React.createClass({

  handleClick() {
    console.log(this.refs.arrivaldate);
    console.log(this.refs.arrivaldate.state.value);
  },
  render() {
    return(
      <div className="Book">
        <Input id="arrivaldate" label="Arrival Date" type="date" ref="arrivaldate"
          placeholder="Required (dd/mm/yyyy)"
          validations={[new validations.Required()]} />
        <NumberInput id="numberofnights" label="Number of nights" value={2} min={2} max={14} />
        <Input id="firstname" label="First name" />
        <Input id="lastname" label="Last name" />
        <Input id="email" label="Email" type="email" />
        <Input id="address" label="Address" />
        <button type="submit" onClick={this.handleClick}>Submit</button>
      </div>
    );
  }
});

export default Book;


