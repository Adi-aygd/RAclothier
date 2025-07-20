import { useEffect } from 'react';
import useStore from '../store/useStore';
import { authAPI } from '../utils/api';

export const useAuth = () => {
  const { login, logout, setLoading, user, isAuthenticated } = useStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Verify token and get user profile
        const response = await authAPI.getProfile();

        // Handle the new response format
        const userData = response.result;

        // Update store with user data
        login({
          id: userData.uid,
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Token is invalid, remove it
        localStorage.removeItem('token');
        logout();
      } finally {
        setLoading(false);
      }
    };

    // Always initialize auth on mount to check token
    initializeAuth();
  }, [login, logout, setLoading]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};

export default useAuth;
