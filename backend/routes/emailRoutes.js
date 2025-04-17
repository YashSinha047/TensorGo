const express = require('express');
   const sgMail = require('@sendgrid/mail');
   const User = require('../models/user');
   const Email = require('../models/email');
   const router = express.Router();

   router.post('/newsletter', async (req, res) => {
     if (!req.isAuthenticated()) {
       return res.status(401).json({ error: 'Not authenticated' });
     }
     if (req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Not authorized' });
     }
     try {
       const { subject, html, text } = req.body;
       const users = await User.find({});
       const to = users.map(u => u.email);
       await sgMail.sendMultiple({
         from: 'TensorGo@communicationapp.shop',
         to,
         subject,
         html,
         text,
         trackingSettings: {
           clickTracking: { enable: true, enableText: true },
           openTracking: { enable: true },
         },
       });
       for (const email of to) {
         await Email.create({
           from: 'TensorGo@communicationapp.shop',
           to: email,
           subject,
           html,
           text,
           userId: email,
           type: 'newsletter',
         });
       }
       res.json({ message: 'Newsletter sent' });
     } catch (error) {
       console.error('Newsletter error:', error);
       res.status(500).json({ error: 'Failed to send newsletter' });
     }
   });

   router.post('/send', async (req, res) => {
     if (!req.isAuthenticated()) {
       return res.status(401).json({ error: 'Not authenticated' });
     }
     try {
       const { to, subject, html, text } = req.body;
       await sgMail.send({
         from: 'TensorGo@communicationapp.shop',
         to,
         subject,
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
         subject,
         html,
         text,
         userId: req.user.email,
         type: 'composed',
       });
       res.json({ message: 'Email sent' });
     } catch (error) {
       console.error('Send email error:', error);
       res.status(500).json({ error: 'Failed to send email' });
     }
   });

   router.get('/history', async (req, res) => {
     if (!req.isAuthenticated()) {
       return res.status(401).json({ error: 'Not authenticated' });
     }
     try {
       const emails = await Email.find({
         $or: [{ userId: req.user.email }, { to: req.user.email }],
       }).sort({ sentAt: -1 });
       res.json(emails);
     } catch (error) {
       console.error('History error:', error);
       res.status(500).json({ error: 'Failed to fetch history' });
     }
   });

   router.post('/engagement', async (req, res) => {
     if (!req.isAuthenticated() || req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Not authorized' });
     }
     try {
       const { subject, html, text } = req.body;
       const inactiveUsers = await User.find({
         lastLogin: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
       });
       const to = inactiveUsers.map(u => u.email);
       if (to.length === 0) {
         return res.json({ message: 'No inactive users found' });
       }
       await sgMail.sendMultiple({
         from: 'TensorGo@communicationapp.shop',
         to,
         subject,
         html,
         text,
         trackingSettings: {
           clickTracking: { enable: true, enableText: true },
           openTracking: { enable: true },
         },
       });
       for (const email of to) {
         await Email.create({
           from: 'TensorGo@communicationapp.shop',
           to: email,
           subject,
           html,
           text,
           userId: email,
           type: 'engagement',
         });
       }
       res.json({ message: 'Engagement emails sent' });
     } catch (error) {
       console.error('Engagement error:', error);
       res.status(500).json({ error: 'Failed to send engagement emails' });
     }
   });

   module.exports = router;