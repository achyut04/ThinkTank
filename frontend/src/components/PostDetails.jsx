import React from 'react';

const PostDetails = ({ post, onSpark }) => {
  const { title, content, author, totalSparks, comments, dateOfPost } = post;

  // Format the date
  const formattedDate = new Date(dateOfPost).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <div className="flex items-center text-gray-500">
          <img
            src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726531200&semt=ais_hybrid"
            alt="Author"
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <span className="font-semibold">{author?.email || 'Unknown Author'}</span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-lg text-gray-700 mb-4">{content}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onSpark} className="flex items-center text-yellow-500">
            <svg
              xmlns="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726531200&semt=ais_hybrid"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2l2.092 6.26h6.568l-5.324 3.87L16.344 18 12 14.63 7.656 18l1.008-5.87-5.324-3.87h6.568L12 2z"
              />
            </svg>
            <span>{totalSparks}</span>
          </button>

          <button className="flex items-center text-gray-500">
            <svg
              xmlns="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726531200&semt=ais_hybrid"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h8m0 0V8m0 4v4m0 0l4-4m-8-4v8"
              />
            </svg>
            <span>{comments.length} Comments</span>
          </button>
        </div>

        <button className="flex items-center text-gray-500">
          <svg
            xmlns="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726531200&semt=ais_hybrid"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H3m12 0l-3-3m3 3l-3 3"
            />
          </svg>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostDetails;
