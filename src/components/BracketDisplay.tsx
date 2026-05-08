import React from 'react';
import type { Bracket } from '../types';
import { MatchCard } from './MatchCard';
import { Trophy, RefreshCw } from 'lucide-react';

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
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No bracket data available
      </div>
    );
  }

  const isSingleElimination = bracket.format === 'single-elimination';
  const isRoundRobin = bracket.format === 'round-robin';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-48 -mt-48 opacity-20 blur-3xl"></div>
      
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            {bracket.name}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              Format: <span className="text-blue-600">{bracket.format.replace('-', ' ')}</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              Teams: <span className="text-blue-600">{bracket.teams.length}</span>
            </span>
            <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border shadow-sm ${
              bracket.status === 'completed' 
                ? 'bg-green-50 text-green-600 border-green-100' 
                : 'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              Status: <span>{bracket.status}</span>
            </span>
          </div>
        </div>

        {editMode && (
          <div className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest animate-pulse shadow-lg shadow-green-500/20">
            Edit Mode Active
          </div>
        )}
      </div>

      <div className="relative">
        {isSingleElimination || isRoundRobin ? (
          <div className="space-y-12 overflow-x-auto pb-4 custom-scrollbar">
            {bracket.rounds.map((round) => (
              <div key={round.number} className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black">
                    {round.number}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    {isRoundRobin ? `Round ${round.number}` : `Round ${round.number}`}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy size={20} />
                </div>
                <h3 className="text-2xl font-black text-green-700 uppercase tracking-tight">Winners Bracket</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-green-100 to-transparent"></div>
              </div>
              
              <div className="space-y-10">
                {bracket.rounds
                  .filter((r) => r.matches.some((m) => m.id.includes('winners')))
                  .map((round) => (
                    <div key={round.number}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-widest">Round {round.number}</span>
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

            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <RefreshCw size={20} />
                </div>
                <h3 className="text-2xl font-black text-orange-700 uppercase tracking-tight">Losers Bracket</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-100 to-transparent"></div>
              </div>
              
              <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-orange-200">
                  <RefreshCw size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-800">Lower Bracket Loading</h4>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Losers from the winners bracket will automatically drop here once scores are entered.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
