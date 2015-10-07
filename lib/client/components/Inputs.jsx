'use strict';

import React from 'react';
import {classNames} from '../../shared/utils';
import Validations from '../../shared/validations';

var InputMixin = {
  getDefaultProps() {
    return {id: '', validations: [], handleChildChange: function(){}};
  },
  getInitialState() {
    return {
      value: this.props.value,
      initialValue: this.props.value,
      isValid: true,
      validationMessage: '',
      validationsAdded: false,
      isPristine: true,
      isDirty: false
    };
  },
  handleChange(event) {

    var val = event.target.value;

    this.setState({
      value: val,
      isPristine: false,
      isDirty: val != this.state.initialValue
    });

    var validationResult = this.validate(val);

    if (this.props.handleChildChange) {
      this.props.handleChildChange(this.props.id,
        val,
        val != this.props.value,
        validationResult);
    }

    if (this.props.onChange) {
      this.props.onChange(event);
    }

  },
  handleFocus(event) {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  },
  handleBlur(event) {
    if (this.props.onBlur) {
        this.props.onBlur(event);
    }
  },
  validate(val) {
    let vals = this.props.validations || [];
    if (!this.state.validationsAdded) {
        switch (this.props.type) {
          case 'email' :
            vals.push(new Validations.EmailAddress());
            break;
          case 'number' :
            vals.push(new Validations.IsNumber());
            break;
        }
        this.setState({validationsAdded: true});
    }

    if (vals.length) {
      for (var i = 0; i < vals.length; i++) {
        if (!vals[i].validate(val)) {
          return {isValid: false, validationMessage: vals[i].validationMessage};
          return;
        }
      }
      return {isValid: true, validationMessage: ''};
    }
  },
};

export var Input = React.createClass({
  mixins: [InputMixin],
  getDefaultProps() {
    return {type: 'text'};
  },
  render() {
    var p = this.props, d = p.value;
    return(
      <div className={classNames('formfield', {'invalid': d.isvalid===false})}>
        <label htmlFor={p.id}>{p.label}</label>
        <input type={p.type || 'text'}
               id={p.id}
               name={p.id}
               placeholder={p.placeholder}
               maxLength={p.maxlength}
               title={d.validationErrors}
               valueLink={p.valueLink}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur}>
        </input>
      </div>
    );
  }
});


export var NumberInput = React.createClass({
  mixins: [InputMixin],
  getDefaultProps() {
    return {type: 'number'};
  },
  render() {
    var p = this.props, d = p.value;
    return(
      <div className={classNames('formfield', {'invalid': d.isvalid===false})}>
        <label htmlFor=''>{p.label}</label>
        <input type='number'
               id={p.id}
               name={p.id}
               min={p.min}
               max={p.max}
               placeholder={p.placeholder}
               title={d.validationErrors}
               valueLink={p.valueLink}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur}>
        </input>
      </div>
    );
  }
});

export var TextArea = React.createClass({
  mixins: [InputMixin],
  render() {
    var p = this.props, d = p.value;
    return(
      <div className={classNames('formfield', {'invalid': d.isvalid===false})}>
        <label htmlFor=''>{p.label}</label>
        <textarea
               id={p.id}
               name={p.id}
               placeholder={p.placeholder}
               value={this.state.value}
               title={d.validationErrors}
               valueLink={p.valueLink}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur}>
        </textarea>
      </div>
    );
  }
});
