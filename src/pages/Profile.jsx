import React from 'react';
import UserProfile from './dashboard/features/userProfile/UserProfile';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">
            View and manage your account information
          </p>
        </div>

        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
