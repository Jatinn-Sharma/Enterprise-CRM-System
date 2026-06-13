import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiBell, FiSearch, FiMenu, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ leads: [], customers: [] });
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${user.token}` }
      }).then(res => setNotifications(res.data)).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        axios.get(`http://localhost:5000/api/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        }).then(res => {
          setSearchResults(res.data);
          setShowSearch(true);
        }).catch(console.error);
      } else {
        setShowSearch(false);
        setSearchResults({ leads: [], customers: [] });
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, user]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-[var(--color-card-light)] dark:bg-[var(--color-dark-card)] h-16 fixed top-0 right-0 left-0 md:left-64 border-b border-[var(--color-border-light)] dark:border-[var(--color-dark-border)] z-10 flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center">
        <button className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
          <FiMenu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex relative ml-4" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10 py-1.5 w-64 text-sm"
            placeholder="Search leads, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if(searchQuery.trim().length > 0) setShowSearch(true); }}
          />
          
          {showSearch && (searchResults.leads.length > 0 || searchResults.customers.length > 0) && (
            <div className="absolute top-10 left-0 w-80 bg-white dark:bg-dark-card rounded-md shadow-lg py-2 border border-gray-100 dark:border-dark-border z-50">
              {searchResults.leads.length > 0 && (
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Leads</p>
                  {searchResults.leads.map(lead => (
                    <div key={lead.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-bg p-2 rounded -mx-2" onClick={() => { navigate('/leads'); setShowSearch(false); }}>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.company}</p>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.customers.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 dark:border-dark-border">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customers</p>
                  {searchResults.customers.map(customer => (
                    <div key={customer.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-bg p-2 rounded -mx-2" onClick={() => { navigate('/customers'); setShowSearch(false); }}>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.company}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-500 hover:text-primary-600 transition-colors focus:outline-none"
          >
            <FiBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[8px] text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 border border-gray-100 dark:border-dark-border z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border flex justify-between items-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Notifications</p>
                {unreadCount > 0 && <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{unreadCount} New</span>}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 border-b border-gray-50 dark:border-dark-border/50 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center border-l pl-4 border-[var(--color-border-light)] dark:border-[var(--color-dark-border)]">
          <div className="mr-3 text-right hidden sm:block">
            <p className="text-sm font-semibold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">{user?.name}</p>
            <p className="text-xs text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">{user?.role}</p>
          </div>
          
          <div className="relative ml-2" ref={profileRef}>
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="h-9 w-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold hover:ring-2 ring-primary-500 transition-all focus:outline-none"
            >
              {user?.name?.charAt(0)}
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-card-light)] dark:bg-[var(--color-dark-card)] rounded-[12px] shadow-lg py-1 border border-[var(--color-border-light)] dark:border-[var(--color-dark-border)] z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-dark-border)] bg-gray-50/50 dark:bg-[#111827]/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={() => { navigate('/profile'); setShowProfile(false); }} 
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
                >
                  Your Profile
                </button>
                <button 
                  onClick={() => { navigate('/settings'); setShowProfile(false); }} 
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
                >
                  Settings
                </button>
                <button 
                  onClick={logout} 
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-bg"
                >
                  <FiLogOut className="mr-2" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
