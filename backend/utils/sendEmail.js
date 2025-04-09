const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Define mail options
  const mailOptions = {
    from: `"Blogger App" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

// Send OTP for verification
const sendOTPEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333; text-align: center;">Email Verification</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #555;">Thank you for registering with our Blogging Platform. Please use the following OTP (One-Time Password) to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background-color: #f4f4f4; padding: 10px 15px; border-radius: 5px;">${otp}</span>
      </div>
      <p style="font-size: 16px; line-height: 1.5; color: #555;">This OTP is valid for 10 minutes. Please do not share this with anyone.</p>
      <p style="font-size: 14px; color: #777; margin-top: 30px; text-align: center;">If you didn't request this email, please ignore it.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Email Verification OTP',
    html
  });
};

module.exports = { sendEmail, sendOTPEmail }; 