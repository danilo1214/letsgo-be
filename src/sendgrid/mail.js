const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = ({ to, token, host }) => {
  const msg = {
    to,
    from: 'letsgoappsv1@gmail.com',
    subject: `Verify your Letsgo account.`,
    text: `Verify your Letsgo account by clicking on this link.`,
    html: `<div>Verify your Letsgo account by clicking on this <a href="https://${host}/user/verify/${token}">link</a></div>.`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Successfully sent mail.');
    })
    .catch((err) => {
      console.log(err.response.body.errors);
    });
};

module.exports = {
  sendMail,
};
