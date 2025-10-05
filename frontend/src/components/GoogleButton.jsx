import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = ({ backendUrl }) => {
  const handleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `http://localhost:8000/auth/google`;
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center w-full max-w-2xl gap-2 px-4 py-2 transition border rounded-lg shadow-sm hover:bg-gray-100"
    >
      <FcGoogle size={22} />
      <span className="font-medium">Continue with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
