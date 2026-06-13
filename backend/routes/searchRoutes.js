const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json({ leads: [], customers: [] });
    }

    const { data: leads, error: leadError } = await supabase
      .from('leads')
      .select('id, name, company')
      .or(`name.ilike.%${query}%,company.ilike.%${query}%`)
      .limit(5);

    if (leadError) throw leadError;

    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('id, name, company')
      .or(`name.ilike.%${query}%,company.ilike.%${query}%`)
      .limit(5);

    if (customerError) throw customerError;

    res.json({ leads, customers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
