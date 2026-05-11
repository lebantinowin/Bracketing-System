import React from 'react';
import type { Match } from '../types';
import { Trophy, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onUpdate?: (score1: number, score2: number) => void;
  editMode?: boolean;
  compact?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onUpdate, editMode = true, compact = false }) => {
  const isCompleted = !!match.winner;
  const winnerId = match.winner?.id;

  const handleScoreChange = (teamNum: 1 | 2, value: string) => {
    if (!onUpdate) return;
    const score = parseInt(value) || 0;
    if (teamNum === 1) onUpdate(score, match.score2 || 0);
    else               onUpdate(match.score1 || 0, score);
  };

  const rowClass = (teamId?: string) => {
    if (!isCompleted || !teamId) return 'text-secondary';
    return teamId === winnerId ? 'text-primary font-semibold' : 'text-secondary/50 line-through';
  };

  const cardClass = () => {
    if (isCompleted) return 'border-border bg-bg';
    if (match.team1 && match.team2) return 'border-border bg-surface shadow-sm hover:border-secondary';
    return 'border-dashed border-border bg-transparent opacity-50';
  };

  const rows = [
    { num: 1 as const, team: match.team1, score: match.score1 },
    { num: 2 as const, team: match.team2, score: match.score2 },
  ];

  return (
    <div className={`rounded-xl border transition-all ${cardClass()} ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="label-xs text-metallic-400">#{match.id.split('-').pop()}</span>
        {isCompleted && match.timestamp && (
          <div className="flex items-center gap-1 text-metallic-400">
            <Clock size={10} />
            <span className="text-[10px] font-medium">
              {new Date(match.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {rows.map(({ num, team, score }) => {
          const isWinner = isCompleted && team?.id === winnerId;
          return (
            <div key={num} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={`shrink-0 w-1 h-4 rounded-full ${isWinner ? 'bg-accent' : 'bg-border'}`} />
                <span className={`text-sm truncate ${rowClass(team?.id)}`}>{team?.name || 'TBD'}</span>
                {isWinner && <Trophy size={11} className="text-accent shrink-0" />}
              </div>
              {editMode ? (
                <input
                  type="number"
                  value={score ?? ''}
                  onChange={(e) => handleScoreChange(num, e.target.value)}
                  className="w-11 px-1.5 py-1 bg-bg border border-border rounded-lg text-primary font-bold text-center focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                  placeholder="0"
                />
              ) : (
                <span className={`text-sm font-bold tabular-nums ${isWinner ? 'text-primary' : 'text-secondary/50'}`}>
                  {score ?? '–'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
