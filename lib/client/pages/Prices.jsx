'use strict';
import React from 'react';
import axios from 'axios';

let Prices = React.createClass({

    getInitialState() {
        return {
            pricebands: []
        };
    },

    componentDidMount() {
        axios.get('/api/pricebands').then(function(response) {
            this.setState({
                pricebands: response.data
            });
        }.bind(this)).catch(function(response) {
            console.error(response);
        });
    },

    render() {
        let yearNodes = Object.keys(this.state.pricebands).map(el => {
            return <PricebandYear year={el} entries={this.state.pricebands[el]} />;
        });
        return (
            <div className='page-container'>
                {yearNodes}
            </div>);
    }
});

let PricebandYear = React.createClass({

    render() {
        return (
            <div className='priceband-year'>
                <h4>{this.props.year} Prices</h4>
                <PricebandTable entries={this.props.entries} />
            </div>
        );
    }
});

let PricebandTable = React.createClass({

    render() {
        let dayHeaderNodes = _.range(6).map(d => {
            return <th>{d+2}</th>;
        });

        let monthRows = _.chunk(this.props.entries, 6).map(m => {
            return <PricebandTableRow entries={m} />;
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
});

let PricebandTableRow = React.createClass({

    render() {
        let els = this.props.entries;
        let priceCells = els.map(p => {
            return <td>{p.price}</td>;
        });
        return (
            <tr>
                <td>{els[0].monthname}</td>
                {priceCells}
            </tr>
        );
    }
});

export default Prices;
