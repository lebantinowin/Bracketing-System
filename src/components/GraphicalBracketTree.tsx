import React from 'react';
import type { Round } from '../types';
import { MatchCard } from './MatchCard';

interface Props {
  rounds: Round[];
  matchUpdater: (matchId: string) => ((s1: number, s2: number) => void) | undefined;
  editMode: boolean;
}

export const GraphicalBracketTree: React.FC<Props> = ({ rounds, matchUpdater, editMode }) => {
  return (
    <div className="flex gap-12 overflow-x-auto p-4 custom-scrollbar items-stretch w-full min-h-[600px] bg-bg rounded-xl border border-border">
      {rounds.map((round, roundIndex) => {
        const isLast = roundIndex === rounds.length - 1;
        
        // Group matches into pairs
        const pairs = [];
        for (let i = 0; i < round.matches.length; i += 2) {
          pairs.push(round.matches.slice(i, i + 2));
        }

        return (
          <div key={round.number} className="flex flex-col flex-1 min-w-[300px]">
            <div className="text-center mb-6 shrink-0">
              <span className="badge badge-dark">
                {round.label || `Round ${round.number}`}
              </span>
            </div>
            
            <div className="flex flex-col flex-1 justify-around">
              {pairs.map((pair, pairIndex) => (
                <div key={pairIndex} className="flex flex-col flex-1 justify-around relative group">
                  
                  {/* Connecting Branches */}
                  {!isLast && pair.length === 2 && (
                    <>
                      <div className="absolute right-[-1.5rem] top-1/4 bottom-1/4 w-6 border-r-2 border-t-2 border-b-2 border-metallic-300 rounded-r-lg z-0 transition-colors duration-300 group-hover:border-primary/50" />
                      <div className="absolute right-[-3rem] top-1/2 w-[1.5rem] border-t-2 border-metallic-300 z-0 transition-colors duration-300 group-hover:border-primary/50" />
                      <div className="absolute right-[-3rem] top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 border-t-2 border-r-2 border-metallic-300 rotate-45 z-0 transition-colors duration-300 group-hover:border-primary/50" />
                    </>
                  )}

                  {/* Odd match handling (byes) */}
                  {!isLast && pair.length === 1 && (
                    <>
                      <div className="absolute right-[-3rem] top-1/2 w-[3rem] border-t-2 border-metallic-300 z-0 transition-colors duration-300 group-hover:border-primary/50" />
                      <div className="absolute right-[-3rem] top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 border-t-2 border-r-2 border-metallic-300 rotate-45 z-0 transition-colors duration-300 group-hover:border-primary/50" />
                    </>
                  )}

                  {pair.map((match) => (
                    <div key={match.id} className="relative z-10 w-full py-4 shrink-0">
                      <MatchCard match={match} onUpdate={matchUpdater(match.id)} editMode={editMode} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
