const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, assignedTo:users(name, email)');

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
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
  .put(protect, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', req.params.id);

      if (error) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
