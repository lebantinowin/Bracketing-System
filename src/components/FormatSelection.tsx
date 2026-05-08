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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Tournament Format</h2>
      <p className="text-gray-600 mb-6">Choose a bracket format for your tournament</p>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Bracket Name</label>
        <input
          type="text"
          value={bracketName}
          onChange={(e) => setBracketName(e.target.value)}
          placeholder="Name your tournament"
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => setSelectedFormat(format.id)}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedFormat === format.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed text-left`}
          >
            <div className="text-3xl mb-2">{format.icon}</div>
            <h3 className="font-bold text-gray-800">{format.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{format.description}</p>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <p className="text-sm text-gray-700">
          <strong>Bracket Preview:</strong> {getPreview()}
        </p>
      </div>

      {teams.length < 2 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-yellow-800">
          <p className="text-sm">⚠️ Add at least 2 teams before generating a bracket</p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={disabled || teams.length < 2}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
      >
        Generate Bracket <ChevronRight size={20} />
      </button>
    </div>
  );
};
