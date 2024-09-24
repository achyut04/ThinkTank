import axios from 'axios';
import Cookies from 'js-cookie';

export const getCommentsByPostId = async (postId) => {
  const response = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, { content });
  return response.data;
};

export const updateComment = async (postId, commentId, newContent) => {
  try {
    // Get the JWT token from cookies
    const token = Cookies.get('jwt');  // Ensure JWT is available in cookies

    const response = await axios.put(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, 
    { content: newContent },  // Send the new content in the request body
    {
      withCredentials: true,  // Ensure cookies are sent with the request
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    return null;
  }
};


export const deleteComment = async (postId, commentId) => {
  try {
    // Get the JWT token from cookies if needed (since you are using cookies for JWT)
    const token = Cookies.get('jwt');  // Ensure the JWT is available in cookies

    const response = await axios.delete(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
      withCredentials: true,  // Ensure cookies are sent with the request
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return null;
  }
};