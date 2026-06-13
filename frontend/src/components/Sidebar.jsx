import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome as HomeIcon, FiUsers as UsersIcon, FiUser as UserIcon, FiCheckSquare as TaskIcon, FiActivity as ActivityIcon, FiSettings as SettingsIcon, FiPieChart as ChartIcon } from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon className="w-5 h-5 mr-3" /> },
    { name: 'Leads', path: '/leads', icon: <UserIcon className="w-5 h-5 mr-3" /> },
    { name: 'Customers', path: '/customers', icon: <UsersIcon className="w-5 h-5 mr-3" /> },
    { name: 'Tasks', path: '/tasks', icon: <TaskIcon className="w-5 h-5 mr-3" /> },
    { name: 'Activities', path: '/activities', icon: <ActivityIcon className="w-5 h-5 mr-3" /> },
  ];

  if (user?.role === 'Admin' || user?.role === 'Sales Manager') {
    links.push({ name: 'Reports', path: '/reports', icon: <ChartIcon className="w-5 h-5 mr-3" /> });
  }

  if (user?.role === 'Admin') {
    links.push({ name: 'Users', path: '/users', icon: <SettingsIcon className="w-5 h-5 mr-3" /> });
  }

  return (
    <div className="bg-[var(--color-sidebar)] w-64 h-screen fixed top-0 left-0 border-r border-gray-800 z-10 hidden md:block">
      <div className="flex items-center px-6 h-16 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CR</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Enterprise</h1>
        </div>
      </div>
      <div className="p-4 mt-4">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4 px-3">Main Menu</p>
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-gray-400 hover:bg-[var(--color-sidebar-hover)] hover:text-white'
                  }`
                }
              >
                {React.cloneElement(link.icon, { className: 'w-5 h-5 mr-3 opacity-90' })}
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
