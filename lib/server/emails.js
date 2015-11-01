'use strict';

var fs = require('fs'),
    log = require('server/log'),
    Booking = require('shared/bookings');

module.exports = {

    nodemailer: require('nodemailer'),
    from: 'Thimble Cottage Whitby <bookings@thimblecottagewhitby.co.uk>',
    bcc:  'bookings@thimblecottagewhitby.co.uk',

    createTransport: function() {
        return this.nodemailer.createTransport('SMTP', {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.SMTPUSR,
                pass: process.env.SMTPPWD
            }
        });
    },

    sendMail: function(message, cb) {
        var transport = this.createTransport();
        transport.sendMail(message, function(error){
            if(error){
                log.info('Error occurred sending email');
                log.info(error.message);
                cb(error, null);
                return;
            }
            log.info('Email sent successfully!');
            transport.close();
            cb(null, message);
        });
    },

    getMessage: function(recipient, mergeData, body) {
        var template = fs.readFileSync(process.cwd() + '/public/emailtemplate.html', 'utf8');
        template = template.replace('##body##', body);
        for (var m in mergeData) {
            if (mergeData.hasOwnProperty(m)) {
                template = template.replace(new RegExp('##' + m + '##', 'g'), mergeData[m]);
            }
        }

        return {
            from: this.from,
            to: recipient,
            bcc: this.bcc,
            subject: mergeData.title,
            html: template
        };

    },

    createMergeData: function(booking, title) {
        var b = new Booking(booking);

        var data = {
          title: title,
          bookingid: booking._id,
          firstname: booking.firstname,
          lastname: booking.lastname,
          numberofnights: booking.numberOfNights,
          arrivaldate: b.getArrivalDate().format('dddd Do MMMM'),
          totalcost: booking.price,
          deposit: booking.deposit,
          balance: booking.getBalance(),
          totalPayments: booking.getTotalPayments(),
          balanceOutstanding: booking.getBalanceOutstanding(),
          balanceduedate: booking.getBalanceDueDate.format('dddd Do MMMM'),
          keysafecode: '9347',
          paymentlink: 'http://www.thimblecottagewhitby.co.uk/app/#/pay/' + booking._id
        };

        return data;
    },

    sendBasicEmail: function(recipient, text, cb) {
        this.sendMail(
            this.getMessage(recipient,
                {title: 'Thimble Cottage Whitby Booking'},
                `<p>{text}</p>`),
            cb);
    },

    sendBookingMadeEmail: function(booking, cb) {
        this.sendMail(
            this.getMessage(booking.email,
                this.createMergeData(booking, 'Thimble Cottage Whitby Booking'),
                `<h1>Thank you for your booking</h1>
                <hr />
                <h2>Reference: ##bookingid##</h2>
                <p>Dear ##firstname##,</p>
                <p>
                    Many thanks for your booking. You are confirmed to stay for ##numberofnights##
                    nights from ##arrivaldate## for a total cost of £##totalcost##.
                </p>
                <p>
                    In order to secure your booking the deposit of £##deposit## is due immediately
                    with the balance of £##balance## due on ##balanceduedate##. We'll send you an
                    email reminder before then.
                </p>
                <p>You can pay online using
                    this link <a href="##paymentlink##"
                                 target="_blank">##paymentlink##</a>
                    or by cheque by writing your booking reference (##bookingid##) on the back,
                    making it payable to First Class Strategies Ltd and posting it to</p>
                <p>
                    Thimble Cottage Admin<br/>
                    28 Hoyle Court Road<br />
                    Baildon<br />
                    SHIPLEY<br />
                    BD17 6JP
                </p>
                <p>
                    If you need any further info in the meantime please just reply to this
                    email and we'll be happy to help.
                </p>`), cb);
    },

    sendDepositReceivedEmail: function(booking, cb) {
        this.sendMail(
            this.getMessage(booking.email,
                this.createMergeData(booking, 'Thimble Cottage Whitby Booking - Deposit Received'),
                `<h1>Thank you. We have received your deposit</h1>
                <hr />
                <h2>Reference: ##bookingid##</h2>
                <p>Dear ##firstname##,</p>
                <p>
                    We have received your deposit of £##deposit## for your booking on
                    ##arrivaldate##.
                </p>
                <p>
                    The balance of £##balance## is due on ##balanceduedate##. We'll send you an
                    email reminder before then.
                </p>
                <p>You can pay online using
                    this link <a href="##paymentlink##"
                                 target="_blank">##paymentlink##</a>
                    or by cheque by writing your booking reference (##bookingid##) on the back,
                    making it payable to First Class Strategies Ltd and posting it to
                </p>
                <p>
                    Thimble Cottage Admin<br />
                    28 Hoyle Court Road<br />
                    Baildon<br />
                    SHIPLEY<br />
                    BD17 6JP
                </p>
                <p>
                    If you need any further info in the meantime please just reply to this
                    email and we'll be happy to help.
                </p>`), cb);
    },

    sendBalanceReceivedEmail: function(booking, cb) {
        this.sendMail(
            this.getMessage(booking.email,
                this.createMergeData(booking, 'Thimble Cottage Whitby Booking - Balance Received'),
                `<h1>Thank you. We have received your payment</h1>
                <hr />
                <h2>Reference: ##bookingid##</h2>
                <p>Dear ##firstname##,</p>
                <p>
                    We have received your payment of £##balance## for your booking on
                    ##arrivaldate##.
                </p>
                <p>
                    All outstanding payments have now been received. We hope you enjoy
                    your stay with us.
                </p>
                <p>
                    On the day of arrival you will find the key in a safe on the outside
                    wall. The combination for the key safe is 9347. Please remember to
                    leave the keys in the safe on your departure.
                </p>
                <p>
                    If you could please make sure you arrive at the cottage no earlier than 2pm
                    on your first day and vacate before 10:30am. This gives us chance to
                    clean before the next guests arrive.
                </p>
                <p>
                    If you need any further info in the meantime please just reply to this
                    email and we'll be happy to help.
                </p>`), cb);
    },

    sendPaymentReminderEmail: function(booking, cb) {
        this.sendMail(
            this.getMessage(booking.email,
                this.createMergeData(booking, 'Thimble Cottage Whitby Booking - Balance Due'),
                `<h1>We're looking forward to seeing you</h1>
                <hr />
                <h2>Reference: ##bookingid##</h2>
                <p>Dear ##firstname##,</p>
                <p>
                    Your stay at our cottage is still scheduled for ##arrivaldate##.
                </p>
                <p>
                    In order to complete your booking the outstanding balance of
                    £##balanceOutstanding## is now due.
                </p>
                <p>You can pay online using
                    this link <a href="##paymentlink##"
                                 target="_blank">##paymentlink##</a>
                    or by cheque by writing your booking reference (##bookingid##) on the back,
                    making it payable to First Class Strategies Ltd and posting it to
                </p>
                <p>
                    Thimble Cottage Admin<br />
                    28 Hoyle Court Road<br />
                    Baildon<br />
                    SHIPLEY<br />
                    BD17 6JP
                </p>
                <p>
                    If, for whatever reason, you cannot proceed with the booking then please
                    let us know as soon as possible so we can try to find replacement guests.
                    If we do manage to secure another booking for the same time then we'll
                    refund your deposit.
                </p>
                <p>
                    If you need any further info in the meantime please just reply to this
                    email and we'll be happy to help.
                </p>`), cb);
    },

    sendFullAmountReceivedEmail: function(booking, cb) {
        this.sendMail(
            this.getMessage(booking.email,
                this.createMergeData(booking, 'Thimble Cottage Whitby Booking - Payment Received'),
                `<h1>Thank you. We have received your payment</h1>
                <hr />
                <h2>Reference: ##bookingid##</h2>
                <p>Dear ##firstname##,</p>
                <p>
                    We have received your payment of £##totalcost## for your booking on
                    ##arrivaldate##.
                </p>
                <p>
                    All outstanding payments have now been received. We hope you enjoy
                    your stay with us.
                </p>
                <p>
                    On the day of arrival you will find the key in a safe on the outside
                    wall. The combination for the key safe is ##keysafecode##. Please remember to
                    leave the keys in the safe on your departure.
                </p>
                <p>
                    If you could please make sure you arrive at the cottage no earlier than 2pm
                    on your first day and vacate before 10:30am. This gives us chance to
                    clean before the next guests arrive.
                </p>
                <p>
                    If you need any further info in the meantime please just reply to this
                    email and we'll be happy to help.
                </p>`), cb);
    }
};
