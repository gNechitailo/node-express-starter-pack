module.exports = (user) => {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
    </head>
    <body>
      <h1 style="font-family: Geneva, Arial, Helvetica, sans-serif, sans-serif; color: black;">
        Reset your password to access MyApp, ${user.firstName}
      </h1>
      <p style="font-size: 180%; font-family: Georgia, 'Times New Roman', Times, serif; color: black">
        Hi, ${user.firstName}, you recently requested to reset your password for your MyApp account.
        Click the link below to reset it.
        If you did not request a password reset, please ignore the email or reply it to let us know.
      </p>
      <a href="http://bid-bash-staging.herokuapp.com/reset-password?reset-password-token=${user.passwordResetCode}"
      style="font-size: 130%;">
        Click here to reset password
      </a>
      <p style="font-size: 180%; font-family: Georgia, 'Times New Roman', Times, serif; color: black">
      Thanks, MyApp Team
      </p>
    </body>
  </html>
  `;
  const subject = 'MyApp | Reset your password';

  return {
    html,
    subject,
  };
};
