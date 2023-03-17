import nodemailer from 'nodemailer';
import getVaultSecret from './keyvault/azureKeyVaultConfig';

const sendEmail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //   service: 'SendGrid',
  //   auth: {
  //     user:
  //       process.env.EMAIL_USERNAME ||
  //       (await getVaultSecret('sendgrid-username')),
  //     pass:
  //       process.env.EMAIL_PASSWORD ||
  //       (await getVaultSecret('sendgrid-password')),
  //   },
  // });

  /** FOR TESTING PURPOSES [DO NOT DELETE] */
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_EMAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.MAILTRAP_EMAIL_PORT || '25',
    auth: {
      user:
        process.env.MAILTRAP_EMAIL_USERNAME ||
        (await getVaultSecret('mailtrap-username')),
      pass:
        process.env.MAILTRAP_EMAIL_PASSWORD ||
        (await getVaultSecret('mailtrap-password')),
    },
  });
  /** [DO NOT DELETE] */

  const mailOptions = {
    from: 'En Salud Óptima <reset-password@ensaludoptima.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html: ,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
