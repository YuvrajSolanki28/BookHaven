const nodemailer = require("nodemailer");
const  {Verification_Email_Template}  = require("./Template");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVICE,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) console.error('Email error:', error);
  else console.log('Ready to send emails!');
});


sendVerificationEmail = (email, code) => {
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