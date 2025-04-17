const sgMail = require('@sendgrid/mail');
   const Email = require('../models/email');
   require('dotenv').config();

   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   exports.sendWelcomeEmail = async (to, userName) => {
     try {
       const html = `
         <h1>Welcome, ${userName}!</h1>
         <p>Thank you for joining our platform. Start communicating with your peers today!</p>
         <p><a href="http://localhost:5173/dashboard">Go to Dashboard</a></p>
       `;
       const text = `Welcome, ${userName}!\nThank you for joining our platform. Start communicating with your peers today!\nGo to Dashboard: http://localhost:5173/dashboard`;
       await sgMail.send({
         from: 'TensorGo@communicationapp.shop',
         to,
         subject: 'Welcome to Communication Platform!',
         html,
         text,
         trackingSettings: {
           clickTracking: { enable: true, enableText: true },
           openTracking: { enable: true },
         },
       });
       await Email.create({
         from: 'TensorGo@communicationapp.shop',
         to,
         subject: 'Welcome to Communication Platform!',
         html,
         text,
         userId: to,
         type: 'welcome',
       });
       console.log('Welcome email sent to:', to);
       return { success: true, message: 'Welcome email sent' };
     } catch (error) {
       console.error('Error sending welcome email:', error);
       return { success: false, message: 'Failed to send welcome email' };
     }
   };