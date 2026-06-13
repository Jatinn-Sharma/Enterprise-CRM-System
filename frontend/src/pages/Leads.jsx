import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiX } from 'react-icons/fi';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  
  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    status: 'New Lead',
    priority: 'Medium'
  });

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/leads', config);
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/leads/${id}`, config);
        setLeads(leads.filter(lead => lead.id !== id));
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Failed to delete lead');
      }
    }
  };

  const handleEditClick = (lead) => {
    setEditingLead({ ...lead });
    setShowEditModal(true);
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Omit joined fields and id to avoid Supabase errors during update
      const { assignedTo, created_at, id, ...updateData } = editingLead;
      const { data } = await axios.put(`/api/leads/${editingLead.id}`, updateData, config);
      
      // Preserve joined fields in the local state update
      setLeads(leads.map(lead => lead.id === editingLead.id ? { ...lead, ...data } : lead));
      setShowEditModal(false);
      setEditingLead(null);
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const leadData = { ...newLead, assignedTo: user.id };
      const { data } = await axios.post('/api/leads', leadData, config);
      setLeads([...leads, data]);
      setShowAddModal(false);
      setNewLead({
        name: '',
        email: '',
        company: '',
        industry: '',
        status: 'New Lead',
        priority: 'Medium'
      });
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your potential customers</p>
        </div>
        <button 
          className="btn-primary flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus className="mr-2" /> Add Lead
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search leads by name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border)] rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1A2235] transition-colors">
            <FiFilter className="mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-border-light)] dark:divide-[var(--color-dark-border)]">
            <thead className="bg-[var(--color-bg-light)] dark:bg-[var(--color-dark-bg)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-card-light)] dark:bg-[var(--color-dark-card)] divide-y divide-[var(--color-border-light)] dark:divide-[var(--color-dark-border)]">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-[#1A2235] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                          {lead.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{lead.company}</div>
                      <div className="text-sm text-gray-500">{lead.industry}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${lead.status === 'Won' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          lead.status === 'Lost' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${lead.priority === 'High' ? 'text-red-500 font-medium' : lead.priority === 'Medium' ? 'text-yellow-500' : 'text-gray-500'}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditClick(lead)} className="text-[var(--color-primary)] hover:text-blue-800 mr-4 transition-colors"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-800 transition-colors"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No leads found. Create your first lead to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-card-light)] dark:bg-[var(--color-dark-card)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[var(--color-border-light)] dark:border-[var(--color-dark-border)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-light)] dark:border-[var(--color-dark-border)]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Lead</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateLead} className="p-6 space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({...editingLead, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={editingLead.email}
                  onChange={(e) => setEditingLead({...editingLead, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Company</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={editingLead.company}
                    onChange={(e) => setEditingLead({...editingLead, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Industry</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editingLead.industry}
                    onChange={(e) => setEditingLead({...editingLead, industry: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Status</label>
                  <select
                    className="input-field"
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({...editingLead, status: e.target.value})}
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select
                    className="input-field"
                    value={editingLead.priority}
                    onChange={(e) => setEditingLead({...editingLead, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-card-light)] dark:bg-[var(--color-dark-card)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[var(--color-border-light)] dark:border-[var(--color-dark-border)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-light)] dark:border-[var(--color-dark-border)]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Lead</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateLead} className="p-6 space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. John Doe"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="john@example.com"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Company</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Acme Corp"
                    value={newLead.company}
                    onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Industry</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Technology"
                    value={newLead.industry}
                    onChange={(e) => setNewLead({...newLead, industry: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Status</label>
                  <select
                    className="input-field"
                    value={newLead.status}
                    onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select
                    className="input-field"
                    value={newLead.priority}
                    onChange={(e) => setNewLead({...newLead, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Creating...' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
