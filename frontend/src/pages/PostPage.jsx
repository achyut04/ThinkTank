import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostDetails from '../components/Posts/PostDetails';
import CommentBox from '../components/comments/CommentBox';
import { getPostById, addComment, sparkPost, updatePost, deletePost, fetchFile } from '../services/postService';
import { getCurrentUser } from '../services/authService';
import { updateComment, deleteComment } from '../services/commentService';

const PostPage = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user && user.isAuthenticated) {
        setCurrentUser(user.user.id);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const data = await getPostById(id);
      if (data) {
        setPost(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleFiles = async (file) => {
    const baseUrl = 'http://localhost:5000'; 
    const fileUrl = `${baseUrl}${file.fileUrl}`; 

    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const handleCommentSubmit = async (comment) => {
    if (!comment) {
      console.log('No comment provided.');
      return;
    }
  
    const commentData = {
      author: currentUser,
      content: comment,
      post: id,
    };
  
    console.log('Submitting comment:', commentData); 
  
    try {
      const addedComment = await addComment(id, commentData);
      if (addedComment) {
        console.log('Comment added successfully:', addedComment); 
        const updatedPost = await getPostById(id);
        if (updatedPost) {
          console.log('Updated post after adding comment : ', updatedPost);
          setPost(updatedPost);
        }
      } else {
        console.error('Failed to add comment.');
      }
    } catch (error) {
      console.error('Error in handleCommentSubmit:', error); 
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

  const handleEditPost = async () => {
    const newTitle = prompt('Edit your post title:', post.title);
    const newContent = prompt('Edit your post content:', post.content);

    if (!newTitle || !newContent) return;

    setLoading(true);
    const updatedPostData = { title: newTitle, content: newContent };
    const updatedPost = await updatePost(id, updatedPostData);

    if (updatedPost) {
      const refreshedPost = await getPostById(id);
      if (refreshedPost) {
        setPost(refreshedPost);
      }
    } else {
      console.error('Failed to update post');
    }
    setLoading(false);
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const deleted = await deletePost(id);
    if (deleted) {
      history('/');
    }
  };

  const handleEditComment = async (commentId, currentContent) => {
    const newContent = prompt('Edit your comment:', currentContent);
    if (!newContent) return;

    const updatedComment = await updateComment(id, commentId, newContent);
    if (updatedComment) {
      const updatedPost = await getPostById(id);
      if (updatedPost) {
        setPost(updatedPost);
      }
    } else {
      console.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    const deletedComment = await deleteComment(id, commentId);
    if (deletedComment) {
      const updatedPost = await getPostById(id);
      if (updatedPost) {
        setPost(updatedPost);
      }
    } else {
      console.error('Failed to delete comment');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      {post ? (
        <>
          <PostDetails post={post} onSpark={handleSpark} />

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

          {post.links && post.links.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4">References</h3>
              <ul className="list-disc list-inside">
                {post.links.map((link, index) => (
                  <li key={index} className="text-blue-500 hover:underline">
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {post.files && post.files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4">Files</h3>
              <ul className="list-disc list-inside">
                {post.files.map((file, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleFiles(file)}
                      className="text-blue-500 hover:underline"
                    >
                      {file.fileName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Add a Comment</h3>
            <CommentBox onSubmit={handleCommentSubmit} />
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Comments</h3>
            <ul>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => {
                  const formattedCommentDate = comment.dateOfComment
                    ? new Date(comment.dateOfComment).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Date not available';

                  const isPostAuthor = currentUser === post.author._id;
                  const isCommentAuthor = comment.author && currentUser === comment.author._id;

                  return (
                    <li key={comment._id} className="border-t border-gray-200 py-4">
                      <p className="text-gray-700">{comment.content}</p>
                      <span className="text-gray-500 text-sm">
                        By {comment.author?.email || 'Unknown'} on {formattedCommentDate}
                      </span>

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
                })
              ) : (
                <p>No comments yet. Be the first to comment!</p>
              )}
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
