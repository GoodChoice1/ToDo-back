const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "email",
    pass: "password",
  },
});

module.exports = transporter