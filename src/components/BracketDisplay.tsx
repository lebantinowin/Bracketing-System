import React from 'react';
import type { Bracket } from '../types';
import { MatchCard } from './MatchCard';
import { Trophy, RefreshCw } from 'lucide-react';

interface BracketDisplayProps {
  bracket: Bracket;
  onMatchUpdate?: (matchId: string, score1: number, score2: number) => void;
  editMode?: boolean;
}

export const BracketDisplay: React.FC<BracketDisplayProps> = ({ bracket, onMatchUpdate, editMode = false }) => {
  if (bracket.rounds.length === 0) {
    return (
      <div className="card p-12 text-center text-metallic-500 text-sm">
        No bracket data available.
      </div>
    );
  }

  const isSingleElim = bracket.format === 'single-elimination';
  const isRoundRobin  = bracket.format === 'round-robin';

  const matchUpdater = (matchId: string) =>
    editMode && onMatchUpdate
      ? (s1: number, s2: number) => onMatchUpdate(matchId, s1, s2)
      : undefined;

  return (
    <div className="card">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-metallic-300">
        <div>
          <h2 className="heading text-2xl">{bracket.name}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="badge">{bracket.format.replace(/-/g, ' ')}</span>
            <span className="badge">{bracket.teams.length} teams</span>
            <span className={`badge ${bracket.status === 'completed' ? 'badge-dark' : ''}`}>
              {bracket.status}
            </span>
          </div>
        </div>
        {editMode && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-metallic-900 text-white rounded-lg">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span className="label-xs text-white">Edit Mode</span>
          </div>
        )}
      </div>

      {/* Content */}
      {isSingleElim || isRoundRobin ? (
        <div className="space-y-10 overflow-x-auto pb-2 custom-scrollbar">
          {bracket.rounds.map((round) => (
            <div key={round.number} className="min-w-[280px]">
              <div className="flex items-center gap-3 mb-4">
                <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-metallic-200 border border-metallic-300 text-xs font-bold text-metallic-800">
                  {round.number}
                </span>
                <span className="text-sm font-bold text-metallic-800 uppercase tracking-wide">Round {round.number}</span>
                <span className="divider" />
              </div>
              <div className={`grid gap-3 ${
                isRoundRobin
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {round.matches.map((match) => (
                  <MatchCard key={match.id} match={match} onUpdate={matchUpdater(match.id)} editMode={editMode} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Double elimination */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* Winners */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 metallic-accent rounded-lg flex items-center justify-center">
                <Trophy size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-metallic-900 uppercase tracking-wide">Winners Bracket</span>
              <span className="divider" />
            </div>
            <div className="space-y-8">
              {bracket.rounds
                .filter((r) => r.matches.some((m) => m.id.includes('winners')))
                .map((round) => (
                  <div key={round.number}>
                    <p className="label-xs mb-3">Round {round.number}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {round.matches
                        .filter((m) => m.id.includes('winners'))
                        .map((match) => (
                          <MatchCard key={match.id} match={match} onUpdate={matchUpdater(match.id)} editMode={editMode} compact />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Losers */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 bg-metallic-400 rounded-lg flex items-center justify-center">
                <RefreshCw size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-metallic-700 uppercase tracking-wide">Losers Bracket</span>
              <span className="divider" />
            </div>
            <div className="border border-dashed border-metallic-300 rounded-xl p-10 text-center bg-bg">
              <div className="w-10 h-10 bg-surface border border-metallic-300 rounded-xl flex items-center justify-center mx-auto mb-3 text-metallic-400">
                <RefreshCw size={20} />
              </div>
              <p className="text-sm font-bold text-metallic-700">Awaiting Results</p>
              <p className="text-xs text-metallic-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Matches will appear here as teams drop from the winners bracket.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
