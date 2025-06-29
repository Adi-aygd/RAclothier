import React from 'react';
import useStore from '../store/useStore';
import { User, Mail, Shield, Calendar, Crown } from 'lucide-react';

const UserProfile = () => {
  const { user, isAuthenticated } = useStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-center">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    // Handle Firebase timestamp format
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString();
    }

    // Handle regular date string/object
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-6 w-6" />
          User Profile
        </h2>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">
              Display Name
            </label>
            <p className="text-gray-900 font-medium">
              {user.displayName || `${user.firstName} ${user.lastName}`}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <p className="text-gray-900">{user.email}</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">
              First Name
            </label>
            <p className="text-gray-900">{user.firstName}</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">
              Last Name
            </label>
            <p className="text-gray-900">{user.lastName}</p>
          </div>
        </div>

        {/* Role and Admin Status */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Role
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {user.role}
              </span>
              {user.isFirstAdmin && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  First Admin
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">User ID</label>
            <p className="text-gray-900 font-mono text-sm">{user.uid}</p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Account Created
            </label>
            <p className="text-gray-900">{formatDate(user.createdAt)}</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Last Updated
            </label>
            <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
          </div>
        </div>

        {/* Debug Information (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Debug Info (Dev Only)
            </h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
