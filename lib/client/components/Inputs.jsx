'use strict';

import React from 'react';
import {classNames} from '../../shared/utils';

export var Input = React.createClass({

  getInitialProps() {
    return {validations: []};
  },
  getInitialState() {
    return {value: this.props.value, isvalid: true, validationmessage: ""};
  },
  handleChange(event) {
    var val = event.target.value;
    this.setState({value: val});
    this.validate(val);
  },
  validate(val) {
    let vals = this.props.validations;
    if (vals.length) {
      for (var i = 0; i < vals.length; i++) {
        if (!vals[i].validate(val)) {
          this.setState({isvalid: false, validationmessage: vals[i].message});
          return;
        }
      }
      this.setState({isvalid: true, validationmessage: ""});
    }
  },
  render() {
    return(
      <div className={classNames("formfield", {"invalid": !this.state.isvalid})} ref="wrapper">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input type={this.props.type || "text"}
               id={this.props.id}
               name={this.props.id}
               defaultValue={this.state.value}
               placeholder={this.props.placeholder}
               onChange={this.handleChange}
               ref="input">
        </input>
      </div>
    );
  }
});


export var NumberInput = React.createClass({

  render() {
    return(
      <div className="formfield">
        <label htmlFor="">{this.props.label}</label>
        <input type="number"
               id={this.props.id}
               name={this.props.id}
               min={this.props.min || 0}
               max={this.props.max || 100}
               placeholder={this.props.placeholder}
               defaultValue={this.props.value}>
        </input>
      </div>
    );
  }
});

export var TextArea = React.createClass({

  render() {
    return(
      <div className="formfield">
        <label htmlFor="">{this.props.label}</label>
        <textarea
               id={this.props.id}
               name={this.props.id}
               placeholder={this.props.placeholder}
               defaultValue={this.props.value}>
        </textarea>
      </div>
    );
  }
});
