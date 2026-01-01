module.exports.Verification_Email_Template = `
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body style="background-color:#ffffff; margin:0; padding:0;">
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td style="background-color:#fff;color:#212121">
            <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
              BookHaven Email Verification
            </div>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;padding:20px;margin:0 auto;background-color:#eee">
              <tbody>
                <tr>
                  <td>
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fff">
                      <tbody>
                        <!-- Logo Header -->
                        
                        <!-- Main Content -->
                        <tr>
                          <td style="padding:25px 35px;">
                            <h1 style="color:#333;font-family:sans-serif;font-size:20px;font-weight:bold;margin-bottom:15px">
                              Verify your email address
                            </h1>
                            <p style="font-size:14px; line-height:24px; color:#333; margin-bottom:14px;">
                              Thanks for starting the new BookHaven account creation process. We want to make sure it’s really you. Please enter the following verification code when prompted. If you don’t want to create an account, you can ignore this message.
                            </p>
                            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:20px; text-align:center;">
                              <tr>
                                <td>
                                  <p style="font-size:14px; font-weight:bold; margin-bottom:5px;">Verification code</p>
                                  <p style="font-size:36px; font-weight:bold; margin:10px 0;">{code}</p>
                                  <p style="font-size:14px; color:#333;">(This code is valid for 10 minutes)</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                          <td style="padding:25px 35px; font-size:12px; color:#333; line-height:18px;">
                            BookHaven Web Services will never email you and ask you to disclose or verify your password, credit card, or banking account number.<br><br>
                            This message was produced and distributed by BookHaven Web Services, Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, BookHaven Web Services, Inc.. All rights reserved.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;

module.exports.Forgetpassword_Email_Template = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BookHaven Password Reset</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f9f9f9; font-family:Arial, sans-serif; color:#212121;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" align="center" style="background-color:#f9f9f9;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1); margin:20px auto;">

            <!-- Lock Icon -->
            <tr>
              <td align="center" style="padding:30px 35px 20px;">
                <div style="width:80px; height:80px; background-color:#3aaee0; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13S14 13.9 14 15S13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z"/>
                  </svg>
                </div>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding:0 35px 25px; text-align:center;">
                <h1 style="font-size:24px; color:#333; font-weight:bold; margin-bottom:15px;">Reset Your Password</h1>
                <p style="font-size:16px; line-height:24px; color:#666; margin-bottom:25px;">
                  We received a request to reset your password for your BookHaven account. Click the button below to create a new password.
                </p>

                <!-- Reset Button -->
                <a href="{resetUrl}" style="display:inline-block; padding:15px 40px; background-color:#3aaee0; color:#ffffff; text-decoration:none; border-radius:5px; font-size:16px; font-weight:bold;">
                  Reset Password
                </a>

                <p style="font-size:14px; color:#888; margin-top:25px;">
                  This link will expire in 1 hour for security reasons.
                </p>

                <div style="border-top:1px solid #eee; margin:25px 0; padding-top:20px;">
                  <p style="font-size:14px; color:#888; margin-bottom:10px;">
                    If you can't click the button, copy and paste this link into your browser:
                  </p>
                  <p style="font-size:12px; color:#3aaee0; word-break:break-all;">
                    {resetUrl}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Security Notice -->
            <tr>
              <td style="background-color:#f8f9fa; padding:20px 35px; border-radius:0 0 8px 8px;">
                <p style="font-size:12px; color:#666; margin:0; text-align:center;">
                  <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:25px 35px; font-size:12px; color:#888;">
                BookHaven Web Services<br/>
                410 Terry Ave. North, Seattle, WA 98109<br/>
                © 2025 BookHaven. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports.Bill_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookHaven Invoice</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
        <tr>
            <td align="center" style="padding:20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color:#2563eb; padding:30px; text-align:center; border-radius:8px 8px 0 0;">
                            <h1 style="color:#ffffff; margin:0; font-size:28px; font-weight:bold;">BookHaven</h1>
                            <p style="color:#e0e7ff; margin:5px 0 0 0; font-size:16px;">Invoice & Receipt</p>
                        </td>
                    </tr>

                    <!-- Invoice Details -->
                    <tr>
                        <td style="padding:30px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="50%">
                                        <h3 style="color:#333; margin:0 0 10px 0;">Bill To:</h3>
                                        <p style="margin:0; color:#666; line-height:1.5;">
                                            {customerName}<br>
                                            {customerEmail}
                                        </p>
                                    </td>
                                    <td width="50%" style="text-align:right;">
                                        <h3 style="color:#333; margin:0 0 10px 0;">Invoice Details:</h3>
                                        <p style="margin:0; color:#666; line-height:1.5;">
                                            <strong>Invoice #:</strong> {invoiceNumber}<br>
                                            <strong>Order ID:</strong> {orderId}<br>
                                            <strong>Date:</strong> {orderDate}<br>
                                            <strong>Payment:</strong> {paymentStatus}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Items Table -->
                    <tr>
                        <td style="padding:0 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                <thead>
                                    <tr style="background-color:#f8fafc;">
                                        <th style="padding:15px; text-align:left; border-bottom:2px solid #e2e8f0; color:#374151; font-weight:600;">Book Title</th>
                                        <th style="padding:15px; text-align:center; border-bottom:2px solid #e2e8f0; color:#374151; font-weight:600;">Qty</th>
                                        <th style="padding:15px; text-align:right; border-bottom:2px solid #e2e8f0; color:#374151; font-weight:600;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookItems}
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Total Section -->
                    <tr>
                        <td style="padding:30px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="70%"></td>
                                    <td width="30%">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:8px 0; border-bottom:1px solid #e2e8f0;">
                                                    <strong style="color:#374151;">Subtotal:</strong>
                                                </td>
                                                <td style="padding:8px 0; text-align:right; border-bottom:1px solid #e2e8f0;">
                                                    <strong style="color:#374151;">\${subtotal}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0; border-bottom:1px solid #e2e8f0;">
                                                    <span style="color:#6b7280;">Tax (8%):</span>
                                                </td>
                                                <td style="padding:8px 0; text-align:right; border-bottom:1px solid #e2e8f0;">
                                                    <span style="color:#6b7280;">\${tax}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:15px 0; border-bottom:2px solid #2563eb;">
                                                    <strong style="color:#1f2937; font-size:18px;">Total:</strong>
                                                </td>
                                                <td style="padding:15px 0; text-align:right; border-bottom:2px solid #2563eb;">
                                                    <strong style="color:#2563eb; font-size:18px;">\${total}</strong>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Download Section -->
                    <tr>
                        <td style="padding:30px; background-color:#f8fafc; border-radius:0 0 8px 8px;">
                            <h3 style="color:#333; margin:0 0 15px 0; text-align:center;">Your Digital Books</h3>
                            <p style="color:#666; text-align:center; margin:0 0 20px 0;">
                                Your purchased books are now available in your library. You can download them anytime from your account.
                            </p>
                            <div style="text-align:center;">
                                <a href="{libraryUrl}" style="display:inline-block; padding:12px 30px; background-color:#2563eb; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;">
                                    Access My Library
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:20px 30px; text-align:center; color:#6b7280; font-size:12px; line-height:1.5;">
                            Thank you for your purchase!<br>
                            BookHaven - Your Digital Bookstore<br>
                            If you have any questions, contact us at support@bookhaven.com
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;