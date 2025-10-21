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

const sendOrderConfirmation = async (userEmail, orderDetails) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Order Confirmation',
    html: `<h2>Order Confirmed!</h2><p>Order ID: ${orderDetails.orderId}</p><p>Total: $${orderDetails.total}</p>`
  });
};

const sendAbandonedCartEmail = async (userEmail, cartItems) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Complete Your Purchase',
    html: `<h2>You left items in your cart!</h2><p>Don't miss out on ${cartItems.length} books.</p>`
  });
};

const sendNewBookNotification = async (userEmail, book) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'New Book Available',
    html: `<h2>New Book: ${book.title}</h2><p>By ${book.author}</p><p>Price: $${book.price}</p>`
  });
};

module.exports = { sendOrderConfirmation, sendAbandonedCartEmail, sendNewBookNotification };
