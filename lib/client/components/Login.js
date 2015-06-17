'use strict';

import React from 'react';
import _ from 'lodash';
import utils from '../../shared/utils';

let Login = React.createClass({

  render() {
    _.map([1,2,3,4,5], function(i) {
      console.log(i);
    });
    console.log(utils);
    utils.outputSomeStuff('blah de blah blah');
    return(<div>Welcome to the login page</div>);
  }
});

export default Login;
