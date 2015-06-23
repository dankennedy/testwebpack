'use strict';

import React from 'react';
import {classNames} from '../../shared/utils';
import Validations from '../../shared/validations';

var InputMixin = {
  getDefaultProps() {
    return {validations: []};
  },
  getInitialState() {
    return {
      value: this.props.value,
      isValid: true,
      validationMessage: "",
      validationsAdded: false
    };
  },
  handleChange(event) {
    var val = event.target.value;
    this.setState({value: val});
    this.validate(val);
  },
  validate(val) {
    let vals = this.props.validations || [];

    if (!this.state.validationsAdded) {
        switch (this.props.type) {
          case "email" :
            vals.push(new Validations.EmailAddress());
            break;
          case "number" :
            vals.push(new Validations.IsNumber());
            break;
        }
        this.setState({validationsAdded: true});
    }

    if (vals.length) {
      for (var i = 0; i < vals.length; i++) {
        if (!vals[i].validate(val)) {
          this.setState({isValid: false, validationMessage: vals[i].validationMessage});
          return;
        }
      }
      this.setState({isValid: true, validationMessage: ""});
    }
  },
};

export var Input = React.createClass({
  mixins: [InputMixin],
  getDefaultProps() {
    return {type: "text"};
  },
  render() {
    return(
      <div className={classNames("formfield", {"invalid": !this.state.isValid})}>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input type={this.props.type || "text"}
               id={this.props.id}
               name={this.props.id}
               defaultValue={this.state.value}
               placeholder={this.props.placeholder}
               maxLength={this.props.maxlength}
               title={this.state.validationMessage}
               onChange={this.handleChange}>
        </input>
      </div>
    );
  }
});


export var NumberInput = React.createClass({
  mixins: [InputMixin],
  getDefaultProps() {
    return {type: "number"};
  },
  render() {
    return(
      <div className={classNames("formfield", {"invalid": !this.state.isValid})}>
        <label htmlFor="">{this.props.label}</label>
        <input type="number"
               id={this.props.id}
               name={this.props.id}
               min={this.props.min}
               max={this.props.max}
               placeholder={this.props.placeholder}
               defaultValue={this.props.value}
               title={this.state.validationMessage}
               onChange={this.handleChange}>
        </input>
      </div>
    );
  }
});

export var TextArea = React.createClass({
  mixins: [InputMixin],
  render() {
    return(
      <div className={classNames("formfield", {"invalid": !this.state.isValid})}>
        <label htmlFor="">{this.props.label}</label>
        <textarea
               id={this.props.id}
               name={this.props.id}
               placeholder={this.props.placeholder}
               defaultValue={this.props.value}
               title={this.state.validationMessage}
               onChange={this.handleChange}>
        </textarea>
      </div>
    );
  }
});
