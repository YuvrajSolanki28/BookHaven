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