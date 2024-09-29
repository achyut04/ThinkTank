import axios from 'axios';
import Cookies from 'js-cookie';

export const getCommentsByPostId = async (postId) => {
  const response = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
  return response.data;
};

export const getCommentsByUser = async (userId) => {
  try {
    console.log('Making API call to fetch comments for user:', userId); 
    const response = await axios.get(`http://localhost:5000/api/users/comments/${userId}`);
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments by user:', error);
    throw error;
  }
};


export const addComment = async (postId, content) => {
  try{
    const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, { content });
    return response.data;
  }catch(error){
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const updateComment = async (postId, commentId, newContent) => {
  try {
    const token = Cookies.get('jwt'); 
    const response = await axios.put(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, 
    { content: newContent }, 
    {
      withCredentials: true, 
      headers: {
        Authorization: `Bearer ${token}`, 
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
    const token = Cookies.get('jwt');

    const response = await axios.delete(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return null;
  }
};