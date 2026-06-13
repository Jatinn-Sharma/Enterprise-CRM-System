import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const Reports = () => {
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, wonDeads: 0, lostDeads: 0 });
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/dashboard/stats', config);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user]);

  const barData = {
    labels: ['Total Leads', 'New Leads', 'Won Deals', 'Lost Deals'],
    datasets: [{
      label: 'Lead Statistics',
      data: [stats.totalLeads, stats.newLeads, stats.wonDeads, stats.lostDeads || 0],
      backgroundColor: ['#2563EB', '#F59E0B', '#22C55E', '#EF4444'],
      maxBarThickness: 60,
      borderRadius: 4,
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h2>
        <button className="btn-primary" onClick={() => window.print()}>Export PDF</button>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Lead Performance Overview</h3>
        <div className="h-96">
          <Bar data={barData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
