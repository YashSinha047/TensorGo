const express = require('express');
   const mongoose = require('mongoose');
   const passport = require('passport');
   const session = require('express-session');
   const cors = require('cors');
   const authRoutes = require('./routes/authRoutes');
   const webhookRoutes = require('./routes/webhookRoutes');
   const analyticsRoutes = require('./routes/analyticsRoutes');
   const emailRoutes = require('./routes/emailRoutes');
   require('dotenv').config();
   require('./config/passport');

   const app = express();

   // Middleware
   app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
   app.use(express.json());
   app.use(session({
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false,
   }));
   app.use(passport.initialize());
   app.use(passport.session());

   // MongoDB connection
   mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log('Connected to MongoDB'))
     .catch(err => console.error('MongoDB connection error:', err));

   // Routes
   app.use('/auth', authRoutes);
   app.use('/webhook', webhookRoutes);
   app.use('/api', analyticsRoutes);
   app.use('/emails', emailRoutes);

   // Start server
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });