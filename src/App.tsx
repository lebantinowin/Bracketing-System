import React, { useState, useEffect } from 'react';
import { useTournamentStore } from './store/tournamentStore';
import { TeamManagement } from './components/TeamManagement';
import { FormatSelection } from './components/FormatSelection';
import { BracketDisplay } from './components/BracketDisplay';
import { ExportOptions } from './components/ExportOptions';
import { Settings, Home, Save, Trash2, ExternalLink } from 'lucide-react';

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

  const tournaments = useTournamentStore((state) => state.tournaments);
  const loadTournament = useTournamentStore((state) => state.loadTournament);
  const deleteTournament = useTournamentStore((state) => state.deleteTournament);

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentName.trim() || !organizerName.trim()) {
      alert('Please fill in tournament name and organizer');
      return;
    }
    createTournament(tournamentName, organizerName, description);
    setView('setup');
  };

  const handleLoadTournament = (t: any) => {
    loadTournament(t);
    if (t.bracket.rounds.length > 0) {
      setView('bracket');
    } else {
      setView('setup');
    }
  };

  const handleDeleteTournament = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      deleteTournament(id);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex flex-col md:flex-row items-center justify-center p-4 gap-8">
        {/* Creation Form */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="relative text-center mb-8">
              <div className="inline-block bg-gradient-to-tr from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-lg mb-4">
                <Settings size={32} />
              </div>
              <h1 className="text-4xl font-black text-gray-800 tracking-tight">Nexus League</h1>
              <p className="text-gray-500 font-medium mt-1">Tournament Management System</p>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-4 relative">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Tournament Name</label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="e.g., Spring Championship 2026"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 font-medium"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Organizer Name</label>
                <input
                  type="text"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="Your name or organization"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details about your tournament..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 font-medium"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all text-lg"
              >
                Start New Tournament
              </button>
            </form>
          </div>
        </div>

        {/* Recent Tournaments */}
        {tournaments.length > 0 && (
          <div className="w-full max-w-md">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
                Recent Tournaments
              </h2>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {tournaments.slice().reverse().map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => handleLoadTournament(t)}
                    className="group bg-white bg-opacity-95 rounded-xl p-4 cursor-pointer hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{t.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                          {t.bracket.format.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(t.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleDeleteTournament(e, t.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Tournament"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all">
                        <ExternalLink size={18} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-blue-100 text-sm mt-6 text-center italic opacity-70">
                Your data is saved locally in this browser.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!tournament) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white bg-opacity-20">
          <div 
            className="h-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] transition-all duration-1000"
            style={{ 
              width: `${(() => {
                const totalMatches = tournament.bracket.rounds.reduce((acc, r) => acc + r.matches.filter(m => m.team1 && m.team2).length, 0);
                const completedMatches = tournament.bracket.rounds.reduce((acc, r) => acc + r.matches.filter(m => m.winner).length, 0);
                return totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;
              })()}%` 
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all hover:rotate-12"
                title="Home"
              >
                <Home size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight">{tournament.name}</h1>
                <p className="text-xs text-blue-100 font-medium uppercase tracking-widest opacity-80">Organizer: {tournament.organizer}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-sm font-bold">
                <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-lg border border-white border-opacity-10">
                  <span className="text-blue-100 opacity-70 mr-2">TEAMS:</span>
                  <span>{tournament.bracket.teams.length}</span>
                </div>
                <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-lg border border-white border-opacity-10">
                  <span className="text-blue-100 opacity-70 mr-2">PROGRESS:</span>
                  <span>
                    {(() => {
                      const totalMatches = tournament.bracket.rounds.reduce((acc, r) => acc + r.matches.filter(m => m.team1 && m.team2).length, 0);
                      const completedMatches = tournament.bracket.rounds.reduce((acc, r) => acc + r.matches.filter(m => m.winner).length, 0);
                      return Math.round(totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0);
                    })()}%
                  </span>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
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
