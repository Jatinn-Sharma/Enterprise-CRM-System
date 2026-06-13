import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiCheckSquare, FiClock, FiAlertCircle, FiX } from 'react-icons/fi';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/tasks', config);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [user]);

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'High': return <FiAlertCircle className="text-red-500 mr-2" />;
      case 'Medium': return <FiClock className="text-yellow-500 mr-2" />;
      default: return <FiCheckSquare className="text-blue-500 mr-2" />;
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Ensure we don't send an empty assignedTo if not supported, but user.id is safe
      const taskData = { ...newTask, assignedTo: user.id };
      const { data } = await axios.post('http://localhost:5000/api/tasks', taskData, config);
      
      setTasks([...tasks, data]);
      setShowModal(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your daily to-dos</p>
        </div>
        <button 
          className="btn-primary flex items-center"
          onClick={() => setShowModal(true)}
        >
          <FiPlus className="mr-2" /> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Pending', 'In Progress', 'Completed'].map(status => (
          <div key={status} className="bg-gray-50 dark:bg-[#1A2235] p-4 rounded-xl border border-gray-100 dark:border-dark-border">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">{status}</h3>
            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="card !p-4 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{task.title}</h4>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      {getPriorityIcon(task.priority)}
                      <span className="text-gray-600 dark:text-gray-400">{task.priority}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="p-4 text-center text-sm text-gray-400 border-2 border-dashed border-[var(--color-border-light)] dark:border-dark-border rounded-lg">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-card-light)] dark:bg-[var(--color-dark-card)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[var(--color-border-light)] dark:border-[var(--color-dark-border)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-light)] dark:border-[var(--color-dark-border)]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Task</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="label">Task Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="E.g., Follow up with client"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Task details..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Priority</label>
                  <select
                    className="input-field"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    className="input-field"
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Due Date</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
