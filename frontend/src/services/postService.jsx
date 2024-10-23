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
    const response = await axios.get('http://localhost:5000/api/posts/',{
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
    if (response && response.data) {
      return response.data;
    } else {
      console.error('No data found in response');
      return null;
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};



export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    return null;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    return null;
  }
};


export const addComment = async (postId, commentData, token) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, commentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};


export const sparkPost = async (postId, token) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/posts/${postId}/spark`, {}, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sparking post:', error);
    return null;
  }
};
export const removeSpark = async (postId, token) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/posts/${postId}/spark`, {}, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sparking post:', error);
    return null;
  }
};

export const fetchFile = async (filename) => {
  try {
    console.log(`Fetching file from: /api/posts/files/${filename}`); 
    const response = await axios.get(`http://localhost:5000/api/posts/files/${filename}`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(new Blob([response.data]));
  } catch (error) {
    console.error('Error fetching the file:', error);
    return null;
  }
};

export const getPostsByCreator = async (creatorId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/posts/creator/${creatorId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts by creator:', error);
    return null;
  }
}