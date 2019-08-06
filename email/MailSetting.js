const config = require('./MailConfig');
var nodemailer = require('nodemailer');
module.exports = {
    setmail:function () {
        var transporter = nodemailer.createTransport({
            host: 'smtp.office365.com', // Office 365 server
            port: 587,     // secure SMTP
            secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
            auth: {
                user: config.EMAIL,
                pass: config.PASSWORD
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });
        return transporter;
    }
};