module.exports = user => {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
    </head>
    <body>
      <h1 style="font-family: Geneva, Arial, Helvetica, sans-serif, sans-serif; color: black;">
        Welcome to MyApp, ${user.firstName}
      </h1>
      <p style="font-size: 180%; font-family: Georgia, 'Times New Roman', Times, serif; color: black">
        Click the link to activate your account.
      </p>
      <a href="http://bid-bash-staging.herokuapp.com/sign-in?confirm-code=${user.confirmationCode}"
      style="font-size: 130%;">
        Click here to confirm email
      </a>
      <p style="font-size: 180%; font-family: Georgia, 'Times New Roman', Times, serif; color: black">
      Thanks, MyApp Team
      </p>
    </body>
  </html>
  `;
  const subject = 'MyApp | Activate your account';

  return {
    html,
    subject,
  };
};
