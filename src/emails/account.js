
const sendGridApiKey='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'
const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(sendGridApiKey)

const msg = {
    to: 'owaishunter78@gmail.com', // Change to your recipient
    from: 'owaishunter78@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })