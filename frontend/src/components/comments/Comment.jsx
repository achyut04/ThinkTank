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

  // Debugging: Check if profilePicture exists in the comment object
  console.log("Profile Picture: ", comment.author?.profilePicture);

  return (
    <div className="comment-container p-4 mb-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        {/* Profile Picture Handling */}
        <img
          src={comment.author?.profilePicture ? `http://localhost:5000${comment.author.profilePicture}` : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726531200&semt=ais_hybrid"}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-4"
        />
        <span>By {comment.author?.email || 'Unknown Author'}</span>
      </div>
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
            <span>{moment(comment.dateOfComment).format('MMMM Do YYYY, h:mm:ss a')}</span>
          </div>
        </div>
      )}

      {comment.author?._id === loggedInUserId && !isEditing && (
        <div className="comment-actions mt-2">
          <button className="btn btn-primary mr-2" onClick={handleEditComment}>Edit</button>
          <button className="btn btn-danger" onClick={handleDeleteComment}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Comment;
