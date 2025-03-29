import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Event Management System" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export const sendBulkEmails = async (recipients, subject, html) => {
  const transporter = createTransporter();
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const mailOptions = {
        from: `"Event Management System" <${process.env.SMTP_FROM_EMAIL}>`,
        to: recipient.email,
        subject,
        html: html(recipient), // Pass recipient data to template function
      };

      const info = await transporter.sendMail(mailOptions);
      results.push({ 
        email: recipient.email, 
        success: true, 
        messageId: info.messageId 
      });
    } catch (error) {
      console.error(`Error sending email to ${recipient.email}:`, error);
      results.push({ 
        email: recipient.email, 
        success: false, 
        error: error.message 
      });
    }
  }
  
  return results;
};