'use strict';

import React from 'react';
import {classNames} from '../../shared/utils';
import Validations from '../../shared/validations';

class InputComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            initialValue: this.props.value,
            isValid: true,
            validationMessage: '',
            validationsAdded: false,
            isPristine: true,
            isdirty: false
        };
    }

    static defaultProps = {
        id: '',
        validations: [],
        handleChildChange: () => {},
        onChange: () => {},
        onFocus: () => {},
        onBlur: () => {}
    }

    handleChange = (event) => {

        var val = event.target.value;

        this.setState({
            value: val,
            isPristine: false,
            isDirty: val != this.state.initialValue
        });

        var validationResult = this.validate(val);

        this.props.handleChildChange(this.props.id,
            val,
            val != this.props.value,
            validationResult);

        this.props.onChange(event);

    }
    validate = (val) => {
        let vals = this.props.validations || [];
        if (!this.state.validationsAdded) {
            switch (this.props.type) {
                case 'email':
                    vals.push(new Validations.EmailAddress());
                    break;
                case 'number':
                    vals.push(new Validations.IsNumber());
                    break;
            }
            this.setState({
                validationsAdded: true
            });
        }

        if (vals.length) {
            for (var i = 0; i < vals.length; i++) {
                if (!vals[i].validate(val)) {
                    return {
                        isValid: false,
                        validationMessage: vals[i].validationMessage
                    };
                    return;
                }
            }
            return {
                isValid: true,
                validationMessage: ''
            };
        }
    }
};

export class Input extends InputComponent {

    constructor(props) {
        super(props);
    }

    static defaultProps = {
        type: 'text'
    }

    render() {
        var p = this.props,
            d = p.value;
        return (
            <div className={classNames('formfield', {'invalid': d.isvalid===false, 'isdirty': d.isdirty})}>
        <label htmlFor={p.id}>{p.label}</label>
        <input type={p.type || 'text'}
               id={p.id}
               name={p.id}
               ref={p.id}
               placeholder={p.placeholder}
               maxLength={p.maxlength}
               title={d.validationErrors}
               valueLink={p.valueLink}
               onFocus={p.onFocus}
               onBlur={p.onBlur}
               readOnly={this.props.readOnly}
               className={this.props.className}>
        </input>
      </div>
        );
    }
};


export class NumberInput extends InputComponent {

    constructor(props) {
        super(props);
    }

    static defaultProps = {
        type: 'number'
    }

    render() {
        var p = this.props,
            d = p.value;
        return (
            <div className={classNames('formfield', {'invalid': d.isvalid===false, 'isdirty': d.isdirty})}>
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
};

export class TextArea extends InputComponent {

    constructor(props) {
        super(props);
    }

    render() {
        var p = this.props,
            d = p.value;
        return (
            <div className={classNames('formfield', {'invalid': d.isvalid===false, 'isdirty': d.isdirty})}>
        <label htmlFor=''>{p.label}</label>
        <textarea
               id={p.id}
               name={p.id}
               placeholder={p.placeholder}
               value={this.state.value}
               title={d.validationErrors}
               valueLink={p.valueLink}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur.bind(this)}>
        </textarea>
      </div>
        );
    }
};
