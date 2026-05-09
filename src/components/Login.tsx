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
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm fade-up">

        {/* Card — brand mark + form unified inside */}
        <div className="card card-lg">

          {/* Brand */}
          <div className="flex flex-col items-center gap-4 mb-9">
            <div className="w-14 h-14 metallic-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy size={26} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="heading text-2xl">
                Nexus<span className="text-metallic-500 font-medium">System</span>
              </h1>
              <p className="text-sm text-metallic-500 mt-1">Championship Management</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="flex flex-col gap-2">
              <label className="label-xs">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-metallic-400 pointer-events-none">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="input-base pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="label-xs">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-metallic-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="metallic-accent w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold mt-1 hover:opacity-90 active:scale-[.98] transition-all"
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          {/* Credentials hint */}
          <div className="mt-8 pt-6 border-t border-metallic-300">
            <div className="flex items-center justify-between mb-3">
              <span className="label-xs">Default credentials</span>
              <div className="flex items-center gap-1.5 text-metallic-500">
                <Shield size={12} />
                <span className="text-xs font-medium">Secure session</span>
              </div>
            </div>
            <div className="bg-bg border border-metallic-300 rounded-lg px-4 py-3">
              <code className="text-sm font-bold text-metallic-800 tracking-wide">
                admin / admin123
              </code>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
