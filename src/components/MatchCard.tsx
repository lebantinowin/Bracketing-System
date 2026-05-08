import React, { useState } from 'react';
import type { Match } from '../types';
import { CheckCircle } from 'lucide-react';

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
  const [score1, setScore1] = useState(match.score1 || 0);
  const [score2, setScore2] = useState(match.score2 || 0);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    if (onUpdate) {
      onUpdate(score1, score2);
      setIsEditing(false);
    }
  };

  const team1Name = match.team1?.name || 'TBD';
  const team2Name = match.team2?.name || 'BYE';
  const isBye = !match.team2;
  const hasWinner = match.winner !== undefined;

  if (compact) {
    return (
      <div className="p-3 bg-gray-50 rounded border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className={hasWinner && match.winner?.id === match.team1?.id ? 'font-bold text-green-700' : 'text-gray-700'}>
            {team1Name}
          </span>
          {editMode && onUpdate ? (
            <input
              type="number"
              value={score1}
              onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
              className="w-8 px-1 py-0 border border-gray-300 rounded text-center text-xs"
              min="0"
            />
          ) : (
            <span className="font-semibold">{score1}</span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className={hasWinner && match.winner?.id === match.team2?.id ? 'font-bold text-green-700' : 'text-gray-700'}>
            {team2Name}
          </span>
          {editMode && onUpdate ? (
            <input
              type="number"
              value={score2}
              onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
              className="w-8 px-1 py-0 border border-gray-300 rounded text-center text-xs"
              min="0"
            />
          ) : (
            <span className="font-semibold">{score2}</span>
          )}
        </div>
        {editMode && onUpdate && isEditing && (
          <button
            onClick={handleSubmit}
            className="mt-2 w-full text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Save
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
      hasWinner 
        ? 'bg-white border-green-200 shadow-sm' 
        : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Round {match.roundNumber + 1}</span>
          <span className="text-xs font-bold text-slate-600 uppercase">Match {match.matchNumber + 1}</span>
        </div>
        {hasWinner ? (
          <div className="bg-green-500 text-white p-1 rounded-full animate-bounce">
            <CheckCircle size={14} />
          </div>
        ) : (
          match.timestamp && (
            <span className="text-[10px] text-slate-400 font-medium">
              {new Date(match.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )
        )}
      </div>

      {!isEditing && !editMode ? (
        <>
          <div className="space-y-2 mb-3">
            <div className={`group relative p-3 rounded-xl transition-all ${
              hasWinner && match.winner?.id === match.team1?.id
                ? 'bg-green-50 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                : 'bg-white border-2 border-slate-100'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold truncate pr-2 ${
                  hasWinner && match.winner?.id === match.team1?.id ? 'text-green-700' : 'text-slate-700'
                }`}>
                  {team1Name}
                </span>
                <span className={`text-lg font-black ${
                  hasWinner && match.winner?.id === match.team1?.id ? 'text-green-600' : 'text-slate-900'
                }`}>{score1}</span>
              </div>
            </div>

            {!isBye && (
              <div className={`group relative p-3 rounded-xl transition-all ${
                hasWinner && match.winner?.id === match.team2?.id
                  ? 'bg-green-50 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                  : 'bg-white border-2 border-slate-100'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold truncate pr-2 ${
                    hasWinner && match.winner?.id === match.team2?.id ? 'text-green-700' : 'text-slate-700'
                  }`}>
                    {team2Name}
                  </span>
                  <span className={`text-lg font-black ${
                    hasWinner && match.winner?.id === match.team2?.id ? 'text-green-600' : 'text-slate-900'
                  }`}>{score2}</span>
                </div>
              </div>
            )}
          </div>

          {editMode && onUpdate && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-all font-bold text-xs uppercase tracking-widest shadow-lg"
            >
              Enter Score
            </button>
          )}
        </>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-tighter">{team1Name}</label>
              <input
                type="number"
                value={score1}
                onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-xl font-black text-slate-800"
                min="0"
                autoFocus
              />
            </div>

            {!isBye && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1 tracking-tighter">{team2Name}</label>
                <input
                  type="number"
                  value={score2}
                  onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-xl font-black text-slate-800"
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-all font-bold text-xs uppercase tracking-widest shadow-lg"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setScore1(match.score1 || 0);
                setScore2(match.score2 || 0);
              }}
              className="flex-1 bg-slate-100 text-slate-500 px-4 py-3 rounded-xl hover:bg-slate-200 transition-all font-bold text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};
