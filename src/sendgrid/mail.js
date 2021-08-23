const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = ({to, token, host}) => {
    const msg = {
        to,
        from: 'letsgoappsv1@gmail.com',
        subject: `Verify your Letsgo account.`,
        text: `Verify your Letsgo account by clicking on this link: https://${host}:${process.env.PORT}/user/verify/${token}`,
        html: `<div>Verify your Letsgo account by clicking on this link: <a href="https://${host}/user/verify/${token}">LINK</a></div>`
      };
    sgMail.send(msg).then(()=>{
        console.log("success");
    }).catch(err=>{
        console.log(err.response.body.errors);
    });  
};

module.exports = {
    sendMail
}

