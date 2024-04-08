const nodemailer = require('nodemailer');
const httpErrors = require('http-errors');

const mailTransporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
        user: 'deepakkamboj6656@gmail.com',
        pass: 'GYbM1AF36Z0rJSQT' // Your SMTP key or password
    }
});


const sendEmail = async (emailDetails) => {
    try {
        const status = await mailTransporter.sendMail({
            from: 'deepakkamboj4672@gmail.com',
            to: emailDetails.recipient,
            subject: emailDetails.subject,
            text: emailDetails.message,
            // html: '<p>Click <a href="http://13.200.172.204:4500/api/auth/reset-password/' + emailConfig.recoveryToken + '">here</a> to reset your password</p>'
        });
        console.log(status);
        return status;
    } catch (error) {
        console.log("email error = ", error);
        throw error;
    }
}

module.exports = {
    sendEmail
}