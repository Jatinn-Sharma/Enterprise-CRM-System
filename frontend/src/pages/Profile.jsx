import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiBriefcase, FiSave } from 'react-icons/fi';

const ROLES = ['Admin', 'Sales Manager', 'Sales Representative', 'Support Agent', 'Marketing Executive'];

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || '');

  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const roleRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setShowRoleSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h2>
      
      <div className="card">
        <div className="flex items-center space-x-6 mb-8">
          <div className="h-24 w-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="label flex items-center mb-2">
                <FiUser className="mr-2" /> Full Name
              </label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="label flex items-center mb-2">
                <FiMail className="mr-2" /> Email Address
              </label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative" ref={roleRef}>
              <label className="label flex items-center mb-2">
                <FiBriefcase className="mr-2" /> Role
              </label>
              <input
                type="text"
                className="input-field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onFocus={() => setShowRoleSuggestions(true)}
              />
              {showRoleSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-md shadow-lg overflow-hidden">
                  {ROLES.filter(r => r.toLowerCase().includes(role.toLowerCase())).map(r => (
                    <div 
                      key={r}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg cursor-pointer transition-colors"
                      onClick={() => { setRole(r); setShowRoleSuggestions(false); }}
                    >
                      {r}
                    </div>
                  ))}
                  {ROLES.filter(r => r.toLowerCase().includes(role.toLowerCase())).length === 0 && (
                     <div className="px-4 py-2 text-sm text-gray-500 italic">No matching roles</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
            <button 
              type="submit" 
              className="btn-primary flex items-center"
              disabled={saving}
            >
              <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
