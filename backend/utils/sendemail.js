const nodemailer = require("nodemailer");
const  {Verification_Email_Template}  = require("./Template");
const sgMail  = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//this code is for gmail SMTP
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });


// const transporter = sendgrid.createTransport({
//   host: 'smtp.sendgrid.net',
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'apikey',
//     pass: process.env.SENDGRID_API_KEY
//   }
// });


// transporter.verify((error, success) => {
//   if (error) console.error('Email error:', error);
//   else console.log('Ready to send emails!');
// });


sendVerificationEmail = async (email, code) => {
  try{
  await sgMail.send({
    from: `yuvrajsolanki2809@gmail.com`,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is:`,
    html: Verification_Email_Template.replace("{code}", code)
  });
   console.log('Email sent successfully');
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  await transporter.sendMail({
    from: "BookHaven",
    to: email,
    subject: 'Password Reset',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `
  });
};

const sendOrderConfirmation = async (userEmail, orderDetails) => {
  await transporter.sendMail({
    from: "BookHaven",
    to: userEmail,
    subject: 'Order Confirmation - BookHaven',
    html: `
      <h2>Order Confirmed!</h2>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Total Amount:</strong> $${orderDetails.total}</p>
      <p><strong>Books:</strong></p>
      <ul>
        ${orderDetails.books?.map(book => `<li>${book.title} - $${book.price}</li>`).join('') || ''}
      </ul>
      <p>Thank you for your purchase!</p>
    `
  });
};

const sendAbandonedCartEmail = async (userEmail, cartItems) => {
  await transporter.sendMail({
    from: "BookHaven",
    to: userEmail,
    subject: 'Complete Your Purchase',
    html: `<h2>You left items in your cart!</h2><p>Don't miss out on ${cartItems.length} books.</p>`
  });
};

const sendNewBookNotification = async (userEmail, book) => {
  await transporter.sendMail({
    from: "BookHaven",
    to: userEmail,
    subject: 'New Book Available - BookHaven',
    html: `
      <h2>New Book: ${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Category:</strong> ${book.category}</p>
      <p><strong>Price:</strong> $${book.price}</p>
      ${book.description ? `<p><strong>Description:</strong> ${book.description}</p>` : ''}
      <p>Check it out now!</p>
    `
  });
};

module.exports = { sendOrderConfirmation, sendAbandonedCartEmail, sendNewBookNotification, sendVerificationEmail, sendPasswordResetEmail };
