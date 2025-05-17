const nodemailer = require('nodemailer');


const sendEmail = async ({ to, subject, text, html }) => {
  try {
   const transporter = nodemailer.createTransport({
         host: "smtp.gmail.com",
         port: 465,
         secure: true,
         auth: {
           user: process.env.USER_EMAIL,
           pass: process.env.USER_PASS,
         },
       });
   
       await new Promise((resolve, reject) => {
         transporter.verify((error, success) => {
           if (error) {
             console.log("SMTP verification failed:", error);
             reject(error);
           } else {
             console.log("SMTP connection verified successfully");
             resolve(success);
           }
         });
       });
   
       const mailOptions = {
         from: process.env.USER_EMAIL,
         to: to,
         subject: subject,
         text: text,
          html: html,
       };
   
       const info = await transporter.sendMail(mailOptions);
       console.log("Email sent:", info.response);
   
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
