'use strict';

import React from 'react';

export default class PaypalForm extends React.Component {

    render() {
        return (
            <form action='https://www.paypal.com/cgi-bin/webscr'
                method='post'
                target='_top'>
                <input type='hidden' name='cmd' value='_xclick' />
                <input type='hidden' name='business' value='paypal@firstcs.co.uk' />
                <input type='hidden' name='amount' value={this.props.amount} />
                <input type='hidden' name='item_name' value={'Thimble cottage ' + this.props.description} />
                <input type='hidden' name='item_number' value={this.props.item_number} />
                <input type='hidden' name='currency_code' value='GBP' />
                <input type='hidden' name='email' value={this.props.email} />
                <input type='hidden' name='first_name' value={this.props.firstname} />
                <input type='hidden' name='last_name' value={this.props.lastname} />
                <input type='hidden' name='cancel_return' value='http://www.thimblecottagewhitby.co.uk/' />
                <input type='hidden' name='return' value='http://www.thimblecottagewhitby.co.uk/' />
                <input type='hidden' name='notify_url' value='http://www.thimblecottagewhitby.co.uk/ipn' />
                <input type='image' src='https://www.paypalobjects.com/en_US/GB/i/btn/btn_buynowCC_LG.gif' border='0' name='submit' alt='PayPal – The safer, easier way to pay online.' />
                <img alt='' border='0' src='https://www.paypalobjects.com/en_GB/i/scr/pixel.gif' width='1' height='1' />
        </form>
        );

    }
};
