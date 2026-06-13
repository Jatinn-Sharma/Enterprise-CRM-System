const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*, accountManager:users(name, email)');

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([req.body])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.route('/:id')
  .get(protect, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*, accountManager:users(name, email)')
        .eq('id', req.params.id)
        .single();

      if (error) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(protect, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', req.params.id);

      if (error) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json({ message: 'Customer removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
