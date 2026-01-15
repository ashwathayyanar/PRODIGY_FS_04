import React, { useState, useEffect } from 'react';
import ChatRoom from './components/ChatRoom';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    const savedUser = sessionStorage.getItem('chat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      name: nameInput.trim(),
      avatar: 'default',
      isOnline: true
    };

    sessionStorage.setItem('chat_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('chat_user');
    setUser(null);
    setNameInput('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Connect Chat</h1>
            <p className="text-slate-400 text-sm">
              Real-time chat powered by BroadcastChannel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="username"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter your name..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Join Chat
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
             <div className="flex items-start space-x-3 text-xs text-slate-500">
               <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p>
                 To simulate a multi-user chat, open this page in multiple tabs or windows in the same browser. 
                 Messages are synced locally via BroadcastChannel.
               </p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return <ChatRoom user={user} onLogout={handleLogout} />;
}

export default App;