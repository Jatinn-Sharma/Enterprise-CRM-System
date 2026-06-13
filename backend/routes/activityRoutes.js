const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      let query = supabase
        .from('activities')
        .select('*, userId:users(name)')
        .order('created_at', { ascending: false });

      if (req.query.leadId) query = query.eq('leadId', req.query.leadId);
      if (req.query.customerId) query = query.eq('customerId', req.query.customerId);
      
      const { data, error } = await query;

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([{ ...req.body, userId: req.user.id }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;
