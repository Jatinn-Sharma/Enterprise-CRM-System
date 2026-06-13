import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/activities', config);
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [user]);

  if (loading) return <div className="p-8 dark:text-white">Loading activities...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activities</h2>
      <div className="card !p-0 overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-dark-border">
          {activities.map((activity) => (
            <li key={activity.id} className="p-6 hover:bg-[#F3F2EB] dark:hover:bg-[#1A2235] transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    {activity.type.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.type} - {activity.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Logged by {activity.userId?.name || 'Unknown'} on {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {activities.length === 0 && (
            <li className="p-6 text-center text-gray-500 dark:text-gray-400">No activities found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Activities;
