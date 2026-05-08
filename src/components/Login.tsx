import React, { useState } from 'react';
import { useTournamentStore } from '../store/tournamentStore';
import { Shield, User, Lock, ArrowRight, Trophy } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useTournamentStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      login(username, password);
    }
  };

  return (
    <div className="min-h-screen bg-metallic-950 flex items-center justify-center p-4 relative overflow-hidden brushed-metal">
      {/* Background Orbs - Subtle Silver/Steel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative">
        <div className="metallic-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-metallic-700 to-metallic-500 rounded-2xl shadow-xl mb-6 transform rotate-3 border border-white/10 shine-effect">
              <Trophy size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Nexus<span className="text-metallic-400">System</span></h1>
            <p className="text-metallic-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Authorization Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-metallic-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-metallic-600 group-focus-within:text-white transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-metallic-900/50 border border-white/5 focus:border-metallic-400 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-metallic-700 outline-none transition-all focus:ring-4 focus:ring-white/5"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-metallic-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-metallic-600 group-focus-within:text-white transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-metallic-900/50 border border-white/5 focus:border-metallic-400 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-metallic-700 outline-none transition-all focus:ring-4 focus:ring-white/5"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-metallic-100 to-white text-metallic-950 font-black py-4 rounded-2xl shadow-xl hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group uppercase text-sm tracking-widest"
            >
              Initialize Access
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-metallic-600">
              <Shield size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Encrypted Session Active</span>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-center">
              <p className="text-[8px] font-bold text-metallic-500 uppercase tracking-widest">Master Credentials</p>
              <p className="text-[10px] font-black text-metallic-300 mt-1">USER: admin // PASS: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
