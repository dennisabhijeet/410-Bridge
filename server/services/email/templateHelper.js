const getEmailBodyHeader = (company) => {
  let bodyHeader = `<html>
  <head>
        <title>The Bridge Email</title>
      </head>
      <body style="margin:0;padding:0">
  <table cellspacing="0" cellpadding="0" border="0"
  style="color:#333;background:#fff;padding:0; margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"
  >
    <tbody>
      <tr width="100%">
        <td  valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica">
          <table style="border:none;padding:0 18px;margin:50px auto 0 auto; width:500px">
            <tbody>
              <tr width="100%" height="60">
                <td valign="top" align="left"
                  style="border-top-left-radius:4px;border-top-right-radius:4px;background-color:#5b5c5e;padding:10px 18px;text-align:center"
                >
                  <img height="60" width="125" src="${company.imgSrc}" title="${company.imgDesc}" style="font-weight:bold;font-size:18px;color:#fff;vertical-align:top"/>
                </td>
              </tr>
              <tr width="100%">
                <td valign="top" align="left" style="background:#fff;padding:18px">`

  return bodyHeader
}

const getEmailBodyFooter = (company) => {
  let bodyFooter = `
    </td>
    </tr>
    </tbody>
  </table>
  <!-- App Download -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
  <tbody>
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="666" class="responsive-table" >
          <tbody>
            <tr>
              <td></td>
            </tr>
            <tr>
              <td align="center">
                <table width="140" height="27" border="0" cellspacing="0" cellpadding="0" align="center" class="responsive-table">
                  <tbody>
                    <tr>
                      <td align="center" style="padding-top: 36px;padding-bottom: 36px;">
                        <table width="140" height="27" border="0" cellspacing="0" cellpadding="0" align="center">
                          <tbody>
                            <tr align="center">
                              <td width="21">
                                <a href="https://instagram.com/${company.instagramHandle}/" border="0" target="_blank" >
                                  <img src="http://media.sailthru.com/53p/1jz/a/e/561ebb81140eb.png" width="21" height="22" style="display: block;"/>
                                </a>
                              </td>
                              <td width="21">
                                <a href="https://www.facebook.com/${company.facebookHandle}" border="0" target="_blank" >
                                  <img src="http://media.sailthru.com/53p/1jz/a/e/561ebb4f90bfa.png" width="21" height="22" style="display: block;" />
                                </a>
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
            <tr>
              <td></td>
            </tr>
            <tr align="center">
              <td>
                <table  width="140"  height="27"  border="0"  cellspacing="0"  cellpadding="0"  align="center">
                  <tbody>
                    <tr>
                      <td width="130" style="padding-right: 10px;">
                        <a  href="${company.iosAppLink}"  target="_blank"  >
                          <img    src="http://media.sailthru.com/53p/1jz/a/e/561ebac54feca.png"    width="130"    height="40"    style="      display: block;      color: #666666;      font-family: Helvetica, arial,        sans-serif;      font-size: 13px;      width: 130px;      height: 40px;    "    alt="TaskRabbit in the AppStore"    border="0"/>
                        </a>
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
  <!-- FOOTER -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
  <tbody>
    <tr>
      <td bgcolor="#eef0f1" align="center" style="padding: 36px 0;">
        <!-- UNSUBSCRIBE COPY -->
        <table  width="666"  border="0"  cellspacing="0"  cellpadding="0"  align="center"  class="responsive-table">
          <tbody>
            <tr>
              <td  align="center"  style="    font-size: 10px;    line-height: 18px;    font-family: Helvetica, Arial, sans-serif;    color: #666666;  ">
                <span class="appleFooter" style="color: #666666;"
                  >${company.location}</span
                ><br /><a
                  href="#"
                  class="original-only"
                  style="color: #666666; text-decoration: none;"
                  target="_blank"
                  >Unsubscribe</a
                >&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;<a
                  href="${company.supportLink}"
                  class="original-only"
                  style="color: #666666; text-decoration: none;"
                  target="_blank"
                  >Support</a
                ><span
                  class="original-only"
                  style="
                    font-family: Arial, sans-serif;
                    font-size: 10px;
                    color: #444444;
                  "
                  >&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span
                ><a
                  href="${company.privacyLink}"
                  style="color: #666666; text-decoration: none;"
                  target="_blank"
                  >Privacy Policy</a
                >
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
</html>`

  return bodyFooter
}

const getEmailBodyCreateUser = (company, user) => {
  let body = getEmailBodyHeader(company)
  body += `
  <h1 style="font-size: 20px;margin: 16px 0;color: #333;text-align: center;">
    Welcome ${user.name} to ${user.partnerName || 'The Bridge App'}
  </h1>

  <p style="font: 15px/1.25em 'Helvetica Neue', Arial, Helvetica;color: #333;">
  We’re excited for your upcoming trip with the 410 Bridge!  To help you prepare, our Trips App will provide you important pre-trip information.  Please download <strong>The Bridge: Missions Pathway</strong> from the App Store or Google Play and login with the credentials below.
  </p>

  <div style="background: #f6f7f8; border-radius: 3px;">
    <br />
    <div style="margin: 0 auto;width: 300px;">
      <p>
        <strong>Email:</strong> ${user.email}
      </p>
      <p>
        <strong>Password:</strong> ${
          user.password || '&lt;with your existing password&gt;'
        }
      </p>
    </div>
    <br />
  </div>

  <p style="font: 14px/1.25em 'Helvetica Neue', Arial, Helvetica;color: #333;">
    Thank you for joining us in our mission to redefine the war on poverty!<br/>
    <a
      href="https://410bridge.org/"
      style="
        color: #306f9c;
        text-decoration: none;
        font-weight: bold;
      "
      target="_blank"
      >Learn more </a
    >about 410 Bridge.
  </p>`
  body += getEmailBodyFooter(company)
  return body
}

const getEmailBodyForgetPassword = (company, user) => {
  let body = getEmailBodyHeader(company)
  body += `
  <h1 style="font-size: 20px;margin: 16px 0;color: #333;text-align: center;">
    ${user.name}, you requested to change password.
  </h1>

  <p style="font: 15px/1.25em 'Helvetica Neue', Arial, Helvetica;color: #333;text-align: center;">
    Here is the code and link to change your password.
  </p>

  <div style="background: #f6f7f8; border-radius: 3px;">
    <br />
    <div style="margin: 0 auto;width: 300px;">
      <p>
        <strong>Link:</strong>
        <a
          href="${company.domain}/reset-password?urlKey=${user.urlKey}"
          style="
            color: #306f9c;
            text-decoration: none;
            font-weight: bold;
          "
          target="_blank"
          >app.410bridge.org/reset-password</a
        >
      </p>
      <p>
        <strong>Code:</strong> ${user.code}
      </p>
    </div>
    <br />
  </div>

  <p style="font: 14px/1.25em 'Helvetica Neue', Arial, Helvetica;color: #333;">
    <strong>What's 410Bridge?</strong> 410 Bridge exists to redefine the war on poverty,
    how to win it, what it means for the people and communities living in poverty, and how we fight that battle together.
    <a
      href="https://410bridge.org/"
      style="
        color: #306f9c;
        text-decoration: none;
        font-weight: bold;
      "
      target="_blank"
      >Learn more »</a
    >
  </p>`
  body += getEmailBodyFooter(company)
  return body
}

module.exports = {
  getEmailBodyCreateUser,
  getEmailBodyForgetPassword,
}
