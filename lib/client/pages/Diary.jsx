'use strict';

import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

import {classNames} from '../../shared/utils';
import {Booking, BookingUtils} from '../../shared/bookings';

let Diary = React.createClass({

    getInitialState() {
        return {
            bookings: []
        };
    },

    componentDidMount() {
        axios.get('/api/bookings').then(function(response) {
            this.setState({
                bookings: _.map(response.data, function(b) {
                    return new Booking(b);
                })
            });
        }.bind(this)).catch(function(response) {
            console.error(response);
        });
    },

    getDateState(dt) {
        return BookingUtils.getDateState(dt, this.state.bookings);
    },

    render() {
        let yearNodes = _.map([moment().startOf('month'), moment().add(1, 'years').startOf('year')], m => {
            return <DiaryYear
                        startMoment={m}
                        handleGetDateState={this.getDateState} />;
        });

        return(
            <div className='page-container'>
                <DiaryKey />
                {yearNodes}
            </div>
        );
    }
});

let DiaryKey = React.createClass({

    render() {
        let keyNodes = _.map([
            {class:'changeover', desc:'ChangeOver'},
            {class:'arrival', desc:'Arrival'},
            {class:'departure', desc:'Departure'},
            {class:'busy', desc:'Booked'}],
            k => {
                return <div className='diary-key-entry'>
                    <span className={classNames('diary-key-cell ' + k.class)}></span>
                    <span className='diary-key-desc'>{k.desc}</span>
                </div>;
        });

        return (
            <div className='diary-key'>
                <h5>Key</h5>
                {keyNodes}
            </div>
        );
    }
});

let DiaryYear = React.createClass({

    render() {
        let start = this.props.startMoment,
            end = moment(start).add(1, 'years').startOf('year'),
            year = start.get('year'),
            monthNodes = [];

        for (var m = moment(start); m < end; m.add(1, 'months')) {
            monthNodes.push(<DiaryMonth
                                startMoment={moment(m)}
                                handleGetDateState={this.props.handleGetDateState} />);
        }

        return (
            <div className='diary-year'>
                <h4>{year} Availability</h4>
                {monthNodes}
            </div>
        );
    }
});

let DiaryMonth = React.createClass({

    render() {

        let start = this.props.startMoment,
            end = moment(start).add(1, 'months'),
            weekStart = moment(start).startOf('week'),
            weekNodes = [];

        for (var w = 0; w < 6; w++) {

            let m = moment(weekStart).add(w, 'weeks'),
                dayNodes = [];

            if (m.isAfter(end))
                break;

            for (var i = 0; i < 7; i++) {
                let diaryDate = moment(m).add(i, 'days');
                dayNodes.push(<DiaryDay
                    date={diaryDate}
                    month={start}
                    handleGetDateState={this.props.handleGetDateState} />);
            };
            weekNodes.push(<tr key={moment(m)}>{dayNodes}</tr>);
        }
        return (
            <table className='diary-month'>
                <thead>
                    <tr><th colSpan='7'>{start.format('MMMM')}</th></tr>
                    <tr>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                        <th>Sun</th>
                    </tr>
                </thead>
                <tbody>
                    {weekNodes}
                </tbody>
            </table>
        );
    }
});

let DiaryDay = React.createClass({

    render() {
        let d = this.props.date,
            busyState = this.props.handleGetDateState(d);

        return (
            <td className={classNames('', {
                    'notinmonth': d.format('YYYYMM')!=this.props.month.format('YYYYMM'),
                    'arrivalday': busyState.isArrivalDay,
                    'departureday': busyState.isDepartureDay,
                    'busyday': busyState.isBusyDate
                })}>
                {this.props.date.get('date')}
            </td>
        );
    }
});

export default Diary;


