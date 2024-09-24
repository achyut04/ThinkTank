import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

export const login = async (email, password) => {
  const response = await axios.post('/api/users/login', { email, password });
  Cookies.set('jwt', response.data.token);  
  return response.data;
};

export const register = async (email, password, about) => {
  const response = await axios.post('/api/users/register', { email, password, about });
  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/users/me');
    return response.data; // Should return { isAuthenticated: true, userId: 'someUserId' }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { isAuthenticated: false };
  }
};