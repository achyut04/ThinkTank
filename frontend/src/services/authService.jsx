import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

export const login = async (email, password) => {
  const response = await axios.post('/api/users/login', { email, password });
  Cookies.set('jwt', response.data.token);  
  return response.data;
};

export const register = async (name, email, password, about) => { 
  const response = await axios.post('http://localhost:5000/api/users/register', { name, email, password, about });
  return response.data;
};


export const getCurrentUser = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/users/profile');
    return response.data; 
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { isAuthenticated: false };
  }
};


export const updateUserProfile = async (formData) => {
  try {
    const response = await axios.put('http://localhost:5000/api/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const deleteUserProfile = async () => {
  try {
    await axios.delete('http://localhost:5000/api/users/profile');
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};