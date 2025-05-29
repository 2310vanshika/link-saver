import React from 'react';

const BookmarkCard = ({ data, onDelete, onToggleBookmark }) => {
  return (
    <div className="border rounded p-4 shadow-md bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">{data.title}</h2>
        <div className="flex gap-4 items-center">
     
          <button
            onClick={onToggleBookmark}
            title="Toggle Bookmark"
            className={`text-xl focus:outline-none ${
              data.bookmarked ? 'text-yellow-400' : 'text-gray-400'
            }`}
          >
            {data.bookmarked ? '★' : '☆'}
          </button>

          <button
            onClick={onDelete}
            className="text-red-600 font-semibold hover:underline text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block mb-1">
        {data.url}
      </a>
      <p className="text-gray-500 text-sm mb-2">
        {new Date(data.createdAt).toLocaleString()}
      </p>
      <div className="bg-gray-100 rounded p-3 text-sm whitespace-pre-line">
        <strong>Summary:</strong> {data.summary}
      </div>
    </div>
  );
};

export default BookmarkCard;

