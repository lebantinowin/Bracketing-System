import React, { useState, useEffect } from 'react';
import { Settings, Save, Trash2, ExternalLink } from 'lucide-react';
import { useTournamentStore } from '../store/tournamentStore';
import type { Tournament } from '../types';

interface Props {
  onNavigate: () => void;
}

export const WelcomeDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [tournamentName, setTournamentName] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [description, setDescription] = useState('');
  const [gameType, setGameType] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('16');

  const { tournaments, createTournament, loadTournament, deleteTournament, fetchTournaments } = useTournamentStore();

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (tournamentName.trim() && organizerName.trim()) {
      createTournament({
        name: tournamentName,
        organizer: organizerName,
        description,
        gameType: gameType || 'General',
        eventDate: new Date().toISOString().split('T')[0],
        venue: venue || 'TBD',
        capacity: parseInt(capacity, 10) || 16
      });
      onNavigate();
    }
  };

  const handleLoadTournament = (t: Tournament) => {
    loadTournament(t);
    onNavigate();
  };

  const handleDeleteTournament = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this tournament? This cannot be undone.')) deleteTournament(id);
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-6">
      {/* New tournament form */}
      <div className="flex-1 card">
        <h2 className="heading text-lg flex items-center gap-2 mb-6">
          <Settings size={18} className="text-metallic-500" /> New Tournament
        </h2>
        <form onSubmit={handleCreateTournament} className="space-y-4">
          <div className="space-y-1.5">
            <label className="label-xs">Tournament Name</label>
            <input type="text" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} placeholder="e.g., Summer Cup 2026" className="input-base" autoFocus required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-xs">Game / Sport Type</label>
              <input type="text" value={gameType} onChange={(e) => setGameType(e.target.value)} placeholder="e.g. Valorant" className="input-base" required />
            </div>
            <div className="space-y-1.5">
              <label className="label-xs">Organizer</label>
              <input type="text" value={organizerName} onChange={(e) => setOrganizerName(e.target.value)} placeholder="Your Name" className="input-base" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1">
              <label className="label-xs">Capacity</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="16" className="input-base" required />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="label-xs">Venue / Platform</label>
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Online / LAN Location" className="input-base" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="label-xs">Description <span className="font-normal normal-case tracking-normal text-metallic-400">(optional)</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional details…" className="input-base resize-none" rows={2} />
          </div>
          <button type="submit" className="w-full metallic-accent font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 active:scale-[.99] transition-all mt-2">
            Create Tournament
          </button>
        </form>
      </div>

      {/* Recent tournaments */}
      <div className="flex-1 card flex flex-col">
        <h2 className="heading text-lg flex items-center gap-2 mb-6">
          <Save size={18} className="text-metallic-500" /> Recent Tournaments
        </h2>

        {tournaments.length > 0 ? (
          <div className="space-y-2.5 overflow-y-auto custom-scrollbar flex-1 pr-1">
            {tournaments.slice().reverse().map((t) => (
              <div
                key={t.id}
                onClick={() => handleLoadTournament(t)}
                className="group flex items-center justify-between gap-3 px-4 py-3 bg-bg rounded-xl border border-metallic-300 hover:border-metallic-500 cursor-pointer transition-all"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-metallic-900 truncate group-hover:text-metallic-700 transition-colors">
                    {t.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge">{t.bracket.format.replace('-', ' ')}</span>
                    <span className="text-xs text-metallic-400">
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <button
                    onClick={(e) => handleDeleteTournament(e, t.id)}
                    className="p-1.5 text-metallic-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                  <span className="p-1.5 text-metallic-400">
                    <ExternalLink size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <Save size={32} className="text-metallic-300 mb-3" />
            <p className="text-sm font-semibold text-metallic-600">No saved tournaments</p>
            <p className="text-xs text-metallic-400 mt-1">Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};
