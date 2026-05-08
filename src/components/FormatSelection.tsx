import React, { useState } from 'react';
import type { BracketFormat, Team } from '../types';
import { generateSingleElimination, generateDoubleElimination, generateRoundRobin } from '../utils/bracketGenerator';
import { ChevronRight } from 'lucide-react';

interface FormatSelectionProps {
  teams: Team[];
  onFormatSelected: (format: BracketFormat, bracketName: string) => void;
  disabled?: boolean;
}

export const FormatSelection: React.FC<FormatSelectionProps> = ({
  teams,
  onFormatSelected,
  disabled = false,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<BracketFormat>('single-elimination');
  const [bracketName, setBracketName] = useState('Tournament 1');

  const formats: Array<{ id: BracketFormat; name: string; description: string; icon: string }> = [
    {
      id: 'single-elimination',
      name: 'Single Elimination',
      description: 'Lose once and you\'re out. Fast-paced, one champion.',
      icon: '🎯',
    },
    {
      id: 'double-elimination',
      name: 'Double Elimination',
      description: 'Losers bracket. Second chance for teams.',
      icon: '🔄',
    },
    {
      id: 'round-robin',
      name: 'Round Robin',
      description: 'Every team plays every other team. Comprehensive.',
      icon: '🔁',
    },
  ];

  const getPreview = () => {
    if (teams.length === 0) return 'Add teams to see bracket preview';

    let rounds = [];
    switch (selectedFormat) {
      case 'single-elimination':
        rounds = generateSingleElimination(teams);
        break;
      case 'double-elimination':
        rounds = generateDoubleElimination(teams);
        break;
      case 'round-robin':
        rounds = generateRoundRobin(teams);
        break;
    }

    const totalMatches = rounds.reduce((sum, round) => sum + round.matches.length, 0);
    const totalRounds = rounds.length;

    return `${totalRounds} rounds, ${totalMatches} matches`;
  };

  const handleGenerate = () => {
    if (teams.length < 2) {
      alert('Add at least 2 teams to generate a bracket');
      return;
    }

    onFormatSelected(selectedFormat, bracketName);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 rounded-full -ml-32 -mt-32 opacity-30 blur-3xl"></div>
      
      <div className="relative mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
          Tournament Format
        </h2>
        <p className="text-slate-500 font-medium mt-1">Choose the competitive structure for your bracket</p>
      </div>

      <div className="mb-8 relative">
        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-tighter">Bracket Name</label>
        <input
          type="text"
          value={bracketName}
          onChange={(e) => setBracketName(e.target.value)}
          placeholder="e.g., Grand Finals 2026"
          disabled={disabled}
          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-slate-800 font-bold disabled:opacity-50 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => setSelectedFormat(format.id)}
            disabled={disabled}
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 text-left ${
              selectedFormat === format.id
                ? 'border-purple-600 bg-purple-50 shadow-xl shadow-purple-500/10'
                : 'border-slate-100 bg-white hover:border-slate-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className={`text-4xl mb-4 transform transition-transform group-hover:scale-110 duration-500 ${selectedFormat === format.id ? 'animate-bounce' : ''}`}>{format.icon}</div>
            <h3 className={`font-black text-lg transition-colors ${selectedFormat === format.id ? 'text-purple-700' : 'text-slate-800'}`}>{format.name}</h3>
            <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">{format.description}</p>
            
            {selectedFormat === format.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">Bracket Intelligence</span>
            <p className="text-white font-bold text-lg">
              {getPreview()}
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Trophy className="text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {teams.length < 2 && (
        <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-5 mb-6 text-red-600 flex items-center gap-3 animate-pulse">
          <div className="bg-red-600 text-white p-1 rounded-lg">
            <X size={16} />
          </div>
          <p className="text-sm font-bold">Add at least 2 teams before generating a bracket</p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={disabled || teams.length < 2}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-5 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1 active:translate-y-0 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl"
      >
        Generate Championship Bracket <ChevronRight size={20} />
      </button>
    </div>
  );
};
