import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { User, Message, MessageType, BroadcastPayload } from '../types';
import * as channelService from '../services/channel';
import Bubble from './Bubble';
import Sidebar from './Sidebar';

interface ChatRoomProps {
  user: User;
  onLogout: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ user, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState<User[]>([user]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useLayoutEffect(() => {
    scrollToBottom('auto');
  }, [messages.length]);

  // Initial broadcast and listeners
  useEffect(() => {
    // Announce join
    channelService.initChannel(user.id);
    channelService.broadcastMessage(MessageType.JOIN, user, user.id);

    // Initial message
    setMessages([
      {
        id: 'system-1',
        senderId: 'system',
        senderName: 'System',
        content: `Welcome to the chat, ${user.name}! Open this URL in another tab to chat with yourself and simulate multiple users.`,
        timestamp: Date.now(),
        type: 'system'
      }
    ]);

    // Request sync from other tabs
    channelService.broadcastMessage(MessageType.SYNC_REQUEST, null, user.id);

    // Subscribe to channel
    const unsubscribe = channelService.subscribeToChannel((data: BroadcastPayload) => {
      switch (data.type) {
        case MessageType.CHAT:
          setMessages(prev => [...prev, data.payload]);
          break;
        case MessageType.JOIN:
          setUsers(prev => {
             if (prev.find(u => u.id === data.payload.id)) return prev;
             return [...prev, data.payload];
          });
          // Send back who we are so they know
          channelService.broadcastMessage(MessageType.HEARTBEAT, user, user.id);
          break;
        case MessageType.HEARTBEAT:
          setUsers(prev => {
             if (prev.find(u => u.id === data.payload.id)) return prev;
             return [...prev, data.payload];
          });
          break;
        case MessageType.SYNC_REQUEST:
          // Reply with presence
          channelService.broadcastMessage(MessageType.HEARTBEAT, user, user.id);
          break;
        case MessageType.LEAVE:
           setUsers(prev => prev.filter(u => u.id !== data.payload.id));
           break;
      }
    });

    return () => {
      channelService.broadcastMessage(MessageType.LEAVE, user, user.id);
      unsubscribe();
      channelService.closeChannel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const content = inputValue.trim();
    setInputValue('');

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      content,
      timestamp: Date.now(),
      type: 'text'
    };

    // Update local and broadcast
    setMessages(prev => [...prev, newMessage]);
    channelService.broadcastMessage(MessageType.CHAT, newMessage, user.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
    setInputValue(target.value);
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar 
        currentUser={user} 
        activeUsers={users} 
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top Navigation Bar */}
        <div className="h-16 flex items-center justify-between px-4 bg-slate-900 border-b border-slate-800 shadow-sm z-10">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-3 text-slate-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex flex-col">
              <h3 className="font-bold text-slate-100 flex items-center">
                <span className="text-slate-500 mr-2">#</span> general
              </h3>
              <p className="text-xs text-slate-500 hidden sm:block">
                BroadcastChannel Active • Open multiple tabs to test
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             {/* Info Tooltip/Badge */}
             <div className="hidden md:flex items-center px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                <span className="text-xs font-medium text-indigo-400">Real-time Ready</span>
             </div>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide space-y-2 bg-slate-900" 
          ref={chatContainerRef}
        >
          {messages.map((msg, index) => {
            // Check if sequence is same user to group visually (optional enhancement for future)
            const isSelf = msg.senderId === user.id;
            return <Bubble key={msg.id} message={msg} isSelf={isSelf} />;
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="max-w-4xl mx-auto relative flex items-end bg-slate-800/50 rounded-xl border border-slate-700 focus-within:border-indigo-500/50 focus-within:bg-slate-800 transition-all shadow-lg">
            <button className="p-3 text-slate-400 hover:text-indigo-400 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={autoResize}
              onKeyDown={handleKeyDown}
              placeholder="Message #general"
              className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-200 placeholder-slate-500 py-3.5 px-2 resize-none max-h-[120px] scrollbar-hide"
              style={{ minHeight: '48px' }}
            />
            
            <div className="p-2">
               <button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                    ${inputValue.trim() 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transform hover:scale-105' 
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                >
                  <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
            </div>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-600">
                Open multiple tabs to chat.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;