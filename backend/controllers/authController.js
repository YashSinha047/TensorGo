const passport = require('passport');
   const { sendWelcomeEmail } = require('../services/emailService');
   const User = require('../models/user');
   const Email = require('../models/email');
   const crypto = require('crypto');
   const sgMail = require('@sendgrid/mail');

   exports.googleAuth = passport.authenticate('google', {
     scope: ['profile', 'email'],
   });

   exports.googleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }, async (err, user) => {
      if (err) {
        console.error('Google login error:', err);
        return res.redirect('/');
      }
  
      req.logIn(user, async (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.redirect('/');
        }
  
        try {
          if (user && !user.welcomeEmailSent) {
            await sendWelcomeEmail(user.email, user.name);
            await User.updateOne({ googleId: user.googleId }, { welcomeEmailSent: true });
          }
  
          res.redirect('http://localhost:5173/dashboard');
        } catch (error) {
          console.error('Callback error:', error);
          res.redirect('/');
        }
      });
    })(req, res, next);
  };
  

   exports.getUser = (req, res) => {
     if (req.isAuthenticated()) {
       res.json(req.user);
     } else {
       res.status(401).json({ error: 'Not authenticated' });
     }
   };

   exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
  
      // Destroy session and clear cookie
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ error: 'Logout failed' });
        }
  
        res.clearCookie('connect.sid', {
          path: '/', // make sure this matches cookie config
          httpOnly: true,
          sameSite: 'lax', // or 'none' if you're using cross-origin cookies
          secure: false // true if using https
        });
  
        res.status(200).json({ message: 'Logged out successfully' });
      });
    });
  };
  

   exports.requestPasswordReset = async (req, res) => {
     try {
       const { email } = req.body;
       const user = await User.findOne({ email });
       if (!user) {
         return res.status(404).json({ error: 'User not found' });
       }
       const token = crypto.randomBytes(20).toString('hex');
       await User.updateOne({ email }, { resetToken: token, resetTokenExpires: Date.now() + 3600000 });
       const html = `
         <p>Reset your password by clicking <a href="http://localhost:5173/reset/${token}">here</a>.</p>
       `;
       const text = `Reset your password: http://localhost:5173/reset/${token}`;
       await sgMail.send({
         from: 'TensorGo@communicationapp.shop',
         to: email,
         subject: 'Password Reset Request',
         html,
         text,
         trackingSettings: {
           clickTracking: { enable: true, enableText: true },
           openTracking: { enable: true },
         },
       });
       await Email.create({
         from: 'TensorGo@communicationapp.shop',
         to: email,
         subject: 'Password Reset Request',
         html,
         text,
         userId: email,
         type: 'transactional',
       });
       res.json({ message: 'Reset email sent' });
     } catch (error) {
       console.error('Reset error:', error);
       res.status(500).json({ error: 'Failed to send reset email' });
     }
   };