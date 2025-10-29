import React, { useState } from 'react';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Toaster, toast } from "react-hot-toast";
import AuthLayout from '../components/AuthLayout';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import  GoogleLoginButton  from '../components/GoogleLoginButton';
import { setAuthData } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthData(data.token, data.user);
        notifySuccess('Login successful!');
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1000);
      } else if (response.status === 403) {
        notifySuccess('Please verify your email to continue');
        setShowVerification(true);
      } else {
        const errorMessage = data.message || data.error || 'Login failed';
        setErrors({ api: errorMessage });
        notifyError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      setErrors({ api: errorMessage });
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setErrors({ verification: 'Verification code is required' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthData(data.token, data.user);
        notifySuccess('Email verified successfully!');
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1000);
      } else {
        const errorMessage = data.message || 'Invalid verification code';
        setErrors({ verification: errorMessage });
        notifyError(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setErrors({ verification: errorMessage });
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your BookHaven account"
      alternateLink={{
        text: "Don't have an account?",
        href: '/signup',
      }}
      alternateLinkText="Create an account"
    >
      <Toaster position="top-right" reverseOrder={false} />
      {showVerification ? (
        <motion.form
          onSubmit={handleVerificationSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Verify Your Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter the verification code sent to {email}</p>
          </div>

          <div>
            <label htmlFor="verificationCode" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={`block w-full px-3 py-2 border ${errors.verification ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
              placeholder="Enter 6-digit code"
              maxLength="6"
            />
            {errors.verification && <p className="text-sm text-red-600 dark:text-red-400">{errors.verification}</p>}
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
            <button
              type="button"
              onClick={() => setShowVerification(false)}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Back to Login
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" />
                ) : (
                  <EyeIcon size={18} className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>

          {errors.api && <p className="text-sm text-center text-red-600 dark:text-red-400">{errors.api}</p>}

          <div className="flex items-center justify-between">
            <a href="/forgot-password" className="text-sm text-emerald-600 hover:underline dark:text-emerald-400">
              Forgot your password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
            <div className="mt-6">
              <GoogleLoginButton />
            </div>
          </div>
        </motion.form>
      )}
    </AuthLayout>
  );
};

export default Login;
