const buildHtmlEmail = (resetUrl) => {
  return `
    <p>You are receiving this email because you (or someone else) have requested a password reset for your account.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you did not request this, please ignore this email and your password will not be changed.</p>
  `;
};

module.exports = {
  buildHtmlEmail,
};
