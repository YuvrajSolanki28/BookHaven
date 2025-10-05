import React, { useState } from 'react';
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import GoogleLoginButton from '../components/GoogleButton';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          navigate('/login');
          // Redirect here if needed
        } else {
          setErrors({ api: data.error || 'Something went wrong' });
        }
      } catch (error) {
        setErrors({ api: 'Network error. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join BookHaven to start your reading journey"
      alternateLink={{
        text: 'Already have an account?',
        href: '/login',
      }}
      alternateLinkText="Sign in"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <UserIcon size={18} className="text-gray-400" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.fullName ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="John Doe"
            />
          </div>
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
        </div>

        {/* Email Field */}
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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Password Field */}
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
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
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
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LockIcon size={18} className="text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="termsAccepted"
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="w-4 h-4 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-600">
              I agree to the{' '}
              <a href="/" className="text-emerald-600 hover:text-emerald-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/" className="text-emerald-600 hover:text-emerald-500">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
        {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}
        {errors.api && <p className="text-sm text-center text-red-600">{errors.api}</p>}

        <GoogleLoginButton />

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </motion.form>
    </AuthLayout>
  );
};

export default Signup;
