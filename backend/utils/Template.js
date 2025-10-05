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
