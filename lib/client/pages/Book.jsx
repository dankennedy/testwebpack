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

        <NumberInput id="numberofnights" label="Number of nights" value={2} min={2} max={14}
          validations={[new validations.Required()]} />

        <Input id="firstname" label="First name"
          placeholder="Required"
          maxlength={100}
          validations={[new validations.Required(), new validations.StringLength(100)]} />

        <Input id="lastname" label="Last name"
          placeholder="Required"
          maxlength={100}
          validations={[new validations.Required(), new validations.StringLength(100)]} />

        <Input id="email" label="Email" type="email"
          placeholder="Required"
          validations={[new validations.Required()]} />

        <Input id="address" label="Address" />

        <button type="submit" onClick={this.handleClick}>Submit</button>

      </div>
    );
  }
});

export default Book;


