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

  render() {

    return(
      <form className={classNames('', {'invalid': this.props.isValid===false, 'isdirty': this.props.isDirty})}
            autoComplete={false}
            onClick={this.props.onClick}>
        {this.props.children}
      </form>
    );
  }
});

