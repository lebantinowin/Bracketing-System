import React from 'react';
import type { Bracket } from '../types';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  bracket: Bracket;
  mode: 'schedule' | 'results';
}

export const MatchListDisplay: React.FC<Props> = ({ bracket, mode }) => {
  const isSchedule = mode === 'schedule';

  const roundsWithMatches = bracket.rounds.map(round => {
    const filteredMatches = round.matches.filter(m => 
      isSchedule ? !m.winner : !!m.winner
    );
    return { ...round, matches: filteredMatches };
  }).filter(r => r.matches.length > 0);

  if (roundsWithMatches.length === 0) {
    return (
      <div className="card p-16 text-center">
        {isSchedule ? (
          <CheckCircle2 size={40} className="mx-auto mb-4 text-secondary opacity-50" />
        ) : (
          <Clock size={40} className="mx-auto mb-4 text-secondary opacity-50" />
        )}
        <p className="text-base font-bold text-primary">
          {isSchedule ? 'No Upcoming Matches' : 'No Completed Matches'}
        </p>
        <p className="text-sm text-secondary mt-2">
          {isSchedule ? 'All matches are completed or not yet scheduled.' : 'No match results have been recorded yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {roundsWithMatches.map((round) => (
        <div key={round.number} className="card p-6">
          <h3 className="heading text-lg mb-4 flex items-center gap-2">
            <span className="badge badge-dark">{round.label}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {round.matches.map((match) => (
              <div key={match.id} className="border border-border bg-base rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-secondary uppercase tracking-wider">{match.id}</span>
                  {match.status === 'completed' ? (
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">FINAL</span>
                  ) : (
                    <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">PENDING</span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className={`flex items-center justify-between ${match.winner?.id === match.team1?.id ? 'font-bold text-primary' : 'text-secondary'}`}>
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div className="w-5 h-5 rounded-sm bg-surface flex items-center justify-center shrink-0 text-[10px]">
                        {match.team1?.name.substring(0, 2).toUpperCase() || '?'}
                      </div>
                      <span className="truncate text-sm">{match.team1?.name || 'TBD'}</span>
                    </div>
                    {match.score1 !== undefined && <span className="font-mono text-sm">{match.score1}</span>}
                  </div>
                  
                  <div className={`flex items-center justify-between ${match.winner?.id === match.team2?.id ? 'font-bold text-primary' : 'text-secondary'}`}>
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div className="w-5 h-5 rounded-sm bg-surface flex items-center justify-center shrink-0 text-[10px]">
                        {match.team2?.name.substring(0, 2).toUpperCase() || '?'}
                      </div>
                      <span className="truncate text-sm">{match.team2?.name || 'TBD'}</span>
                    </div>
                    {match.score2 !== undefined && <span className="font-mono text-sm">{match.score2}</span>}
                  </div>
                </div>

                {match.upset && (
                  <div className="mt-1 pt-2 border-t border-border flex items-center gap-1.5 text-orange-500 text-[10px] font-bold uppercase tracking-wider">
                    <AlertCircle size={12} /> Upset Alert
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
