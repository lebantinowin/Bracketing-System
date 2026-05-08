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
    <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-600 uppercase">Match {match.matchNumber + 1}</span>
        {hasWinner && <CheckCircle className="text-green-500" size={18} />}
      </div>

      {!isEditing && !editMode ? (
        <>
          <div className="mb-4">
            <div className={`p-3 rounded-lg mb-2 flex items-center justify-between ${
              hasWinner && match.winner?.id === match.team1?.id
                ? 'bg-green-100 border border-green-300'
                : 'bg-white border border-gray-200'
            }`}>
              <span className={`font-semibold ${
                hasWinner && match.winner?.id === match.team1?.id
                  ? 'text-green-800'
                  : 'text-gray-800'
              }`}>
                {team1Name}
              </span>
              <span className="text-xl font-bold text-gray-800">{score1}</span>
            </div>

            {!isBye && (
              <div className={`p-3 rounded-lg flex items-center justify-between ${
                hasWinner && match.winner?.id === match.team2?.id
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-white border border-gray-200'
              }`}>
                <span className={`font-semibold ${
                  hasWinner && match.winner?.id === match.team2?.id
                    ? 'text-green-800'
                    : 'text-gray-800'
                }`}>
                  {team2Name}
                </span>
                <span className="text-xl font-bold text-gray-800">{score2}</span>
              </div>
            )}
          </div>

          {editMode && onUpdate && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              Enter Score
            </button>
          )}
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">{team1Name}</label>
            <input
              type="number"
              value={score1}
              onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
              min="0"
              autoFocus
            />
          </div>

          {!isBye && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">{team2Name}</label>
              <input
                type="number"
                value={score2}
                onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                min="0"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 font-medium text-sm"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setScore1(match.score1 || 0);
                setScore2(match.score2 || 0);
              }}
              className="flex-1 bg-gray-300 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-400 font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};
