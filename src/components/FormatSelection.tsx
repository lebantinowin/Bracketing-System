import React, { useState } from 'react';
import type { BracketFormat, Team } from '../types';
import { generateSingleElimination, generateDoubleElimination, generateRoundRobin } from '../utils/bracketGenerator';
import { ChevronRight, Target, RefreshCw, Repeat } from 'lucide-react';

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
      name: 'Single Elimination',
      description: "One loss and you're eliminated.",
      icon: <Target size={22} />,
    },
    {
      id: 'double-elimination',
      name: 'Double Elimination',
      description: 'Two losses required for elimination.',
      icon: <RefreshCw size={22} />,
    },
    {
      id: 'round-robin',
      name: 'Round Robin',
      description: 'Every team plays every other team.',
      icon: <Repeat size={22} />,
    },
  ];

  const getPreview = () => {
    if (teams.length === 0) return 'Add teams to calculate';
    let rounds: { matches: unknown[] }[] = [];
    switch (selectedFormat) {
      case 'single-elimination': rounds = generateSingleElimination(teams, 'PREVIEW'); break;
      case 'double-elimination': rounds = generateDoubleElimination(teams, 'PREVIEW'); break;
      case 'round-robin':        rounds = generateRoundRobin(teams, 'PREVIEW'); break;
    }
    const totalMatches = rounds.reduce((s, r) => s + r.matches.length, 0);
    return `${rounds.length} rounds · ${totalMatches} matches`;
  };

  const handleGenerate = () => {
    if (teams.length < 2) { alert('Minimum 2 teams required'); return; }
    onFormatSelected(selectedFormat, bracketName);
  };

  return (
    <div className="card">

      {/* Header */}
      <div className="mb-6">
        <h2 className="heading text-xl">Tournament Format</h2>
        <p className="text-sm text-metallic-500 mt-1">Select the bracket structure</p>
      </div>

      {/* Bracket name */}
      <div className="mb-6">
        <label className="label-xs mb-1.5 block">Bracket Name</label>
        <input
          type="text"
          value={bracketName}
          onChange={(e) => setBracketName(e.target.value)}
          placeholder="e.g., Main Event"
          disabled={disabled}
          className="input-base disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Format cards */}
      <div className="flex flex-col gap-3 mb-6">
        {formats.map((f) => {
          const active = selectedFormat === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFormat(f.id)}
              disabled={disabled}
              className={`p-5 rounded-xl border-2 text-left flex flex-col gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                active
                  ? 'border-white bg-accent/10 shadow-sm'
                  : 'border-border bg-surface hover:border-secondary hover:bg-bg'
              }`}
            >
              <span className={active ? 'text-white' : 'text-secondary'}>{f.icon}</span>
              <div>
                <p className={`font-semibold text-sm ${active ? 'text-white' : 'text-secondary'}`}>{f.name}</p>
                <p className="text-xs text-secondary mt-0.5 leading-snug">{f.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Preview row */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg rounded-xl border border-border mb-6">
        <span className="label-xs">Preview</span>
        <span className="text-sm font-semibold text-primary">{getPreview()}</span>
      </div>

      {/* Generate */}
      <button
        onClick={handleGenerate}
        disabled={disabled || teams.length < 2}
        className="w-full metallic-accent text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        Generate Bracket <ChevronRight size={16} />
      </button>
    </div>
  );
};
