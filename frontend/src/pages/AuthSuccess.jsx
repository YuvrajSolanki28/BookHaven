import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthData } from '../utils/auth';
import { toast } from 'react-hot-toast';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            // Decode token to get user info
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const user = {
                    id: payload.userId,
                    email: payload.email,
                    isAdmin: payload.isAdmin
                };
                
                setAuthData(token, user);
                toast.success('Login successful!');
                navigate('/');
                window.location.reload();
            } catch (error) {
                toast.error('Authentication failed');
                navigate('/login');
            }
        } else {
            toast.error('Authentication failed');
            navigate('/login');
        }
    }, [navigate, searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-emerald-600"></div>
                <p className="mt-4 text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
