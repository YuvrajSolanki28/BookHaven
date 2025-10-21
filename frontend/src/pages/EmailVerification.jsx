import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
        {status === 'verifying' && (
          <div>
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-emerald-600"></div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div className="mb-4 text-5xl text-emerald-600">✓</div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Email Verified!</h2>
            <p className="mb-4 text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div className="mb-4 text-5xl text-red-600">✗</div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Verification Failed</h2>
            <p className="mb-4 text-gray-600">{message}</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 text-white rounded bg-emerald-600 hover:bg-emerald-700"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
