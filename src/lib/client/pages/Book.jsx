'use strict';
import 'moment/locale/en-gb';

import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import {notify} from 'react-notify-toast';

import validations from '../../shared/validations';
import {BookingUtils} from '../../shared/bookings';
import {Input, NumberInput} from '../components/Inputs';
import Form from '../components/Form';

var DatePicker = require('react-date-picker');

export default class Book extends React.Component {
    constructor(props, context) {
        super(props, context);
        let state = {
            form: {
                arrivalDate: {
                    value: null,
                    validations: [
                        new validations.Required(),
                        new validations.IsDate('DD/MM/YYYY')
                    ]
                },
                numberOfNights: {
                    value: 2,
                    validations: [
                        new validations.Required(),
                        new validations.IsNumber(),
                        new validations.WithinRange(2, 14)
                    ]
                },
                title: {
                    value: '',
                    validations: [
                        new validations.Required(),
                        new validations.StringLength(100)
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
                phone: {
                    value: ''
                },
                address: {
                    value: ''
                }
            },
            existingBookings: [],
            showDatePicker: false,
            price: null,
            origform: {}
        };
        state.origform = _.transform(state.form, function(result, n, key) {
            result[key] = n.value;
        });
        this.state = state;
    }

    static contextTypes = {
        history: React.PropTypes.object.isRequired
    }

    componentDidMount() {
        axios.get('/api/bookings').then(function(response) {
            this.setState({
                existingBookings: response.data
            });
        }.bind(this)).catch(function(response) {
            notify.show('Failed to load existing bookings. You can continue but we\'ll have to check for conflicts when you submit', 'warn');
        });
        document.body.addEventListener('click', this.checkHideDatePicker);
    }

    checkHideDatePicker = (e) => {
        if (this.state.showDatePicker
            && e.target.className !== 'date-picker-trigger'
            && !this.parentsHaveClassName(e.target, 'date-picker')) {
                this.hideDatePicker();
        }
    }

    componentWillUnmount = () => {
        document.body.removeEventListener('click', this.checkHideDatePicker);
    }

    parentsHaveClassName(element, className) {
        var parent = element;
        while (parent) {
            if (parent.className && parent.className.indexOf(className) > -1) return true;
            parent = parent.parentNode;
        }
    }

    _makeValueLink(key) {
        var d = this.state.form[key];
        return {
            value: d == null ? null : (moment.isMoment(d.value) ? d.value.format('DD/MM/YYYY') : d.value),
            requestChange: function(value) {
                this.onFormChange(key, value);
            }.bind(this)
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/bookings', this.formDataToBookingJson()).then(function(response) {
            this.context.history.pushState(null, `/pay/${response.data.id}`);
        }.bind(this)).catch(function(response) {
            notify.show('Sorry. We couldn\'t create your booking. Please try again', 'error');
        });
    }

    formDataToBookingJson() {
        return _.transform(this.state.form, function(result, n, key) {
            result[key] = (moment.isMoment(n.value) ? n.value.toISOString() : n.value);
        });
    }

    onArrivalDateChange = (dateText, m) => {
        var data = this.state.form;
        data.arrivalDate.value = m;
        this.validate(data);
        this.setState({
            form: data,
            showDatePicker: false
        });
        this.getPrice();
    }

    onArrivalDateFocus = (e) => {
        this.setState({
            showDatePicker: true
        });
    }

    hideDatePicker = () => {
        this.setState({
            showDatePicker: false
        });
    }

    validate(data) {
        let origform = this.state.origform;
        Object.keys(data).forEach(function(key) {
            let el = data[key],
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
    }

    onFormChange(key, value) {
        let data = this.state.form;
        data[key].value = value;
        //console.log('onFormChange:', key, value, data[key]);
        this.validate(data);
        this.setState({
            form: data
        });
        this.getPrice();
    }

    getPrice() {
        let data = this.state.form;
        axios.get('/api/bookingprice?'
            + 'arrivalDate=' + (data.arrivalDate.value && data.arrivalDate.value.toISOString())
            + '&numberOfNights=' + data.numberOfNights.value)
            .then(function(response) {
                this.setState({
                    price: response.data.price,
                    hasConflicts: BookingUtils.hasConflicts(this.formDataToBookingJson(), this.state.existingBookings)
                });
                }.bind(this))
            .catch(function(response) {
                notify.show('Oops. Something went wrong trying to get a price. Please try again', 'error');
            });
    }

    render() {
        let form = this.state.form;
        let formValid = _.every(form, function(el) {
            return el.isvalid;
        });
        let formDirty = _.some(form, function(el) {
            return el.isdirty;
        });
        let hasConflicts = this.state.hasConflicts || false;

        return (
            <div className='page-container'>
                <Form className='booking-form'
                        isValid={formValid}
                        isDirty={formDirty}
                        key={'BookForm'}>

                    <div className='row'>
                        <div className='split-controls'>

                            <Input
                                key='arrivalDate'
                                id='arrivalDate'
                                label='Arrival Date'
                                value={form.arrivalDate}
                                placeholder='Click to select'
                                readOnly={true}
                                onFocus={this.onArrivalDateFocus}
                                className='date-picker-trigger'
                                valueLink={this._makeValueLink('arrivalDate')}/>

                            {this.state.showDatePicker &&
                                <DatePicker
                                    minDate={new Date()}
                                    maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                                    dateFormat='DD/MM/YYYY'
                                    date={new Date()}
                                    onChange={this.onArrivalDateChange}
                                    hideFooter={true}/>
                            }

                            <NumberInput
                                key='numberOfNights'
                                id='numberOfNights'
                                label='Number of nights'
                                value={form.numberOfNights}
                                min={2}
                                max={14}
                                valueLink={this._makeValueLink('numberOfNights')}/>

                        </div>
                        <div className='split-bookingdescription'>
                            {hasConflicts &&
                                    <p>
                                        The dates/number of nights selected conflict with existing bookings.<br/>
                                        You can select an alternative or check our availability to see
                                        which dates are available.
                                    </p>
                            }
                            {!hasConflicts && this.state && this.state.price > 0 &&
                                    <p>
                                        {BookingUtils.getSummaryDescription(this.formDataToBookingJson())}<br/>
                                        Price: £{this.state.price}
                                    </p>
                            }
                        </div>
                    </div>
                    <Input
                        key='title'
                        id='title'
                        label='Title'
                        placeholder='Required'
                        value={form.title}
                        maxlength={100}
                        valueLink={this._makeValueLink('title')}/>

                    <Input
                        key='firstname'
                        id='firstname'
                        label='First name'
                        placeholder='Required'
                        value={form.firstname}
                        maxlength={100}
                        valueLink={this._makeValueLink('firstname')}/>

                    <Input
                        key='lastname'
                        id='lastname'
                        label='Last name'
                        placeholder='Required'
                        maxlength={100}
                        value={form.lastname}
                        valueLink={this._makeValueLink('lastname')}/>

                    <Input
                        key='email'
                        id='email'
                        label='Email'
                        type='email'
                        placeholder='Required'
                        value={form.email}
                        valueLink={this._makeValueLink('email')}/>

                    <Input
                        key='phone'
                        id='phone'
                        label='Telephone'
                        value={form.phone}
                        valueLink={this._makeValueLink('phone')}/>

                    <Input
                        key='address'
                        id='address'
                        label='Address'
                        value={form.address}
                        valueLink={this._makeValueLink('address')}/>

                    <button
                        type='submit'
                        onClick={this.handleSubmit}
                        disabled={!formValid || hasConflicts}>
                        Submit
                    </button>
                </Form>
            </div>);
    }
};

