const nodemailer = require('nodemailer')
const config = require('../../config/config')
const htmlToText = require('html-to-text')
const {
  getEmailBodyForgetPassword,
  getEmailBodyCreateUser,
} = require('./templateHelper')

const company = {
  domain: config.domain,
  imgSrc: 'https://bucket-for-uploads.s3.amazonaws.com/public/logo-bridge.png',
  imgDesc: 'Bridge Logo',
  location: '3955 Marconi Drive, Alpharetta GA 30005',
  supportLink: '',
  privacyLink: '',
  twitterHandle: '410bridge',
  facebookHandle: '410bridge',
  instagramHandle: '410bridge',
  iosAppLink: 'https://apps.apple.com/bn/app/410bridge-handbook/id1457246058',
  androidAppLink:
    'https://play.google.com/store/apps/details?id=com.bridge.handbook_v2&hl=en',
}

const getMailOptions = (user, getEmailBody) => {
  // setup email data with unicode symbols
  const mailOptions = {
    from: '"The Bridge App" <notify@app.410bridge.org>', // sender address
    to: user.email, // list of receivers
    subject: user.mailSubject, // Subject line
    text: '', // plain text body
    html: '', // html body
  }
  mailOptions.html = getEmailBody(company, user)
  mailOptions.text = htmlToText.fromString(mailOptions.html)
  return mailOptions
}

// console.log(config.smtp)
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.smtp.username, // generated ethereal user
    pass: config.smtp.password, // generated ethereal password
  },
  // tls: {
  //   // do not fail on invalid certs
  //   rejectUnauthorized: false,
  // },
})

/**
 *
 * @param {mailSubject, email, name, partnerName, code, link, password} userData
 */

const sendMailCreateUser = async (
  userData = {
    mailSubject: 'Your account has been craeted in the Bridge App',
    email: '',
    name: '',
    partnerName: '',
    password: '',
  }
) => {
  // Set Email Options
  const mailOptions = getMailOptions(userData, getEmailBodyCreateUser)
  // send mail with defined transport object
  return await transporter.sendMail(mailOptions)
}
const sendMailForgetPass = async (
  userData = {
    mailSubject: '',
    email: '',
    name: '',
    code: '',
    urlKey: '',
  }
) => {
  // Set Email Options
  const mailOptions = getMailOptions(userData, getEmailBodyForgetPassword)
  // send mail with defined transport object
  return await transporter.sendMail(mailOptions)
}

module.exports = { sendMailCreateUser, sendMailForgetPass }
