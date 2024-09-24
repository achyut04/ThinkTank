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

          {/* Render the list of comments below the Add Comment box */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Comments</h3>
            <ul>
              {post.comments.map((comment) => {
                // Check if `dateOfComment` exists before formatting
                const formattedCommentDate = comment.dateOfComment
                  ? new Date(comment.dateOfComment).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Date not available';

                return (
                  <li key={comment._id} className="border-t border-gray-200 py-4">
                    <p className="text-gray-700">{comment.content}</p>
                    <span className="text-gray-500 text-sm">
                      By {comment.author?.email || 'Unknown'} on {formattedCommentDate}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
};

export default PostPage;
