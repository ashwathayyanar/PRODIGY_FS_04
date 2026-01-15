import React from 'react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User | null;
  activeUsers: User[];
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, activeUsers, onLogout, isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-full flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Connect Chat
            </h1>
          </div>
        </div>

        {/* Rooms Section (Mock) */}
        <div className="p-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Rooms</h2>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium border border-slate-700 flex items-center">
              <span className="text-slate-400 mr-2">#</span> general
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors flex items-center">
              <span className="text-slate-600 mr-2">#</span> tech-talk
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors flex items-center">
              <span className="text-slate-600 mr-2">#</span> random
            </button>
          </div>
        </div>

        {/* Users Section */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
            Online — {activeUsers.length}
          </h2>
          <div className="space-y-1">
            {activeUsers.map(user => (
              <div key={user.id} className="flex items-center px-2 py-1.5 rounded-lg hover:bg-slate-800/30 transition-colors group">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-slate-700">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 
                    ${user.isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-300">
                    {user.name}
                    {user.id === currentUser?.id && <span className="text-slate-500 text-xs font-normal ml-1">(You)</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile / Logout */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 mr-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {currentUser?.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
                <p className="text-xs text-slate-500">Online</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;