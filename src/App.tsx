import React, { useState, useEffect } from 'react';
import { useTournamentStore } from './store/tournamentStore';
import { TeamManagement } from './components/TeamManagement';
import { FormatSelection } from './components/FormatSelection';
import { BracketDisplay } from './components/BracketDisplay';
import { ExportOptions } from './components/ExportOptions';
import { Login } from './components/Login';
import { Settings, Home, Save, Trash2, ExternalLink, LogOut, User as UserIcon } from 'lucide-react';

type View = 'welcome' | 'setup' | 'bracket' | 'export';

function App() {
  const [view, setView] = useState<View>('welcome');
  const [tournamentName, setTournamentName] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);

  const user = useTournamentStore((state) => state.user);
  const logout = useTournamentStore((state) => state.logout);
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

  if (!user) {
    return <Login />;
  }

  if (!tournament && view === 'welcome') {
    return (
      <div className="min-h-screen bg-metallic-950 flex flex-col md:flex-row items-center justify-center p-4 gap-8 brushed-metal">
        {/* Creation Form */}
        <div className="w-full max-w-md">
          <div className="metallic-card rounded-3xl p-8 overflow-hidden relative border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 opacity-20"></div>
            
            <button 
              onClick={() => logout()}
              className="absolute top-4 right-4 p-2 text-metallic-500 hover:text-white transition-colors z-10"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

            <div className="relative text-center mb-8">
              <div className="inline-block bg-gradient-to-tr from-metallic-700 to-metallic-500 text-white p-4 rounded-2xl shadow-xl mb-4 border border-white/20 shine-effect">
                <Settings size={32} />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Nexus<span className="text-metallic-400">System</span></h1>
              <p className="text-metallic-500 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Championship Controller</p>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-4 relative">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-metallic-400 uppercase tracking-widest ml-1">Tournament Designation</label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="e.g., IRON GAUNTLET 2026"
                  className="w-full px-4 py-4 bg-metallic-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-metallic-400 transition-all text-white font-bold placeholder-metallic-700 shadow-inner"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-metallic-400 uppercase tracking-widest ml-1">Lead Organizer</label>
                <input
                  type="text"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="COMMANDER NAME"
                  className="w-full px-4 py-4 bg-metallic-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-metallic-400 transition-all text-white font-bold placeholder-metallic-700 shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-metallic-400 uppercase tracking-widest ml-1">Briefing</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ADD MISSION DETAILS..."
                  className="w-full px-4 py-4 bg-metallic-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-metallic-400 transition-all text-white font-bold placeholder-metallic-700 shadow-inner"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-metallic-100 to-white text-metallic-950 font-black py-4 rounded-xl shadow-2xl hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm uppercase tracking-[0.2em]"
              >
                Initialize Operation
              </button>
            </form>
          </div>
        </div>

        {/* Recent Tournaments */}
        {tournaments.length > 0 && (
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3 italic uppercase tracking-tighter">
                <div className="w-1 h-6 bg-metallic-400 rounded-full"></div>
                Archives
              </h2>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {tournaments.slice().reverse().map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => handleLoadTournament(t)}
                    className="group bg-metallic-800/50 rounded-xl p-4 cursor-pointer hover:bg-metallic-700/50 transition-all hover:translate-x-1 border border-white/5 flex justify-between items-center shadow-lg"
                  >
                    <div>
                      <h3 className="font-bold text-metallic-200 group-hover:text-white transition-colors uppercase text-sm tracking-tight">{t.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-metallic-500 bg-metallic-900/50 px-2 py-0.5 rounded border border-white/5 uppercase tracking-tighter">
                          {t.bracket.format.replace('-', ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-metallic-600">
                          {new Date(t.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleDeleteTournament(e, t.id)}
                        className="p-2 text-metallic-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                        title="Purge"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="text-metallic-400 opacity-0 group-hover:opacity-100 transition-all">
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-metallic-600 text-[9px] mt-6 text-center font-black uppercase tracking-[0.3em] opacity-50">
                LOCAL STORAGE SECURED
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
    <div className="min-h-screen bg-metallic-950 text-metallic-200 brushed-metal">
      {/* Header */}
      <header className="bg-metallic-900 border-b border-white/10 sticky top-0 z-50 overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
          <div 
            className="h-full bg-metallic-400 shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000"
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
            <div className="flex items-center gap-6">
              <button
                onClick={handleReset}
                className="p-2.5 bg-metallic-800 text-metallic-300 hover:text-white hover:bg-metallic-700 rounded-xl transition-all border border-white/5"
                title="Return to Core"
              >
                <Home size={20} />
              </button>
              <div>
                <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">{tournament.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-metallic-500 font-black uppercase tracking-[0.2em] opacity-80">Sector: {tournament.organizer}</span>
                  <div className="w-1 h-1 bg-metallic-700 rounded-full"></div>
                  <span className="text-[10px] text-metallic-500 font-black uppercase tracking-[0.2em] opacity-80">{tournament.bracket.format.replace('-', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* User Profile */}
              <div className="hidden lg:flex items-center gap-4 pr-6 border-r border-white/10">
                <div className="w-10 h-10 bg-metallic-800 rounded-xl flex items-center justify-center border border-white/10 text-metallic-400">
                  <UserIcon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">{user.username}</span>
                  <span className="text-[9px] text-metallic-500 font-bold uppercase tracking-tighter leading-none opacity-70">{user.role}</span>
                </div>
                <button 
                  onClick={() => logout()}
                  className="ml-2 p-2 text-metallic-600 hover:text-red-400 transition-colors"
                  title="Shutdown Session"
                >
                  <LogOut size={16} />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-6 text-[10px] font-black tracking-widest uppercase">
                <div className="flex flex-col items-end">
                  <span className="text-metallic-600">Active Teams</span>
                  <span className="text-white text-lg leading-tight">{tournament.bracket.teams.length}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-metallic-600">Completion</span>
                  <span className="text-white text-lg leading-tight">
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
                className="flex items-center gap-2 bg-white text-metallic-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-metallic-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <Save size={16} /> Save Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setView('setup')}
            className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${
              view === 'setup'
                ? 'bg-white text-metallic-950 border-white shadow-xl'
                : 'bg-metallic-900/50 text-metallic-500 border-white/5 hover:border-white/20 hover:text-metallic-200'
            }`}
          >
            Config
          </button>

          {tournament.bracket.rounds.length > 0 && (
            <>
              <button
                onClick={() => {
                  setView('bracket');
                  setEditMode(false);
                }}
                className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${
                  view === 'bracket' && !editMode
                    ? 'bg-white text-metallic-950 border-white shadow-xl'
                    : 'bg-metallic-900/50 text-metallic-500 border-white/5 hover:border-white/20 hover:text-metallic-200'
                }`}
              >
                Tactical View
              </button>

              <button
                onClick={() => {
                  setView('bracket');
                  setEditMode(true);
                }}
                className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${
                  view === 'bracket' && editMode
                    ? 'bg-metallic-100 text-metallic-950 border-white shadow-xl'
                    : 'bg-metallic-900/50 text-metallic-500 border-white/5 hover:border-white/20 hover:text-metallic-200'
                }`}
              >
                Entry Mode
              </button>

              <button
                onClick={() => setView('export')}
                className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all border-2 ${
                  view === 'export'
                    ? 'bg-white text-metallic-950 border-white shadow-xl'
                    : 'bg-metallic-900/50 text-metallic-500 border-white/5 hover:border-white/20 hover:text-metallic-200'
                }`}
              >
                Data Export
              </button>
            </>
          )}
        </div>

        {/* View Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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

          {view === 'bracket' && tournament.bracket.rounds.length > 0 && (
            <BracketDisplay
              bracket={tournament.bracket}
              onMatchUpdate={updateMatchResult}
              editMode={editMode}
            />
          )}

          {view === 'export' && tournament.bracket.rounds.length > 0 && (
            <ExportOptions bracket={tournament.bracket} />
          )}

          {/* Empty State */}
          {view === 'bracket' && tournament.bracket.rounds.length === 0 && (
            <div className="metallic-card rounded-3xl p-20 text-center border-2 border-dashed border-white/10">
              <Trophy size={64} className="mx-auto mb-6 text-metallic-700" />
              <p className="text-metallic-400 text-lg font-black uppercase tracking-widest">Bracket Engine Offline</p>
              <p className="text-metallic-600 mt-2">Initialize configuration to generate tournament matrix</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
