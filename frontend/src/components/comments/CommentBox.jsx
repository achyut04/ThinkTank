import React, { useState } from 'react';

const CommentBox = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
    setComment(''); 
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
      <img
        src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726531200&semt=ais_hybrid"
        alt="Your profile"
        className="w-10 h-10 rounded-full"
      />
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Type your thoughts"
        className="flex-grow p-2 border rounded-lg"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">
        Send
      </button>
    </form>
  );
};

export default CommentBox;
