import React from 'react';
import type { Bracket } from '../types';
import { MatchCard } from './MatchCard';

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{bracket.name}</h2>
      <p className="text-sm text-gray-600 mb-6">
        Format: <span className="capitalize font-semibold">{bracket.format.replace('-', ' ')}</span> | Teams: {bracket.teams.length} | Status: <span className="capitalize">{bracket.status}</span>
      </p>

      {isSingleElimination || isRoundRobin ? (
        <div className="space-y-8 overflow-x-auto">
          {bracket.rounds.map((round) => (
            <div key={round.number}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {isRoundRobin ? `Round ${round.number}` : `Round ${round.number}`}
              </h3>

              <div className={`grid gap-4 ${
                isRoundRobin 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
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
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-4">Winners Bracket</h3>
            <div className="space-y-6">
              {bracket.rounds
                .filter((r) => r.matches.some((m) => m.id.includes('winners')))
                .map((round) => (
                  <div key={round.number}>
                    <h4 className="font-semibold text-gray-700 mb-2">Round {round.number}</h4>
                    <div className="space-y-2">
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

          <div>
            <h3 className="text-xl font-bold text-orange-700 mb-4">Losers Bracket</h3>
            <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
              Losers bracket matches will appear here
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
