'use strict';
import validations from '../../shared/validations';

import _ from 'lodash';

import 'react-date-picker/index.css';
import 'moment/locale/en-gb';
import {classNames} from '../../shared/utils';

var DatePicker = require('react-date-picker');

import React from 'react';
import {Input, NumberInput} from '../components/Inputs';
import Form from '../components/Form';

let Book = React.createClass({

  getInitialState() {
    var state = {
      form: {
        arrivaldate: {
          value: null,
          validations: [
            new validations.Required(),
            new validations.IsDate('DD/MM/YYYY')
          ]
        },
        numberofnights: {
          value: 2,
          validations: [
            new validations.Required(),
            new validations.IsNumber(),
            new validations.WithinRange(2, 14)
          ]
        },
        firstname: {
          value: '',
          validations: [
            new validations.Required(),
            new validations.StringLength(100)
          ]
        },
        lastname: {
          value: '',
          validations: [
            new validations.Required(),
            new validations.StringLength(100)
          ]
        },
        email: {
          value: '',
          validations: [
            new validations.Required(),
            new validations.EmailAddress()
          ]
        },
        address: {
          value: ''
        }
      }
    };

    state.origform = _.transform(state.form, function(result, n, key) {
      result[key] = n.value;
    });

    return state;
  },

  handleSubmit(e) {
    e.preventDefault();
    console.log('Submitting: ', this.state);
  },

  onArrivalDateChange(dateText) {
    var data = this.state.form;
    data.arrivaldate.value = dateText;
    this.validate(data);
    this.setState({form: data, showDatePicker: false});
  },

  onArrivalDateFocus() {
    this.setState({showDatePicker: true});
  },

  validate(data) {
    let origform = this.state.origform;
    Object.keys(data).forEach(function(key) {

      var el = data[key],
          vals = el.validations;

      el.isvalid = true;
      el.validationErrors = [];
      el.isdirty = !_.isEqual(el.value, origform[key]);

      if (vals && vals.length) {
        for (var i = 0; i < vals.length; i++) {
          if (!vals[i].validate(el.value)) {
            el.validationErrors.push(vals[i].validationMessage);
          }
        }
        el.isvalid = !el.validationErrors.length;
      }
    });
  },

  onFormChange(key, value) {
    var data = this.state.form;
    data[key].value = value;
    // console.log('onFormChange:', key, value, data[key]);
    this.validate(data);
    this.setState({form: data});
  },

  render() {
    let form = this.state.form;

    let formValid = _.every(form, function(el) {
      return el.isvalid;
    });
    let formDirty = _.some(form, function(el) {
      return el.isdirty;
    });

    //console.log(this.state);
    // let errors = _.map(_.uniq(_.flatten(_.pluck(form, 'validationErrors'))), function(x) {
    //   return <p>{x}</p>;
    // });
    // console.log('rendering');
    return(

      <Form className={classNames('page-container')}
            onChange={this.onFormChange}
            formData={form}
            isValid={formValid}
            isDirty={formDirty}>

        <Input key='arrivaldate' id='arrivaldate'
          label='Arrival Date'
          type='text'
          value={form.arrivaldate}
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
          value={form.numberofnights}
          min={2}
          max={14} />

        <Input key='firstname' id='firstname'
          label='First name'
          placeholder='Required'
          value={form.firstname}
          maxlength={100} />

        <Input key='lastname' id='lastname'
          label='Last name'
          placeholder='Required'
          maxlength={100}
          value={form.lastname} />

        <Input key='email' id='email'
          label='Email'
          type='email'
          placeholder='Required'
          value={form.email} />

        <Input key='address' id='address'
          label='Address'
          value={form.address} />

        <button type='submit' onClick={this.handleSubmit} disabled={!formValid}>Submit</button>

      </Form>
    );
  }
});

export default Book;


