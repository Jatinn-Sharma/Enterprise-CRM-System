const supabase = require('../config/supabase');

const getLeads = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, assignedTo:users(name, email)');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, assignedTo:users(name, email)')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLead = async (req, res) => {
  try {
    const { data: createdLead, error } = await supabase
      .from('leads')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase
      .from('activities')
      .insert([{
        type: 'Note',
        description: 'Lead created',
        leadId: createdLead.id,
        userId: req.user.id
      }]);

    res.status(201).json(createdLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Log activity
    await supabase
      .from('activities')
      .insert([{
        type: 'Note',
        description: 'Lead updated',
        leadId: updatedLead.id,
        userId: req.user.id
      }]);

    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead
};
