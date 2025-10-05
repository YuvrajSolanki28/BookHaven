import React, { useState } from 'react';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Toaster, toast } from "react-hot-toast";
import AuthLayout from '../components/AuthLayout';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from '../components/GoogleButton';


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
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        notifySuccess('Login successful!');
        navigate('/');
        window.location.reload();
      } else if (response.status === 403) {
        setShowVerification(true);
      } else {
        setErrors({ api: data.error });
      }
    } catch (err) {
      setErrors({ api: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (showVerification) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: verificationCode }),
        });

        const data = await response.json();
        if (response.ok) {
          notifySuccess("Login successful!");

          // Store user token & role in localStorage
          localStorage.setItem("token", data.token);

          navigate("/");
          window.location.reload();
        } else {
          notifyError(data.message || "Invalid verification code");
        }
      } catch (error) {
        console.error("Error:", error);
        notifyError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      handleSubmit();
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
            <h3 className="mb-2 text-lg font-medium text-gray-900">Verify Your Account</h3>
            <p className="text-sm text-gray-600">Enter the verification code sent to {email}</p>
          </div>

          <div>
            <label htmlFor="verificationCode" className="block mb-1 text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={`block w-full px-3 py-2 border ${
                errors.verification ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="Enter 6-digit code"
              maxLength="6"
            />
            {errors.verification && <p className="text-sm text-red-600">{errors.verification}</p>}
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
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
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
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-10 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} className="text-gray-400 hover:text-gray-500" />
                ) : (
                  <EyeIcon size={18} className="text-gray-400 hover:text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          {errors.api && <p className="text-sm text-center text-red-600">{errors.api}</p>}
          <a href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
            Forgot your password?
          </a>
          <GoogleLoginButton />

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </motion.form>
      )}
      {!showVerification}
    </AuthLayout>
  );
};

export default Login;
