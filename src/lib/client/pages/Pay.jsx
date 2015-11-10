'use strict';

import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {notify} from 'react-notify-toast';

import {Booking} from '../../shared/bookings';
import PaypalForm from '../components/PaypalForm';

let Pay = React.createClass({

    getInitialState() {
        return {
            booking: {}
        };
    },

    componentDidMount() {
        this.getBooking();
    },
    getBooking() {
        axios.get('/api/bookings/' + this.props.params.bookingId)
            .then(function(response) {
                this.setState({
                    booking: new Booking(response.data)
                });
            }.bind(this)).catch(function(response) {
                notify.show('Sorry. Failed to load that booking. Please check your link or email us.', 'error');
            });
    },

    handleApplyVoucher() {
        let voucherCode = this.refs.voucherCode.getDOMNode().value;


        if (!(/^[0-9a-fA-F]{24}$/).test(voucherCode)){
           notify.show('Sorry, that voucher code is invalid.', 'warning');
           return;
        }

        axios.put('/api/bookings/' + this.props.params.bookingId, {voucherCode: voucherCode})
            .then(function(response) {
                notify.show('Applied voucher', 'success');
                this.getBooking();
            }.bind(this)).catch(function(response) {
                notify.show('Sorry. An error occurred applying that voucher.', 'error');
            });
    },

    render() {
        let b = this.state.booking;
        if (!b.price)
            return <div></div>;

        return (
            <div className='page-container'>
                <h2>Thank you for booking with us</h2>
                <h4>Details of your stay</h4>
                <div className='instruction-section'>
                    <p>
                        Reference: {b._id}<br/>
                        Name: {b.firstname} {b.lastname}<br/>
                        Email: {b.email}<br/>
                        Arriving on {b.getArrivalDate().format('dddd Do MMMM')} and staying for {b.numberOfNights} nights
                    </p>
                    <p>
                        <a href={'/api/bookings/' + b._id + '/ical'} target='_blank'>Download calendar entry</a>
                    </p>
                </div>
                <div className='instruction-section'>
                    <h4>Payment instructions</h4>
                    <p>We appreciate your decision to book our cottage.</p>
                    {!b.isDepositPaid() &&
                        <p>Please note all bookings are
                        provisional until we receive
                        your deposit. If we don't receive the deposit within 14 days of booking we will
                        assume you have changed your mind and cancel it. You can use the links below
                        to pay either the deposit or the full amount online.</p>
                    }
                    {b.isDepositPaid() && !b.isBalancePaid() &&
                        <p>We have received your deposit already and your
                        booking is confirmed. You can use the links below
                        to pay the balance online. </p>
                    }
                    {b.isFullyPaid() &&
                        <p>All payments have been received. We hope you enjoy your
                        stay but please contact us if you have any other questions in the meantime.
                        After you leave us, please consider leaving a review or some feedback
                        on our Facebook page at <a href='https://www.facebook.com/thimblecottagewhitby'
                                target='_blank'
                                title='Thimble Cottage Whitby on Facebook'>
                                www.facebook.com/thimblecottagewhitby
                            </a>.
                        </p>
                    }
                </div>

                {!b.isFullyPaid() &&
                    <div className='instruction-section'>
                        <p>If you would prefer to pay by cheque then please write
                        your booking reference
                        (<strong><em>{b._id}</em></strong>) on the back, make them payable
                         to <strong><em>First Class Strategies Ltd</em></strong> and post them to<br/><br/>
                        <em>Thimble Cottage Admin<br/>
                        28 Hoyle Court Road<br/>
                        Baildon<br/>
                        SHIPLEY<br/>
                        BD17 6JP</em>
                        </p>
                    </div>
                }

                {!b.isFullyPaid() && !b.hasUsedVoucher() &&
                    <div className='instruction-section voucher-section'>
                        <p>If you have a voucher code you can enter it here.</p>
                        <input type='text' placeholder='Paste voucher code here' ref='voucherCode' />
                        <button type='submit' onClick={this.handleApplyVoucher}>Apply</button>
                    </div>
                }

                <table className='payment-table'>
                    <tbody>
                        {b.hasUsedVoucher() &&
                            <tr className='voucher-used'>
                                <td className='payment-type'>Voucher</td>
                                <td className='payment-amount'></td>
                                <td>{b.voucher.description}</td>
                                <td className='payment-type'></td>
                            </tr>
                        }
                        <tr>
                            <td className='payment-type'>Deposit</td>
                            <td className='payment-amount'>{b.deposit}</td>
                            <td>Due {b.getDepositDueDate().format('dddd Do MMMM')}</td>
                            <td className='payment-type'>
                                {!b.isDepositPaid() &&
                                    <PaypalForm amount={b.deposit}
                                        description={'deposit'}
                                        item_number={b._id}
                                        email={b.email}
                                        firstname={b.firstname}
                                        lastname={b.lastname} />
                                }
                                {b.isDepositPaid() &&
                                    <span>Received {moment(b.getDepositPayment().receivedDate).format('dddd Do MMMM')}</span>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>Balance</td>
                            <td className='payment-amount'>{b.getBalance()}</td>
                            <td>Due {b.getBalanceDueDate().format('dddd Do MMMM')}</td>
                            <td>
                                {b.isDepositPaid() && !b.isBalancePaid() &&
                                    <PaypalForm amount={b.getBalance()}
                                        description={'balance'}
                                        item_number={b._id}
                                        email={b.email}
                                        firstname={b.firstname}
                                        lastname={b.lastname} />
                                }
                                {b.isBalancePaid() &&
                                    <span>Received {moment(b.getBalancePayment().receivedDate).format('dddd Do MMMM')}</span>
                                }
                            </td>
                        </tr>
                        {!b.isDepositPaid() && !b.isBalancePaid() &&
                            <tr>
                                <td>Full Amount</td>
                                <td className='payment-amount'>{b.price}</td>
                                <td>Due {b.getBalanceDueDate().format('dddd Do MMMM')}</td>
                                <td>
                                    <PaypalForm amount={b.price}
                                        description={'full amount'}
                                        item_number={b._id}
                                        email={b.email}
                                        firstname={b.firstname}
                                        lastname={b.lastname} />
                                </td>
                            </tr>
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Total</td>
                            <td className='payment-amount'>{b.price}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>);
    }
});

export default Pay;
