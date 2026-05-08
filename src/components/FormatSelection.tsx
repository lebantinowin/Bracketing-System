import React, { useState } from 'react';
import type { BracketFormat, Team } from '../types';
import { generateSingleElimination, generateDoubleElimination, generateRoundRobin } from '../utils/bracketGenerator';
import { ChevronRight, Trophy, Target, RefreshCw, Repeat } from 'lucide-react';

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

  const formats: Array<{ id: BracketFormat; name: string; description: string; icon: React.ReactNode }> = [
    {
      id: 'single-elimination',
      name: 'Direct Elimination',
      description: 'HIGH STAKES. ONE FAILURE EQUALS SYSTEM TERMINATION.',
      icon: <Target size={32} />,
    },
    {
      id: 'double-elimination',
      name: 'Resurrection Matrix',
      description: 'LOWER BRACKET REDEPLOYMENT ENABLED. SECOND CHANCE ACTIVE.',
      icon: <RefreshCw size={32} />,
    },
    {
      id: 'round-robin',
      name: 'Full Simulation',
      description: 'TOTAL COVERAGE. EVERY UNIT ENGAGES EVERY ADVERSARY.',
      icon: <Repeat size={32} />,
    },
  ];

  const getPreview = () => {
    if (teams.length === 0) return 'PENDING: ADD UNITS TO CALCULATE';

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

    return `${totalRounds} STAGES // ${totalMatches} ENGAGEMENTS`;
  };

  const handleGenerate = () => {
    if (teams.length < 2) {
      alert('Minimum 2 units required for bracket generation');
      return;
    }

    onFormatSelected(selectedFormat, bracketName);
  };

  return (
    <div className="metallic-card rounded-3xl p-8 border border-white/10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32 opacity-20 blur-3xl"></div>
      
      <div className="relative mb-10">
        <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3">
          <div className="w-1.5 h-8 bg-metallic-400 rounded-full"></div>
          Engagement Protocol
        </h2>
        <p className="text-metallic-500 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Select Tournament Matrix</p>
      </div>

      <div className="mb-10 relative">
        <label className="block text-[10px] font-black text-metallic-400 uppercase mb-2 ml-1 tracking-[0.3em]">Operation Codename</label>
        <input
          type="text"
          value={bracketName}
          onChange={(e) => setBracketName(e.target.value)}
          placeholder="e.g., SECTOR-7 ALPHA"
          disabled={disabled}
          className="w-full px-5 py-4 bg-metallic-900/50 border border-white/5 rounded-2xl focus:outline-none focus:border-metallic-400 transition-all text-white font-black uppercase tracking-tight disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => setSelectedFormat(format.id)}
            disabled={disabled}
            className={`group relative p-8 rounded-2xl border transition-all duration-500 text-left ${
              selectedFormat === format.id
                ? 'border-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]'
                : 'border-white/5 bg-metallic-900/30 hover:border-white/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className={`mb-6 transition-all duration-500 ${selectedFormat === format.id ? 'text-white scale-110' : 'text-metallic-600'}`}>
              {format.icon}
            </div>
            <h3 className={`font-black text-lg transition-colors italic uppercase tracking-tighter ${selectedFormat === format.id ? 'text-white' : 'text-metallic-300'}`}>{format.name}</h3>
            <p className="text-[10px] text-metallic-600 font-black mt-3 leading-relaxed tracking-widest">{format.description}</p>
            
            {selectedFormat === format.id && (
              <div className="absolute top-4 right-4 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                <div className="w-1.5 h-1.5 bg-metallic-950 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-metallic-950 rounded-2xl p-6 mb-10 relative overflow-hidden group border border-white/5 shadow-inner">
        <div className="relative flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black text-metallic-500 uppercase tracking-[0.4em] block mb-1">Matrix Intelligence</span>
            <p className="text-white font-black text-xl italic uppercase tracking-tighter">
              {getPreview()}
            </p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-metallic-400">
            <Trophy size={24} />
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={disabled || teams.length < 2}
        className="w-full bg-white text-metallic-950 px-8 py-5 rounded-2xl hover:bg-metallic-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 active:translate-y-0 transition-all font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3"
      >
        Compile Engagement Matrix <ChevronRight size={20} />
      </button>
    </div>
  );
};
