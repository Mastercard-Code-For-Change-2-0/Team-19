import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
export const getUserCount = async () => { 
  try {
    const response = await api.get('auth/user-count'); // Correct path
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw error;
  }
};



export const getDonorRoleCount = async () => {
  try {
    const response = await api.get('auth/donor-role-count');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching donor role count:', error);
    throw error;
  }
};

export const getReciverRoleCount = async () => {
  try {
    const response = await api.get('auth/reciver-role-count');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching donor role count:', error);
    throw error;
  }
};

export const getDonationCount = async () => {
  try {
    const response = await api.get('auth/donation-count');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching donor role count:', error);
    throw error;
  }
};