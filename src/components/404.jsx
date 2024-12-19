import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">404!Not Found</h1>
        <p className="text-gray-700">Sorry, the page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;