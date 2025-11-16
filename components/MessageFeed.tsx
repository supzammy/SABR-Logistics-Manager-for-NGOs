import React from 'react';
import type { Message } from '../types';
import { Icon } from './Icon';

interface MessageFeedProps {
  messages: Message[];
}

export const MessageFeed: React.FC<MessageFeedProps> = ({ messages }) => {
  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
      {messages.map(msg => (
        <div key={msg.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-800 dark:text-white">
            {msg.fromAvatar}
          </div>
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{msg.from}</p>
              {!msg.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{msg.content}</p>
            <p className="text-xs text-gray-500 mt-2 text-right">{new Date(msg.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ))}
      {messages.length === 0 && (
        <div className="text-center py-10 text-gray-500">
            <Icon icon="message-square" className="w-8 h-8 mx-auto mb-2" title="No messages" />
            <p>No messages yet.</p>
        </div>
      )}
    </div>
  );
};
