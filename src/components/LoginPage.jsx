import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate('/users');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Login to Your Account</h3>
        <div className="mt-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
            <button
              onClick={() => handleLogin('Admin')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Login as Admin
            </button>
            <button
              onClick={() => handleLogin('Editor')}
              className="bg-green-500 text-white px-4 py-2 rounded-md mb-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Login as Editor
            </button>
            <button
              onClick={() => handleLogin('Viewer')}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              Login as Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;