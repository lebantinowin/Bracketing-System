import React, { useState, useEffect } from 'react';
import { useTournamentStore } from './store/tournamentStore';
import { TeamManagement } from './components/TeamManagement';
import { FormatSelection } from './components/FormatSelection';
import { BracketDisplay } from './components/BracketDisplay';
import { ExportOptions } from './components/ExportOptions';
import { Settings, Home, Save } from 'lucide-react';

type View = 'welcome' | 'setup' | 'bracket' | 'export';

function App() {
  const [view, setView] = useState<View>('welcome');
  const [tournamentName, setTournamentName] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);

  const tournament = useTournamentStore((state) => state.tournament);
  const createTournament = useTournamentStore((state) => state.createTournament);
  const addTeam = useTournamentStore((state) => state.addTeam);
  const removeTeam = useTournamentStore((state) => state.removeTeam);
  const updateTeam = useTournamentStore((state) => state.updateTeam);
  const generateBracket = useTournamentStore((state) => state.generateBracket);
  const updateMatchResult = useTournamentStore((state) => state.updateMatchResult);
  const saveTournament = useTournamentStore((state) => state.saveTournament);
  const resetTournament = useTournamentStore((state) => state.resetTournament);

  useEffect(() => {
    // Load tournaments from localStorage
    const saved = localStorage.getItem('tournaments');
    if (saved) {
      try {
        // JSON.parse(saved); // Could be used to populate tournaments list
      } catch (e) {
        console.error('Failed to load tournaments:', e);
      }
    }
  }, []);

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentName.trim() || !organizerName.trim()) {
      alert('Please fill in tournament name and organizer');
      return;
    }
    createTournament(tournamentName, organizerName, description);
    setView('setup');
  };

  const handleGenerateBracket = (format: any, bracketName: string) => {
    generateBracket(format, bracketName);
    setView('bracket');
  };

  const handleSave = () => {
    saveTournament();
    alert('Tournament saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? Unsaved changes will be lost.')) {
      setTournamentName('');
      setOrganizerName('');
      setDescription('');
      resetTournament();
      setView('welcome');
      setEditMode(false);
    }
  };

  if (!tournament && view === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-600 text-white p-4 rounded-lg mb-4">
                <Settings size={32} />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Nexus League</h1>
              <p className="text-gray-600 mt-2">Tournament Bracket Manager</p>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tournament Name</label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="e.g., Spring Championship 2026"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organizer Name</label>
                <input
                  type="text"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="Your name or organization"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details about your tournament..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow"
              >
                Create Tournament
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Home"
              >
                <Home size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{tournament.name}</h1>
                <p className="text-sm text-blue-100">Organizer: {tournament.organizer}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex text-right text-sm">
                <div>
                  <p className="text-blue-100">Teams: {tournament.bracket.teams.length}</p>
                  <p className="text-blue-100">Status: <span className="capitalize">{tournament.bracket.status}</span></p>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setView('setup')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              view === 'setup'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
            }`}
          >
            Setup
          </button>

          {tournament.bracket.rounds.length > 0 && (
            <>
              <button
                onClick={() => {
                  setView('bracket');
                  setEditMode(false);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  view === 'bracket' && !editMode
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
                }`}
              >
                Bracket
              </button>

              <button
                onClick={() => {
                  setView('bracket');
                  setEditMode(true);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  view === 'bracket' && editMode
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-600'
                }`}
              >
                Enter Scores
              </button>

              <button
                onClick={() => setView('export')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  view === 'export'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
                }`}
              >
                Export
              </button>
            </>
          )}
        </div>

        {/* View: Setup */}
        {view === 'setup' && (
          <div className="space-y-8">
            <TeamManagement
              teams={tournament.bracket.teams}
              onAddTeam={addTeam}
              onRemoveTeam={removeTeam}
              onUpdateTeam={updateTeam}
            />

            <FormatSelection
              teams={tournament.bracket.teams}
              onFormatSelected={handleGenerateBracket}
              disabled={tournament.bracket.teams.length < 2}
            />
          </div>
        )}

        {/* View: Bracket */}
        {view === 'bracket' && tournament.bracket.rounds.length > 0 && (
          <BracketDisplay
            bracket={tournament.bracket}
            onMatchUpdate={updateMatchResult}
            editMode={editMode}
          />
        )}

        {/* View: Export */}
        {view === 'export' && tournament.bracket.rounds.length > 0 && (
          <ExportOptions bracket={tournament.bracket} />
        )}

        {/* Empty State */}
        {view === 'bracket' && tournament.bracket.rounds.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Generate a bracket to view tournament details</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
