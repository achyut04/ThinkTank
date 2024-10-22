import React, { useState, useEffect } from 'react';
import { updatePost, getPostById } from '../../services/postService'; 

const EditPostModal = ({ postId, closeModal, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setTags(initialData.tags ? initialData.tags.join(', ') : '');  
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPostData = {
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()),  
    };

    try {
      const response = await updatePost(postId, updatedPostData);
      console.log('Post updated response:', response);

      if (response) {
        closeModal();
        window.location.href = `/posts/${postId}`; 
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Post Title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Post Content"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. AI, ML, Technology"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="text-gray-500"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
