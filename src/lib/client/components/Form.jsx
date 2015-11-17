'use strict';

import React from 'react';
import {classNames} from '../../shared/utils';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isValid: true,
            isDirty: false
        };
    }

    render() {

        return (
            <form className={classNames('', {'invalid': this.props.isValid===false, 'isdirty': this.props.isDirty})}
                    autoComplete={false}
                    onClick={this.props.onClick}
                    key={this.props.key}>
                {this.props.children}
            </form>
        );
    }
};
