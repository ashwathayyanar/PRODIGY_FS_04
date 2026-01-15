import React from 'react';
import { Message } from '../types';

interface BubbleProps {
  message: Message;
  isSelf: boolean;
}

const Bubble: React.FC<BubbleProps> = ({ message, isSelf }) => {
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-4 ${isSelf ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] md:max-w-[70%] ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white
            ${isSelf ? 'bg-emerald-600' : 'bg-slate-600'} 
          ${isSelf ? 'ml-2' : 'mr-2'}`}
        >
           {message.senderName.substring(0, 2).toUpperCase()}
        </div>

        {/* Bubble Content */}
        <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
          <div className="flex items-baseline mb-1 space-x-2">
            <span className="text-xs font-medium text-slate-400">
              {message.senderName}
            </span>
            <span className="text-[10px] text-slate-600">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm
            ${isSelf 
              ? 'bg-emerald-600 text-white rounded-tr-none' 
              : 'bg-slate-800 text-slate-200 rounded-tl-none'
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bubble;