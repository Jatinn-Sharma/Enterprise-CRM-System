import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiInfo, FiCheckCircle } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  const useDemoAccount = () => {
    setEmail('demo@enterprisecrm.com');
    setPassword('Demo@123');
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0B0F19] transition-colors">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">CR</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Enterprise</h1>
            </div>
            <h2 className="mt-8 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please enter your details to sign in.
            </p>
          </div>
          
          <div className="mt-8">
            <form className="space-y-6" onSubmit={submitHandler}>
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start">
                  <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="input-field pl-10"
                      placeholder="admin@crm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="label">Password</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      className="input-field pl-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                    Remember for 30 days
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-[var(--color-primary)] hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full btn-primary h-11 text-[15px]">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="mt-6 flex justify-center text-sm">
                <button 
                  type="button" 
                  onClick={useDemoAccount}
                  className="font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors flex items-center gap-2"
                >
                  <FiInfo /> Use evaluator demo account
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
              <Link to="/register" className="font-medium text-[var(--color-primary)] hover:text-blue-500">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Graphic/Branding */}
      <div className="hidden lg:block relative flex-1 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <h2 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl mb-6">
              Accelerate your sales engine.
            </h2>
            <p className="text-lg text-blue-100 mb-10 leading-relaxed">
              The world's most powerful enterprise CRM designed for velocity, visibility, and closing deals faster.
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                'Pipeline Management',
                'Advanced Analytics',
                'Team Collaboration',
                'Automated Workflows'
              ].map((feature, i) => (
                <div key={i} className="flex items-center text-white/90">
                  <FiCheckCircle className="text-blue-400 mr-2" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
