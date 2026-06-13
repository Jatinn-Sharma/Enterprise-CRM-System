const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Admin'), async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(protect, authorize('Admin'), async (req, res) => {
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          name: req.body.name,
          email: req.body.email,
          role: req.body.role,
          status: req.body.status
        })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
  .delete(protect, authorize('Admin'), async (req, res) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', req.params.id);

      if (error) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
