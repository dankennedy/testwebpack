'use strict';

import React from 'react';
import _ from 'lodash';
import axios from 'axios';

export default class Prices extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pricebands: []
        };
    }

    componentDidMount() {
        axios.get('/api/pricebands').then(function(response) {
            this.setState({
                pricebands: response.data
            });
        }.bind(this)).catch(function(response) {
            console.error(response);
        });
    }

    render() {
        let yearNodes = Object.keys(this.state.pricebands).map(el => {
            return <PricebandYear year={el} entries={this.state.pricebands[el]} key={el} />;
        });
        return (
            <div className='page-container'>
                {yearNodes}
            </div>);
    }
};

class PricebandYear extends React.Component {

    render() {
        return (
            <div className='priceband-year'>
                <h4>{this.props.year} Prices</h4>
                <PricebandTable entries={this.props.entries} />
            </div>
        );
    }
};

class PricebandTable extends React.Component {

    render() {
        let dayHeaderNodes = _.range(6).map(d => {
            return <th key={d}>{d+2}</th>;
        });

        let monthRows = _.chunk(this.props.entries, 6).map((m, i) => {
            return <PricebandTableRow entries={m} key={i} />;
        });

        return (
            <table className='priceband-table'>
                <thead>
                    <tr><th></th><th colSpan='6'>Number of nights</th></tr>
                    <tr><th></th>{dayHeaderNodes}</tr>
                </thead>
                <tbody>
                    {monthRows}
                </tbody>
            </table>
        );
    }
};

class PricebandTableRow extends React.Component {

    render() {
        let els = this.props.entries;
        let priceCells = els.map((p, i) => {
            return <td key={i}>{p.price}</td>;
        });
        return (
            <tr>
                <td>{els[0].monthname}</td>
                {priceCells}
            </tr>
        );
    }
};
