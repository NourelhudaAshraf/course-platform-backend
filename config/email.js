const nodemailer = require("nodemailer");
const env = require("../config/env");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (email, subject, html) => {
  const mailOptions = {
    from: env.EMAIL_USER,
    to: email,
    subject,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = sendEmail;
