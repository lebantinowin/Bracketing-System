import React, { useState } from 'react';
import type { Match } from '../types';
import { CheckCircle, Edit3, X } from 'lucide-react';

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
  const [score1, setScore1] = useState(match.score1 ?? 0);
  const [score2, setScore2] = useState(match.score2 ?? 0);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    if (onUpdate) {
      onUpdate(score1, score2);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setScore1(match.score1 ?? 0);
    setScore2(match.score2 ?? 0);
  };

  const team1Name = match.team1?.name || 'TBD';
  const team2Name = match.team2?.name || 'BYE';
  const isBye = !match.team2;
  const hasWinner = !!match.winner;
  const team1Wins = hasWinner && match.winner?.id === match.team1?.id;
  const team2Wins = hasWinner && match.winner?.id === match.team2?.id;

  if (compact) {
    return (
      <div className="bg-white border border-metallic-200 rounded-xl p-3 text-xs">
        <div className={`flex items-center justify-between py-1 px-2 rounded-lg mb-1 ${team1Wins ? 'bg-metallic-950 text-white' : 'bg-metallic-50 text-metallic-700'}`}>
          <span className="font-bold truncate">{team1Name}</span>
          {editMode && onUpdate ? (
            <input type="number" value={score1} onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
              className="w-8 text-center bg-transparent border-b border-current font-mono font-bold outline-none" min="0" />
          ) : (
            <span className="font-mono font-bold ml-2">{score1}</span>
          )}
        </div>
        <div className={`flex items-center justify-between py-1 px-2 rounded-lg ${team2Wins ? 'bg-metallic-950 text-white' : 'bg-metallic-50 text-metallic-700'}`}>
          <span className={`font-bold truncate ${isBye ? 'opacity-40' : ''}`}>{team2Name}</span>
          {editMode && onUpdate && !isBye ? (
            <input type="number" value={score2} onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
              className="w-8 text-center bg-transparent border-b border-current font-mono font-bold outline-none" min="0" />
          ) : (
            <span className="font-mono font-bold ml-2">{score2}</span>
          )}
        </div>
        {editMode && onUpdate && !isBye && (
          <button onClick={handleSubmit} className="mt-2 w-full text-[10px] font-black uppercase tracking-widest py-1 bg-metallic-950 text-white rounded-lg">
            Confirm
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative bg-white border rounded-2xl overflow-hidden transition-all ${hasWinner ? 'border-metallic-300' : 'border-metallic-200 hover:border-metallic-400 hover:shadow-lg hover:shadow-metallic-950/5'}`}>
      {/* Match header */}
      <div className="flex items-center justify-between px-4 py-2 bg-metallic-50/50 border-b border-metallic-100">
        <span className="text-[10px] font-black uppercase tracking-widest text-metallic-400">Match {match.matchNumber + 1}</span>
        <div className="flex items-center gap-2">
          {hasWinner && <CheckCircle size={14} className="text-metallic-950" />}
          {editMode && onUpdate && !isEditing && !isBye && (
            <button onClick={() => setIsEditing(true)} className="p-1 text-metallic-400 hover:text-metallic-950 rounded transition-colors">
              <Edit3 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Teams */}
      {!isEditing ? (
        <div className="p-3 space-y-2">
          {/* Team 1 */}
          <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
            team1Wins ? 'bg-metallic-950 border-metallic-950 text-white' : 'bg-metallic-50 border-metallic-100 text-metallic-700'
          }`}>
            <span className="font-bold text-sm truncate">{team1Name}</span>
            <span className="font-mono font-black text-base ml-2">{match.score1 ?? 0}</span>
          </div>
          {/* Divider */}
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 h-px bg-metallic-100" />
            <span className="text-[10px] font-black text-metallic-300 uppercase">vs</span>
            <div className="flex-1 h-px bg-metallic-100" />
          </div>
          {/* Team 2 */}
          <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
            isBye ? 'bg-metallic-50 border-dashed border-metallic-200 opacity-40' :
            team2Wins ? 'bg-metallic-950 border-metallic-950 text-white' : 'bg-metallic-50 border-metallic-100 text-metallic-700'
          }`}>
            <span className="font-bold text-sm truncate">{team2Name}</span>
            {!isBye && <span className="font-mono font-black text-base ml-2">{match.score2 ?? 0}</span>}
          </div>

          {editMode && onUpdate && !isBye && !isEditing && (
            <button onClick={() => setIsEditing(true)}
              className="w-full mt-1 py-2 text-[10px] font-black uppercase tracking-widest text-metallic-500 hover:text-metallic-950 bg-metallic-50 hover:bg-metallic-100 border border-metallic-200 rounded-xl transition-all">
              Enter Score
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <label className="label-xs">{team1Name}</label>
            <input type="number" value={score1} onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
              className="input-base text-2xl font-black text-center" min="0" autoFocus />
          </div>
          {!isBye && (
            <div className="space-y-1">
              <label className="label-xs">{team2Name}</label>
              <input type="number" value={score2} onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                className="input-base text-2xl font-black text-center" min="0" />
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button onClick={handleSubmit} className="flex-1 metallic-accent py-2.5 rounded-xl font-black text-sm">
              Confirm
            </button>
            <button onClick={handleCancel} className="p-2.5 border border-metallic-200 text-metallic-500 rounded-xl hover:bg-metallic-50">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
