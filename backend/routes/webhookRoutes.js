const express = require('express');
   const Analytics = require('../models/analytics');
   const router = express.Router();

   router.post('/', async (req, res) => {
     try {
       console.log('Webhook received:', JSON.stringify(req.body, null, 2));
       const events = Array.isArray(req.body) ? req.body : [req.body];
       for (const event of events) {
         if (['delivered', 'open', 'click'].includes(event.event)) {
           console.log('Processing event:', event.event, event.email);
           await Analytics.create({
             emailId: event.msg_id || event.email || 'unknown',
             userId: event.email || 'unknown',
             type: event.event,
             timestamp: event.timestamp ? new Date(event.timestamp * 1000) : new Date(),
           });
           console.log('Saved event:', event.event);
         } else {
           console.log('Ignored event:', event.event);
         }
       }
       res.status(200).send('Webhook received');
     } catch (error) {
       console.error('Webhook error:', error);
       res.status(500).send('Webhook failed');
     }
   });

   module.exports = router;