import React from 'react';
import type { StorySegment } from '../types';

interface StoryDisplayProps {
  storyHistory: StorySegment[];
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyHistory }) => {
  return (
    <div className="space-y-6 text-base leading-relaxed">
      {storyHistory.map((segment, index) => (
        <div key={index}>
          {segment.type === 'player' && (
            <p className="text-cyan-400">
              <span className="mr-2">&gt;</span>{segment.text}
            </p>
          )}
          {segment.type === 'narrator' && (
            <p className="text-gray-300 whitespace-pre-wrap">{segment.text}</p>
          )}
          {segment.type === 'error' && (
            <p className="text-red-400 bg-red-900/20 p-2 rounded border border-red-500/50">
              <span className="font-bold mr-2">[SYSTEM_ERROR]:</span>{segment.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StoryDisplay;