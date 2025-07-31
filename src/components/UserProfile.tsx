import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const userInfo = user.profile;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-4">
        {userInfo.picture && (
          <img
            src={userInfo.picture}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-bold text-white">
            {userInfo.name || userInfo.preferred_username || 'User'}
          </h2>
          <p className="text-gray-300">{userInfo.email}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {userInfo.given_name && (
          <p className="text-gray-300">
            <span className="font-semibold">First Name:</span> {userInfo.given_name}
          </p>
        )}
        {userInfo.family_name && (
          <p className="text-gray-300">
            <span className="font-semibold">Last Name:</span> {userInfo.family_name}
          </p>
        )}
        {userInfo.email_verified !== undefined && (
          <p className="text-gray-300">
            <span className="font-semibold">Email Verified:</span>{' '}
            <span className={userInfo.email_verified ? 'text-green-400' : 'text-red-400'}>
              {userInfo.email_verified ? 'Yes' : 'No'}
            </span>
          </p>
        )}
      </div>
      
      <button
        onClick={logout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile; 