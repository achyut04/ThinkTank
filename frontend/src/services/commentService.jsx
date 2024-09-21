import axios from 'axios';

export const getCommentsByPostId = async (postId) => {
  const response = await axios.get(`/api/posts/${postId}/comments`);
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await axios.post(`/api/posts/${postId}/comments`, { content });
  return response.data;
};

export const updateComment = async (commentId, content) => {
  const response = await axios.put(`/api/comments/${commentId}`, { content });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await axios.delete(`/api/comments/${commentId}`);
  return response.data;
};
