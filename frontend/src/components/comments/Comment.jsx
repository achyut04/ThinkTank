import React, { useState } from 'react'; 
import { deleteComment, editComment, getPostById } from '../../services/postService';
import moment from 'moment';

const Comment = ({ comment, postId, loggedInUserId, token, setPost }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleDeleteComment = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (confirmed) {
      await deleteComment(postId, comment._id, token);
      const updatedPost = await getPostById(postId);
      if (updatedPost) {
        setPost(updatedPost);
      }
    }
  };

  const handleEditComment = () => {
    setIsEditing(true);
  };

  const saveEditedComment = async () => {
    const updatedComment = await editComment(postId, comment._id, { content: editContent }, token);
    if (updatedComment) {
      const updatedPost = await getPostById(postId);
      setPost(updatedPost);
      setIsEditing(false);
    }
  };

  return (
    <div className="comment-container p-4 mb-4 bg-gray-100 rounded-lg shadow-md">
      {isEditing ? (
        <div>
          <textarea
            className="w-full border p-2"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button className="btn btn-success mt-2" onClick={saveEditedComment}>Save</button>
        </div>
      ) : (
        <div>
          <p className="comment-content text-gray-800 mb-2">{comment.content}</p>
          <div className="comment-meta text-sm text-gray-500 flex justify-between">
            <span>By {comment.author.email}</span>
            <span>{moment(comment.dateOfComment).format('MMMM Do YYYY, h:mm:ss a')}</span>
          </div>
        </div>
      )}

      {comment.author._id === loggedInUserId && !isEditing && (
        <div className="comment-actions mt-2">
          <button className="btn btn-primary mr-2" onClick={handleEditComment}>Edit</button>
          <button className="btn btn-danger" onClick={handleDeleteComment}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Comment;
