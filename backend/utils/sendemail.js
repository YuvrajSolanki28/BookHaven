const nodemailer = require("nodemailer");
const  {Verification_Email_Template}  = require("./Template");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVICE,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendVerificationEmail = (email, code) => {
  const mailOptions = {
    from: `"BookHaven" <${process.env.EMAIL_SERVICE}>`,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is:`,
    html: Verification_Email_Template.replace("{code}", code)
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error sending email:", error);
    } else {
      
    }
  });
};
