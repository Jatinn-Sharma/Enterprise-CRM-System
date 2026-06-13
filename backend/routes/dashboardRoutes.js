const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const supabase = require('../config/supabase');

router.get('/stats', protect, async (req, res) => {
  try {
    const { count: totalLeads, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    const { count: wonDeads, error: wonError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Won');

    const { count: lostDeads, error: lostError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Lost');

    const { count: newLeads, error: newError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'New Lead');
      
    if (leadsError || wonError || lostError || newError) throw new Error('Error fetching lead stats');
    
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('revenue');

    if (customersError) throw customersError;

    const totalRevenue = customers.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
    
    res.json({
      totalLeads,
      wonDeads,
      lostDeads,
      newLeads,
      totalRevenue,
      conversionRate: totalLeads > 0 ? ((wonDeads / totalLeads) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
