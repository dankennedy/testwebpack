'use strict';

var log = require('server/log'),
    Booking = require('shared/bookings').Booking,
    config = require('server/config');

module.exports = {

    nodemailer: require('nodemailer'),
    template: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>##title##</title>
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        body {
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            margin: 0;
            padding: 0;
            font-family: "Segoe UI Light", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif;
        }

        .ExternalClass {
            width: 100%;
        }

            .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
                line-height: 100%;
            }

        #backgroundTable {
            margin: 0;
            padding: 0;
            width: 100% !important;
            line-height: 100% !important;
        }

        img {
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        a img {
            border: none;
        }

        .image_fix {
            display: block;
        }

        p {
            margin: 1em 0;
        }

        table td {
            border-collapse: collapse;
        }

        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        @media only screen and (max-device-width: 480px) {
            a[href^="tel"], a[href^="sms"] {
                text-decoration: none;
                color: black; /* or whatever your want */
                pointer-events: none;
                cursor: default;
            }

            .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
                text-decoration: default;
                pointer-events: auto;
                cursor: default;
            }
        }

        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
            a[href^="tel"], a[href^="sms"] {
                text-decoration: none;
                color: blue; /* or whatever your want */
                pointer-events: none;
                cursor: default;
            }

            .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
                text-decoration: default;
                color: orange !important;
                pointer-events: auto;
                cursor: default;
            }
        }

        @media only screen and (-webkit-min-device-pixel-ratio: 2) {
        }

        @media only screen and (-webkit-device-pixel-ratio:.75) {
        }

        @media only screen and (-webkit-device-pixel-ratio:1) {
        }

        @media only screen and (-webkit-device-pixel-ratio:1.5) {
        }

        .contact-item span {
            top: -10px;
        }
    </style>

    <!-- Targeting Windows Mobile -->
    <!--[if IEMobile 7]>
    <style type="text/css">
    </style>
    <![endif]-->
    <!--[if gte mso 9]>
        <style>
        /* Target Outlook 2007 and 2010 */
        </style>
    <![endif]-->
</head>
<body>
    <table cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
        <tr>
            <td>
                <img src="http://www.thimblecottagewhitby.co.uk/images/email_banner.png">
            </td>
        </tr>
        <tr>
            <td valign="top">
                <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td valign="top" style="text-align:left;padding:30px;">
                            ##body##
                            <p>Regards</p>
                            <p>Dan</p>
                            <p>
                                <div class="contact-item">
                                    <img src="http://www.thimblecottagewhitby.co.uk/images/contact_phone.png">
                                    <span class="mobile_link">01274 415758</span>
                                </div>
                                <br />
                                <img src="http://www.thimblecottagewhitby.co.uk/images/contact_email.png">
                                <a href="mailto:bookings@thimblecottagewhitby.co.uk" target="_blank">bookings@thimblecottagewhitby.co.uk</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,

    createTransport: function() {
        return this.nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.smtpUser,
                pass: config.smtpPwd
            }
        });
    },

    sendMail: function(message, cb) {

        if (!config.email.sendingenabled) {
            log.info('emails: Would have sent message but sending disabled', message.subject);
            cb(null, message);
            return;
        }

        log.info('emails: Sending email', message);

        var transport = this.createTransport();
        transport.sendMail(message, function(error){
            if(error){
                log.error('emails: Error occurred sending email', error);
                cb(error, null);
                return;
            }
            log.info('Email sent successfully!');
            transport.close();
            cb(null, message);
        });
    },

    getMessage: function(recipient, mergeData, body) {
        var tmpl = this.template.replace('##body##', body);
        for (var m in mergeData) {
            if (mergeData.hasOwnProperty(m)) {
                tmpl = tmpl.replace(new RegExp('##' + m + '##', 'g'), mergeData[m]);
            }
        }

        return {
            from: config.email.from,
            to: recipient,
            bcc: config.email.bcc,
            subject: mergeData.title,
            html: tmpl
        };

    },

    createMergeData: function(booking, title) {
        var b = new Booking(booking);

        var data = {
          title: title,
          bookingid: b._id,
          firstname: b.firstname,
          lastname: b.lastname,
          numberofnights: b.numberOfNights,
          arrivaldate: b.getArrivalDate().format('dddd Do MMMM'),
          totalcost: b.price,
          deposit: b.deposit,
          balance: b.getBalance(),
          totalPayments: b.getTotalPayments(),
          balanceOutstanding: b.getBalanceOutstanding(),
          balanceduedate: b.getBalanceDueDate().format('dddd Do MMMM'),
          keysafecode: '9347',
          paymentlink: config.paymentlink + b._id
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
                    Many thanks for your b. You are confirmed to stay for ##numberofnights##
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
