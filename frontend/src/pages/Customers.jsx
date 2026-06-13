import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiX } from 'react-icons/fi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    industry: '',
    revenue: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchCustomers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/customers', config);
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        ...formData,
        revenue: Number(formData.revenue) || 0
      };

      if (editId) {
        await axios.put(`/api/customers/${editId}`, payload, config);
      } else {
        await axios.post('/api/customers', payload, config);
      }
      
      closeModal();
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/customers/${id}`, config);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer.');
      }
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      company: customer.company || '',
      phone: customer.phone || '',
      industry: customer.industry || '',
      revenue: customer.revenue || ''
    });
    setEditId(customer.id);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', company: '', phone: '', industry: '', revenue: '' });
    setEditId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', company: '', phone: '', industry: '', revenue: '' });
    setEditId(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your active clients</p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center"
        >
          <FiPlus className="mr-2" /> Add Customer
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
              placeholder="Search customers by name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
            <FiFilter className="mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{customer.company}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {customer.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      ₹{customer.revenue?.toLocaleString('en-IN') || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(customer)} className="text-primary-600 hover:text-primary-900 mr-4"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-red-900"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No customers found. Convert some leads!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white dark:bg-dark-card border-0 rounded-xl shadow-2xl outline-none focus:outline-none">
              
              <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-dark-border rounded-t">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editId ? 'Edit Customer' : 'Add New Customer'}</h3>
                <button 
                  className="p-1 ml-auto text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  onClick={closeModal}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="input-field" placeholder="Rahul Sharma" />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="input-field" placeholder="rahul@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="input-field" placeholder="Reliance Industries" />
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="9876543210" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Industry</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="input-field" placeholder="Technology" />
                  </div>
                  <div>
                    <label className="label">Estimated Revenue (₹)</label>
                    <input type="number" name="revenue" value={formData.revenue} onChange={handleInputChange} className="input-field" placeholder="500000" />
                  </div>
                </div>

                <div className="flex items-center justify-end p-6 border-t border-gray-100 dark:border-dark-border mt-6 -mx-6 -mb-6 rounded-b">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4 transition-colors"
                    type="button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (editId ? 'Save Changes' : 'Add Customer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
