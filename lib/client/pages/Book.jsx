'use strict';
var validations = require('../../shared/validations');

import React from 'react';
import {Input, NumberInput} from '../components/Inputs';

let Book = React.createClass({

  handleClick() {
    console.log({
      'Arrival Date': this.refs.arrivaldate.state.value,
      'Nights': this.refs.numberofnights.state.value,
      'Firstname': this.refs.firstname.state.value,
      'Lastname': this.refs.lastname.state.value,
      'Email': this.refs.email.state.value,
      'Address': this.refs.address.state.value}
      );
  },
  render() {
    return(
      <div className="Book">

        <Input id="arrivaldate"
          label="Arrival Date"
          type="date"
          ref="arrivaldate"
          placeholder="Required (dd/mm/yyyy)"
          validations={[new validations.Required()]} />

        <NumberInput id="numberofnights"
          label="Number of nights"
          ref="numberofnights"
          value={2}
          min={2}
          max={14}
          validations={[new validations.Required(), new validations.WithinRange(2, 14)]} />

        <Input id="firstname"
          label="First name"
          ref="firstname"
          placeholder="Required"
          maxlength={100}
          validations={[new validations.Required(), new validations.StringLength(100)]} />

        <Input id="lastname"
          label="Last name"
          ref="lastname"
          placeholder="Required"
          maxlength={100}
          validations={[new validations.Required(), new validations.StringLength(100)]} />

        <Input id="email"
          label="Email"
          ref="email"
          type="email"
          placeholder="Required"
          validations={[new validations.Required()]} />

        <Input id="address"
          label="Address"
          ref="address"
          validations={[new validations.StringLength(255)]} />

        <button type="submit" onClick={this.handleClick}>Submit</button>

      </div>
    );
  }
});

export default Book;


