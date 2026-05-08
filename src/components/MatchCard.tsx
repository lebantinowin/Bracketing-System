import React from 'react';
import type { Match } from '../types';
import { Trophy, Clock, Target } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onUpdate?: (score1: number, score2: number) => void;
  editMode?: boolean;
  compact?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onUpdate,
  editMode = false,
  compact = false,
}) => {
  const isCompleted = match.status === 'completed';
  const winnerId = match.winner;

  const handleScoreChange = (teamNum: 1 | 2, value: string) => {
    if (!onUpdate) return;
    const score = parseInt(value) || 0;
    if (teamNum === 1) {
      onUpdate(score, match.score2 || 0);
    } else {
      onUpdate(match.score1 || 0, score);
    }
  };

  const getTeamStatusClass = (teamId?: string) => {
    if (!isCompleted || !teamId) return 'text-metallic-300';
    return teamId === winnerId ? 'text-white font-black' : 'text-metallic-600 line-through opacity-50';
  };

  const getCardBorderClass = () => {
    if (isCompleted) return 'border-white/20 bg-metallic-800/40';
    if (match.team1 && match.team2) return 'border-metallic-400/30 bg-metallic-900/50';
    return 'border-white/5 bg-metallic-950/50 opacity-60';
  };

  return (
    <div className={`relative rounded-2xl border transition-all duration-500 overflow-hidden group ${getCardBorderClass()} ${
      !compact ? 'p-5' : 'p-3'
    }`}>
      {/* Background Glow for Winner */}
      {isCompleted && (
        <div className="absolute inset-0 bg-white/5 pointer-events-none transition-opacity group-hover:opacity-10"></div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Target size={14} className={isCompleted ? 'text-white' : 'text-metallic-700'} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-metallic-500">
            {match.id.includes('winners') ? 'PRIMARY' : match.id.includes('losers') ? 'SECONDARY' : 'ENGAGEMENT'}
          </span>
        </div>
        {isCompleted && match.completedAt && (
          <div className="flex items-center gap-1 text-metallic-600">
            <Clock size={10} />
            <span className="text-[8px] font-bold">
              {new Date(match.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Team 1 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-1.5 h-6 rounded-full transition-colors ${
              isCompleted && match.team1?.id === winnerId ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'bg-metallic-800'
            }`}></div>
            <span className={`text-sm truncate uppercase tracking-tight italic ${getTeamStatusClass(match.team1?.id)}`}>
              {match.team1?.name || 'TBD'}
            </span>
            {isCompleted && match.team1?.id === winnerId && (
              <Trophy size={14} className="text-white shrink-0 animate-in zoom-in duration-500" />
            )}
          </div>
          {editMode ? (
            <input
              type="number"
              value={match.score1 ?? ''}
              onChange={(e) => handleScoreChange(1, e.target.value)}
              className="w-14 px-2 py-1.5 bg-metallic-950 border border-white/10 rounded-lg text-white font-black text-center focus:outline-none focus:border-white transition-all shadow-inner"
              placeholder="0"
            />
          ) : (
            <span className={`text-lg font-black italic ${isCompleted && match.team1?.id === winnerId ? 'text-white' : 'text-metallic-400'}`}>
              {match.score1 ?? '-'}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 px-1">
          <div className="flex-1 h-px bg-white/5"></div>
          <span className="text-[8px] font-black text-metallic-800 uppercase tracking-widest">VS</span>
          <div className="flex-1 h-px bg-white/5"></div>
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-1.5 h-6 rounded-full transition-colors ${
              isCompleted && match.team2?.id === winnerId ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'bg-metallic-800'
            }`}></div>
            <span className={`text-sm truncate uppercase tracking-tight italic ${getTeamStatusClass(match.team2?.id)}`}>
              {match.team2?.name || 'TBD'}
            </span>
            {isCompleted && match.team2?.id === winnerId && (
              <Trophy size={14} className="text-white shrink-0 animate-in zoom-in duration-500" />
            )}
          </div>
          {editMode ? (
            <input
              type="number"
              value={match.score2 ?? ''}
              onChange={(e) => handleScoreChange(2, e.target.value)}
              className="w-14 px-2 py-1.5 bg-metallic-950 border border-white/10 rounded-lg text-white font-black text-center focus:outline-none focus:border-white transition-all shadow-inner"
              placeholder="0"
            />
          ) : (
            <span className={`text-lg font-black italic ${isCompleted && match.team2?.id === winnerId ? 'text-white' : 'text-metallic-400'}`}>
              {match.score2 ?? '-'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
