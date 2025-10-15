import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 text-gray-500 my-6">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
      <span className="text-sm">Thinking...</span>
    </div>
  );
};

export default LoadingIndicator;