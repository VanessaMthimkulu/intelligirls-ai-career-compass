/**
 * @file A React component that displays a "typing" animation.
 * This provides visual feedback to the user that the bot is processing
 * and generating a response.
 */
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start items-center space-x-2 p-4">
      <div className="bg-gray-700 rounded-2xl px-5 py-3 shadow-md flex items-center space-x-1.5">
          {/* Three animated dots create the classic "typing" effect. */}
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;