import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiTarget, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const StatCard = ({ title, value, icon, trend }) => (
  <div className="card hover:-translate-y-1 transition-transform duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] mt-2">{value}</p>
      </div>
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-[var(--color-primary)] rounded-xl">
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, wonDeads: 0, totalRevenue: 0, conversionRate: 0 });
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/dashboard/stats', config);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user]);

  const pieData = {
    labels: ['New', 'Qualified', 'Won', 'Lost'],
    datasets: [{
      data: [stats.newLeads, stats.totalLeads - stats.newLeads - stats.wonDeads - stats.lostDeads, stats.wonDeads, stats.lostDeads],
      backgroundColor: ['#2563EB', '#F59E0B', '#22C55E', '#EF4444'],
      borderWidth: 0,
    }]
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue (₹)',
      data: [
        (stats.totalRevenue || 25000) * 0.4, 
        (stats.totalRevenue || 25000) * 0.55, 
        (stats.totalRevenue || 25000) * 0.45, 
        (stats.totalRevenue || 25000) * 0.7, 
        (stats.totalRevenue || 25000) * 0.85, 
        stats.totalRevenue || 25000
      ],
      borderColor: '#2563EB',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <button className="btn-primary flex items-center" onClick={() => window.print()}>
          <FiTrendingUp className="mr-2" /> Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value={stats.totalLeads} icon={<FiUsers size={24} />} trend={12} />
        <StatCard title="New Leads" value={stats.newLeads} icon={<FiTarget size={24} />} trend={8} />
        <StatCard title="Won Deals" value={stats.wonDeads} icon={<FiTrendingUp size={24} />} trend={-2} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} icon={<FiDollarSign size={24} />} trend={24} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Revenue Trend</h3>
          <div className="h-64">
             <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Leads by Status</h3>
          <div className="h-64 flex justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
