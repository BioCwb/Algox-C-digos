import React, { useState } from 'react';
import { ArrowRightIcon } from './Icon';

interface UserInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isLoading ? "The world is changing..." : "What do you do?"}
        disabled={isLoading}
        className="w-full bg-gray-800 border-2 border-gray-600 focus:border-cyan-500 focus:ring-0 rounded-lg py-3 pl-4 pr-12 text-gray-200 placeholder-gray-500 transition-colors"
        autoFocus
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-gray-700/50 hover:bg-cyan-500 text-cyan-400 hover:text-gray-900 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default UserInput;