'use strict';

import React from 'react';
let FormField = React.createClass({

  render() {
    return(
      <div className="formfield">
        <label htmlFor="">{this.props.label}</label>
        <input type={this.props.type || "text"}
               id={this.props.id}
               name={this.props.id}
               defaultValue={this.props.value}>
        </input>
      </div>
    );
  }
});

export default FormField;


