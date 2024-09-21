import axios from 'axios';

axios.defaults.withCredentials=true;


export const createPost = async (postData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/posts', postData, {
      withCredentials: true,  
    });
    return response.data;  
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error);
    return null;
  }
};



export const getAllPosts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/posts',{
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts', error);
    return [];
  }
};


export const getPostById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

export const addPost = async (post) => {
  const response = await axios.post('/api/posts', post);
  return response.data;
};

export const updatePost = async (postId, post) => {
  const response = await axios.put(`/api/posts/${postId}`, post);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axios.delete(`/api/posts/${postId}`);
  return response.data;
};


// Add a comment to a post
export const addComment = async (postId, commentData, token) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, commentData, {
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the JWT token
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

// Spark a post
export const sparkPost = async (postId, token) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/posts/${postId}/spark`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the JWT token
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sparking post:', error);
    return null;
  }
};