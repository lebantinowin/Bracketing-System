import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useTournamentStore } from '../store/tournamentStore';

interface Props {
  onNavigate: (view: 'overview' | 'bracket') => void;
}

export const WelcomeDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [tournamentName, setTournamentName] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [description, setDescription] = useState('');
  const [gameType, setGameType] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('16');

  const { createTournament } = useTournamentStore();

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
      onNavigate('overview');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      {/* New tournament form */}
      <div className="w-full max-w-2xl card">
        <h2 className="heading text-lg flex items-center gap-2 mb-6">
          <Settings size={18} className="text-accent" /> Create New Tournament
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
            <label className="label-xs">Description <span className="font-normal normal-case tracking-normal text-secondary">(optional)</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional details…" className="input-base resize-none" rows={3} />
          </div>
          <button type="submit" className="w-full btn-metallic font-semibold py-3 rounded-xl text-sm hover:opacity-90 active:scale-[.99] transition-all mt-4">
            Launch Tournament
          </button>
        </form>
      </div>
    </div>
  );
};
