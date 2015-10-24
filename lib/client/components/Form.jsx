'use strict';

import React from 'react';
import {classNames} from '../../shared/utils';

export default React.createClass({

  getInitialState() {
    return {
      isValid: true,
      isDirty: false
    };
  },
  _makeValueLink: function(key) {
    var d = this.props.formData[key];
    return {
      value: d == null ? null : d.value,
      requestChange: function(value) {
        this.props.onChange(key, value);
      }.bind(this)
    };
  },

  render() {

    React.Children.forEach(this.props.children, function (child) {
      if (child && child.key) {
        child.props.valueLink = this._makeValueLink(child.key);
      }
    }, this);

    return(
      <form className={classNames('', {'invalid': this.props.isValid===false, 'isdirty': this.props.isDirty})}>
        {this.props.children}
      </form>
    );
  }
});

