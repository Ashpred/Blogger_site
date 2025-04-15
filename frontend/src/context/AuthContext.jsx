import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Use the correct endpoint for retrieving current user
        const response = await axios.get('/api/users/me');
        
        if (response.data && response.data.data) {
          setUser({
            id: response.data.data.id,
            fullName: response.data.data.fullName,
            username: response.data.data.username,
            email: response.data.data.email,
            profilePicture: response.data.data.profilePicture,
            bio: response.data.data.bio
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, newUser = false) => {
    setUser(userData);
    setIsNewUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setIsNewUser(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  };

  const value = {
    user,
    loading,
    isNewUser,
    setIsNewUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 