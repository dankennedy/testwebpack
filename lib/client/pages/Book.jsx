'use strict';
var validations = require('../../shared/validations');

import 'react-date-picker/index.css';
import 'moment/locale/en-gb';

var DatePicker = require('react-date-picker');

import React from 'react';
import {Input, NumberInput} from '../components/Inputs';
import Form from '../components/Form';

let Book = React.createClass({

  getInitialState() {
    return {
      arrivaldate: {
        value: null,
        validations: [new validations.Required(), new validations.IsDate('DD/MM/YYYY')]
      },
      numberofnights: {
        value: 2,
        validations: [new validations.Required(), new validations.IsNumber(), new validations.WithinRange(2, 14)]
      },
      firstname: {
        value: '',
        validations: [new validations.Required(), new validations.StringLength(100)]
      },
      lastname: {
        value: '',
        validations: [new validations.Required(), new validations.StringLength(100)]
      },
      email: {
        value: '',
        validations: [new validations.Required(), new validations.EmailAddress()]
      },
      address: {
        value: ''
      }
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    console.log('Submitting: ', this.state);
  },
  onArrivalDateChange(dateText) {
    var data = this.state;
    data.arrivaldate.value = dateText;
    data.showDatePicker = false;
    this.setState(data);
  },
  onArrivalDateFocus() {
    this.setState({showDatePicker: true});
  },
  onFormChange(key, value) {
    var data = this.state;
    data[key].value = value;
    Object.keys(data).forEach(function(key) {
      var el = data[key];
      el.isvalid = true;
      el.validationErrors = [];
      if (el.validations && el.validations.length) {
        for (var i = 0; i < el.validations.length; i++) {
          if (!el.validations[i].validate(el.value)) {
            el.isvalid = false;
            el.validationErrors.push(el.validations[i].validationMessage);
          }
        }
      }
    });
    console.log('onFormChange:', key, value, data[key]);
    this.setState(data);
  },
  render() {
    return(
      <Form className='Book page-container' onChange={this.onFormChange} formData={this.state}>

        <Input key='arrivaldate' id='arrivaldate'
          label='Arrival Date'
          type='text'
          value={this.state.arrivaldate}
          placeholder='Click to select'
          onFocus={this.onArrivalDateFocus} />

        {this.state.showDatePicker &&
          <DatePicker
            minDate={new Date()}
            maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
            dateFormat='DD/MM/YYYY'
            date={new Date()}
            onChange={this.onArrivalDateChange} />
        }

        <NumberInput key='numberofnights' id='numberofnights'
          label='Number of nights'
          value={this.state.numberofnights}
          min={2}
          max={14} />

        <Input key='firstname' id='firstname'
          label='First name'
          placeholder='Required'
          value={this.state.firstname}
          maxlength={100} />

        <Input key='lastname' id='lastname'
          label='Last name'
          placeholder='Required'
          maxlength={100}
          value={this.state.lastname} />

        <Input key='email' id='email'
          label='Email'
          type='email'
          placeholder='Required'
          value={this.state.email} />

        <Input key='address' id='address'
          label='Address'
          value={this.state.address} />

        <button type='submit' onClick={this.handleSubmit}>Submit</button>

      </Form>
    );
  }
});

export default Book;


