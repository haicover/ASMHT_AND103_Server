var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "haiconk@gmail.com",
    pass: "123456",
  },
});
module.exports = transporter;
