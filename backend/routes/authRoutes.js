const express = require('express');
   const router = express.Router();
   const authController = require('../controllers/authController');

   router.get('/google', authController.googleAuth);
   router.get('/google/callback', authController.googleCallback);
   router.get('/user', authController.getUser);
   router.get('/logout', authController.logout);
   router.post('/reset', authController.requestPasswordReset);

   module.exports = router;