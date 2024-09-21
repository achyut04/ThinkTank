import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostDetails from '../components/PostDetails';
import CommentBox from '../components/CommentBox';
import { getPostById, addComment, sparkPost } from '../services/postService';

const PostPage = () => {
  const { id } = useParams();  
  const [post, setPost] = useState(null);
  const token = localStorage.getItem('token');  

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostById(id);
      if (data) {
        setPost(data);
      }
    };

    fetchPost();
  }, [id]);


  const handleCommentSubmit = async (comment) => {
    if (!comment) return;

    const commentData = {
      author: post.author._id, 
      content: comment,
    };

    const addedComment = await addComment(id, commentData, token);
    if (addedComment) {
    
      const updatedPost = await getPostById(id);
      if (updatedPost) {
        setPost(updatedPost); 
      }
    }
  };


  const handleSpark = async () => {
    const sparkedPost = await sparkPost(id, token);
    if (sparkedPost) {
    
      const updatedPost = await getPostById(id);
      if (updatedPost) {
        setPost(updatedPost);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      {post ? (
        <>
          <PostDetails post={post} onSpark={handleSpark} />
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Add a Comment</h3>
            <CommentBox onSubmit={handleCommentSubmit} />
          </div>
        </>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
};

export default PostPage;


