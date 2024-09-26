import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostDetails from '../components/Posts/PostDetails';
import CommentBox from '../components/comments/CommentBox';
import { getPostById, addComment, sparkPost, updatePost, deletePost } from '../services/postService'; // Import `updatePost` and `deletePost`
import { getCurrentUser } from '../services/authService';
import { updateComment, deleteComment } from '../services/commentService';

const PostPage = () => {
  const { id } = useParams();  
  const history = useNavigate();  // To redirect after deleting the post
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Store the current user
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();  // Fetch current user
      console.log('Fetched user:', user);   // Debug: Check user data
      if (user && user.isAuthenticated) {
        setCurrentUser(user.userId);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true); // Start loading
      const data = await getPostById(id);
      console.log('Fetched Post:', data); // Debug: Check post data
      if (data) {
        setPost(data);
      }
      setLoading(false); // Stop loading
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (comment) => {
    if (!comment) return;

    const commentData = {
      author: currentUser, 
      content: comment,
    };

    const addedComment = await addComment(id, commentData);
    if (addedComment) {
      const updatedPost = await getPostById(id);
      if (updatedPost) {
        setPost(updatedPost); 
      }
    }
  };

  const handleSpark = async () => {
    const sparkedPost = await sparkPost(id);
    if (sparkedPost) {
      const updatedPost = await getPostById(id);
      if (updatedPost) {
        setPost(updatedPost);
      }
    }
  };

  const handleEditComment = async (commentId, currentContent) => {
    const updatedContent = prompt("Edit your comment:", currentContent);
    if (!updatedContent) return;
  
    const updatedComment = await updateComment(post._id, commentId, updatedContent);  // Pass both postId and commentId
    if (updatedComment) {
      const updatedPost = await getPostById(post._id);
      if (updatedPost) {
        setPost(updatedPost);  // Update the post state with the new comments
      }
    } else {
      console.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;
  
    const deleted = await deleteComment(post._id, commentId);  // Pass both postId and commentId
    if (deleted) {
      const updatedPost = await getPostById(post._id);
      if (updatedPost) {
        setPost(updatedPost);  // Update the post state with the new comments
      }
    } else {
      console.error('Failed to delete comment');
    }
  };

  const handleEditPost = async () => {
    const newTitle = prompt("Edit your post title:", post.title);
    const newContent = prompt("Edit your post content:", post.content);
  
    if (!newTitle || !newContent) return;
  
    setLoading(true);  // Set loading before editing
    const updatedPostData = { title: newTitle, content: newContent };
    const updatedPost = await updatePost(id, updatedPostData);  // API call to update the post
  
    if (updatedPost) {
      // After updating, refetch the entire post, including comments
      const refreshedPost = await getPostById(id);
      if (refreshedPost) {
        setPost(refreshedPost); // Update the post state with the refreshed post data
      }
    } else {
      console.error('Failed to update post');
    }
    setLoading(false); // Stop loading after update
  };
  

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const deleted = await deletePost(id);  // API call to delete the post

    if (deleted) {
      history('/');  // Redirect to homepage after deletion
    }
  };

  if (loading) {
    return <p>Loading...</p>;  // Display loading while data is being fetched or updated
  }

  return (
    <div className="container mx-auto p-6">
      {post ? (
        <>
          <PostDetails post={post} onSpark={handleSpark} />

          {/* Add edit and delete buttons for post author */} 
          {currentUser === post.author._id && (
            <div className="flex space-x-4 mt-6">
              <button className="text-blue-500 hover:underline" onClick={handleEditPost}>
                Edit Post
              </button>
              <button className="text-red-500 hover:underline" onClick={handleDeletePost}>
                Delete Post
              </button>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Add a Comment</h3>
            <CommentBox onSubmit={handleCommentSubmit} />
          </div>

          {/* Render the list of comments below the Add Comment box */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Comments</h3>
            <ul>
              {post.comments.map((comment) => {
                // Format the comment date
                const formattedCommentDate = comment.dateOfComment
                  ? new Date(comment.dateOfComment).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Date not available';

                // Safely check if author exists before accessing properties
                const isPostAuthor = currentUser === post.author._id;
                const isCommentAuthor = comment.author && currentUser === comment.author._id; // Check if comment.author exists

                return (
                  <li key={comment._id} className="border-t border-gray-200 py-4">
                    <p className="text-gray-700">{comment.content}</p>
                    <span className="text-gray-500 text-sm">
                      By {comment.author?.email || 'Unknown'} on {formattedCommentDate} {/* Safe access using optional chaining */}
                    </span>

                    {/* Show Edit/Delete buttons if user is post author or comment author */}
                    {(isPostAuthor || isCommentAuthor) && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleEditComment(comment._id, comment.content)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
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

