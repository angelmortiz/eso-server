import nodemailer from 'nodemailer';

const sendEmail = async options => {
    const transporter = nodemailer.createTransport ({
        service: 'SendGrid',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    /** FOR TESTING PURPOSES [DO NOT DELETE] */
    // const transporter = nodemailer.createTransport ({
    //     host: process.env.MAILTRAP_EMAIL_HOST,
    //     port: process.env.MAILTRAP_EMAIL_PORT,
    //     auth: {
    //         user: process.env.MAILTRAP_EMAIL_USERNAME,
    //         pass: process.env.MAILTRAP_EMAIL_PASSWORD
    //     }
    // });
    /** [DO NOT DELETE] */

    const mailOptions = {
        from: 'En Salud Óptima <reset-password@ensaludoptima.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html: ,
    }

    await transporter.sendMail(mailOptions);
}

export default sendEmail;