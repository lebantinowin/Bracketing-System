import React from 'react';
import type { Bracket } from '../types';
import { MatchCard } from './MatchCard';
import { Trophy, RefreshCw, Layers } from 'lucide-react';

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
      <div className="metallic-card rounded-3xl p-12 text-center text-metallic-500 border border-white/10">
        No matrix data available
      </div>
    );
  }

  const isSingleElimination = bracket.format === 'single-elimination';
  const isRoundRobin = bracket.format === 'round-robin';

  return (
    <div className="metallic-card rounded-3xl p-8 border border-white/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 opacity-10 blur-3xl"></div>
      
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3">
            <div className="w-2 h-10 bg-metallic-400 rounded-full"></div>
            {bracket.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-metallic-400 bg-metallic-900 px-3 py-1.5 rounded-lg border border-white/5">
              Protocol: <span className="text-white ml-1">{bracket.format.replace('-', ' ')}</span>
            </span>
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-metallic-400 bg-metallic-900 px-3 py-1.5 rounded-lg border border-white/5">
              Units: <span className="text-white ml-1">{bracket.teams.length}</span>
            </span>
            <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${
              bracket.status === 'completed' 
                ? 'bg-white text-metallic-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                : 'bg-metallic-800 text-metallic-200 border-white/10'
            }`}>
              Status: <span className="ml-1">{bracket.status}</span>
            </span>
          </div>
        </div>

        {editMode && (
          <div className="bg-metallic-100 text-metallic-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] animate-pulse shadow-xl shadow-white/5 border border-white/20">
            SYSTEM OVERRIDE ACTIVE
          </div>
        )}
      </div>

      <div className="relative">
        {isSingleElimination || isRoundRobin ? (
          <div className="space-y-16 overflow-x-auto pb-6 custom-scrollbar">
            {bracket.rounds.map((round) => (
              <div key={round.number} className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-white text-metallic-950 w-10 h-10 rounded-xl flex items-center justify-center font-black italic shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    {round.number}
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                    {isRoundRobin ? `Engagement Phase ${round.number}` : `Stage ${round.number}`}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>

                <div className={`grid gap-6 ${
                  isRoundRobin 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {round.matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onUpdate={
                        editMode && onMatchUpdate
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
          // Double elimination view
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-white text-metallic-950 w-10 h-10 rounded-xl flex items-center justify-center shadow-xl">
                  <Trophy size={20} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Primary Matrix</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
              
              <div className="space-y-12">
                {bracket.rounds
                  .filter((r) => r.matches.some((m) => m.id.includes('winners')))
                  .map((round) => (
                    <div key={round.number}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[9px] font-black text-metallic-500 bg-metallic-900 px-3 py-1 rounded border border-white/5 uppercase tracking-[0.3em]">STAGE {round.number}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {round.matches
                          .filter((m) => m.id.includes('winners'))
                          .map((match) => (
                            <MatchCard
                              key={match.id}
                              match={match}
                              onUpdate={
                                editMode && onMatchUpdate
                                  ? (score1, score2) => onMatchUpdate(match.id, score1, score2)
                                  : undefined
                              }
                              editMode={editMode}
                              compact
                            />
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-metallic-700 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-xl border border-white/10">
                  <Layers size={20} />
                </div>
                <h3 className="text-2xl font-black text-metallic-300 uppercase tracking-tighter italic">Secondary Matrix</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
              
              <div className="bg-metallic-900/30 rounded-3xl border-2 border-dashed border-white/5 p-16 text-center shadow-inner">
                <div className="w-16 h-16 bg-metallic-800/50 rounded-2xl border border-white/5 flex items-center justify-center mx-auto mb-6 text-metallic-600">
                  <RefreshCw size={32} />
                </div>
                <h4 className="text-lg font-black text-metallic-400 uppercase tracking-widest italic">Matrix Synchronization</h4>
                <p className="text-metallic-600 text-xs font-bold uppercase tracking-[0.2em] max-w-xs mx-auto mt-4 leading-relaxed">Lower bracket engagement profiles will initialize upon primary matrix data entry.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
