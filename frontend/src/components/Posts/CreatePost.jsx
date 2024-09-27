import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPost } from '../../services/postService';

const CreatePost = () => {
  const { register, handleSubmit, reset } = useForm();
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (e) => {
    setFileList(e.target.files);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('tags', data.tags);
    
    const linksArray = data.links ? data.links.split(',').map(link => link.trim()) : [];
    formData.append('links', JSON.stringify(linksArray));
  
    Array.from(fileList).forEach((file) => {
      formData.append('files', file);
    });
  
    try {
      const response = await createPost(formData);
      console.log('Post created response:', response);
      if (response) {
        reset();
        window.location.href = '/home';
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6">Create a New Post</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              {...register('title', { required: true })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Post Title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Content</label>
            <textarea
              {...register('content', { required: true })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Post Content"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              {...register('tags')}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g., AI, ML, Technology"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Links (comma-separated)</label>
            <input
              type="text"
              {...register('links')}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g., http://example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="text-gray-500"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
