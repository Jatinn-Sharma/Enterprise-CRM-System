import React, { useState } from 'react';
import { FiBell, FiLock, FiGlobe, FiMoon, FiSave } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('notifications');
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    compactView: false,
    language: 'English',
    timezone: 'UTC-5 (Eastern Time)',
    twoFactorAuth: false,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const renderTabButton = (id, icon, label) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-500 font-medium' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg'
        }`}
      >
        {icon} <span className="ml-3">{label}</span>
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar Navigation */}
        <div className="col-span-1 space-y-1">
          {renderTabButton('notifications', <FiBell />, 'Notifications')}
          {renderTabButton('appearance', <FiMoon />, 'Appearance')}
          {renderTabButton('language', <FiGlobe />, 'Language & Region')}
          {renderTabButton('security', <FiLock />, 'Security')}
        </div>

        {/* Content Area */}
        <div className="col-span-2 space-y-6">
          <div className="card">
            
            {activeTab === 'notifications' && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                      <p className="text-xs text-gray-500">Receive daily summaries and alerts via email.</p>
                    </div>
                    <button onClick={() => toggleSetting('emailNotifications')} className={`w-11 h-6 rounded-full transition-colors relative ${settings.emailNotifications ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.emailNotifications ? 'transform translate-x-5' : ''}`}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-border">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                      <p className="text-xs text-gray-500">Get instantly notified in your browser.</p>
                    </div>
                    <button onClick={() => toggleSetting('pushNotifications')} className={`w-11 h-6 rounded-full transition-colors relative ${settings.pushNotifications ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.pushNotifications ? 'transform translate-x-5' : ''}`}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-border">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h4>
                      <p className="text-xs text-gray-500">Receive product updates and newsletters.</p>
                    </div>
                    <button onClick={() => toggleSetting('marketingEmails')} className={`w-11 h-6 rounded-full transition-colors relative ${settings.marketingEmails ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.marketingEmails ? 'transform translate-x-5' : ''}`}></span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'appearance' && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Appearance Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                      <p className="text-xs text-gray-500">Use dark theme across the application.</p>
                    </div>
                    <button onClick={toggleDarkMode} className={`w-11 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isDarkMode ? 'transform translate-x-5' : ''}`}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-border">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Compact View</h4>
                      <p className="text-xs text-gray-500">Reduce spacing in tables and lists.</p>
                    </div>
                    <button onClick={() => toggleSetting('compactView')} className={`w-11 h-6 rounded-full transition-colors relative ${settings.compactView ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.compactView ? 'transform translate-x-5' : ''}`}></span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'language' && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Language & Region</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white mb-1 block">Display Language</label>
                    <select 
                      value={settings.language} 
                      onChange={(e) => handleSelectChange('language', e.target.value)}
                      className="input-field w-full"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white mb-1 block">Timezone</label>
                    <select 
                      value={settings.timezone} 
                      onChange={(e) => handleSelectChange('timezone', e.target.value)}
                      className="input-field w-full"
                    >
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European Time)</option>
                      <option>UTC+5:30 (India Standard Time)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                      <p className="text-xs text-gray-500">Require an extra code when logging in.</p>
                    </div>
                    <button onClick={() => toggleSetting('twoFactorAuth')} className={`w-11 h-6 rounded-full transition-colors relative ${settings.twoFactorAuth ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.twoFactorAuth ? 'transform translate-x-5' : ''}`}></span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                    <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">Change Password...</button>
                  </div>
                </div>
              </>
            )}

            <div className="pt-8 border-t border-gray-100 dark:border-dark-border mt-8">
              <button onClick={handleSave} className="btn-primary flex items-center" disabled={saving}>
                <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
