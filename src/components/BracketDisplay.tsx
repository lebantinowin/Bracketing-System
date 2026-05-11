import React from 'react';
import type { Bracket } from '../types';
import { MatchCard } from './MatchCard';
import { Trophy } from 'lucide-react';

interface BracketDisplayProps {
  bracket: Bracket;
  onMatchUpdate?: (matchId: string, score1: number, score2: number) => void;
  editMode?: boolean;
}

export const BracketDisplay: React.FC<BracketDisplayProps> = ({
  bracket,
  onMatchUpdate,
  editMode = false,
}) => {
  if (bracket.rounds.length === 0) {
    return (
      <div className="card p-12 text-center text-metallic-500">
        No bracket data available
      </div>
    );
  }

  const isSingleElim = bracket.format === 'single-elimination';
  const isRoundRobin = bracket.format === 'round-robin';

  return (
    <div className="card !p-0 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-metallic-200 bg-metallic-50/50 flex items-center justify-between">
        <div>
          <h2 className="heading text-lg">{bracket.name}</h2>
          <p className="text-[10px] text-metallic-500 font-mono tracking-widest uppercase mt-0.5">
            {bracket.format.replace(/-/g, ' ')} • {bracket.teams.length} Teams
          </p>
        </div>
        {editMode && (
          <div className="flex items-center gap-2 px-3 py-1 bg-metallic-950 text-white rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Edit</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {isSingleElim || isRoundRobin ? (
          <div className="flex gap-8 overflow-x-auto pb-4 custom-scrollbar">
            {bracket.rounds.map((round) => (
              <div key={round.number} className="flex-shrink-0 w-72">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 flex items-center justify-center rounded bg-metallic-950 text-white text-[10px] font-bold">
                    {round.number}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-metallic-900">Round {round.number}</span>
                  <div className="flex-1 h-px bg-metallic-200" />
                </div>
                <div className="space-y-4">
                  {round.matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onUpdate={
                        onMatchUpdate
                          ? (score1, score2) => onMatchUpdate(match.id, score1, score2)
                          : undefined
                      }
                      editMode={editMode}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Winners Bracket */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 metallic-accent rounded-lg flex items-center justify-center">
                  <Trophy size={16} className="text-white" />
                </div>
                <h3 className="heading text-md">Winners Bracket</h3>
                <div className="flex-1 h-px bg-metallic-200" />
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                {bracket.rounds
                  .filter((r) => r.matches.some((m) => m.id.includes('winners')))
                  .map((round) => (
                    <div key={round.number} className="flex-shrink-0 w-64">
                      <p className="label-xs mb-3 italic">Round {round.number}</p>
                      <div className="space-y-3">
                        {round.matches
                          .filter((m) => m.id.includes('winners'))
                          .map((match) => (
                            <MatchCard 
                              key={match.id} 
                              match={match} 
                              onUpdate={onMatchUpdate ? (s1, s2) => onMatchUpdate(match.id, s1, s2) : undefined} 
                              editMode={editMode} 
                              compact 
                            />
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Losers Bracket */}
            <div className="space-y-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-metallic-200 rounded-lg flex items-center justify-center">
                  <Trophy size={16} className="text-metallic-500" />
                </div>
                <h3 className="heading text-md text-metallic-500">Losers Bracket</h3>
                <div className="flex-1 h-px bg-metallic-200" />
              </div>
              <div className="p-8 border-2 border-dashed border-metallic-200 rounded-2xl flex flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-metallic-400">Under Construction</p>
                <p className="text-[10px] text-metallic-400 uppercase tracking-widest mt-1">Logic expansion pending</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
