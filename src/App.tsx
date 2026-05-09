import React, { useState } from 'react';
import { useTournamentStore } from './store/tournamentStore';
import { TeamManagement } from './components/TeamManagement';
import { FormatSelection } from './components/FormatSelection';
import { BracketDisplay } from './components/BracketDisplay';
import { ExportOptions } from './components/ExportOptions';
import { Login } from './components/Login';
import { Settings, Home, Save, User as UserIcon, LogOut, Trash2, ExternalLink, Trophy, LayoutDashboard, Users, GitMerge, Calendar, FileText, Download, ShieldAlert, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import type { BracketFormat, Tournament } from './types';

function App() {
  const [view, setView] = useState<'welcome' | 'overview' | 'teams' | 'bracket' | 'schedule' | 'results' | 'export' | 'audit'>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tournamentName, setTournamentName] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [description, setDescription] = useState('');
  const [gameType, setGameType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('16');
  const [editMode, setEditMode] = useState(false);

  const {
    tournament, tournaments, user, logout,
    createTournament, generateBracket,
    addTeam, removeTeam, updateTeam,
    updateMatchResult, saveTournament, resetTournament,
    loadTournament: loadExistingTournament, deleteTournament,
  } = useTournamentStore();

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (tournamentName.trim() && organizerName.trim()) {
      createTournament({
        name: tournamentName,
        organizer: organizerName,
        description,
        gameType: gameType || 'General',
        eventDate: eventDate || new Date().toISOString().split('T')[0],
        venue: venue || 'TBD',
        capacity: parseInt(capacity, 10) || 16
      });
      setView('overview');
    }
  };

  const handleGenerateBracket = (format: BracketFormat, name: string) => {
    generateBracket(format, name);
    setView('bracket');
  };

  const handleSave = () => {
    saveTournament();
    alert('Tournament saved!');
  };

  const handleReset = () => {
    if (window.confirm('Return to welcome screen? Unsaved changes will be lost.')) {
      resetTournament();
      setView('welcome');
      setTournamentName('');
      setOrganizerName('');
      setDescription('');
      setGameType('');
      setEventDate('');
      setVenue('');
      setCapacity('16');
    }
  };

  const handleLoadTournament = (t: Tournament) => {
    loadExistingTournament(t);
    setView('bracket');
  };

  const handleDeleteTournament = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this tournament? This cannot be undone.')) deleteTournament(id);
  };

  /* ── Auth gate ─────────────────────────────────────────── */
  if (!user) return <Login />;

  /* ── Welcome screen ────────────────────────────────────── */
  if (!tournament && view === 'welcome') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 gap-8">

        {/* Page header */}
        <div className="w-full max-w-4xl flex items-end justify-between">
          <div>
            <h1 className="heading text-3xl flex items-center gap-2.5">
              <Trophy size={28} className="text-metallic-600" />
              Nexus<span className="text-metallic-500 font-medium">System</span>
            </h1>
            <p className="text-sm text-metallic-500 font-medium mt-1">Championship Management Interface</p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-metallic-600 hover:text-metallic-900 bg-surface border border-metallic-300 rounded-lg hover:bg-bg transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row w-full max-w-4xl gap-6">

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
      </div>
    );
  }

  if (!tournament) return null;

  /* ── Progress helper ───────────────────────────────────── */
  const totalMatches     = tournament.bracket.rounds.reduce((a, r) => a + r.matches.filter(m => m.team1 && m.team2).length, 0);
  const completedMatches = tournament.bracket.rounds.reduce((a, r) => a + r.matches.filter(m => m.winner).length, 0);
  const progressPct      = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;

  /* ── Main app shell (Sidebar Layout) ────────────────────── */
  
  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'teams', icon: Users, label: 'Teams', count: tournament.bracket.teams.length },
    { id: 'bracket', icon: GitMerge, label: 'Bracket' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'results', icon: Activity, label: 'Results' },
    { id: 'export', icon: Download, label: 'Export' },
    { id: 'audit', icon: FileText, label: 'Audit Log' }
  ] as const;

  return (
    <div className="flex h-screen bg-bg overflow-hidden text-primary">
      
      {/* Sidebar */}
      <aside className={`bg-sidebar border-r border-border flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} shrink-0 z-20`}>
        {/* Sidebar Header (Tournament Switcher stub) */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center shrink-0">
                <Trophy size={16} className="text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-primary leading-tight">{tournament.name}</p>
                <p className="text-[10px] text-secondary font-mono tracking-widest uppercase">Admin</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <Trophy size={20} className="text-secondary" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  active ? 'bg-surface border border-border text-primary shadow-sm' : 'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'
                } ${sidebarOpen ? 'justify-between' : 'justify-center'}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={active ? 'text-primary' : 'text-secondary'} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </div>
                {sidebarOpen && item.count !== undefined && (
                  <span className="badge badge-dark bg-surface border-border text-[10px] px-1.5 py-0.5">{item.count}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center border border-border shrink-0">
              <UserIcon size={14} className="text-secondary" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate text-primary">{user.username}</p>
                <button onClick={() => logout()} className="text-[10px] text-secondary hover:text-red-500 font-mono tracking-wide uppercase transition-colors">Logout</button>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors mx-auto">
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Stats Strip */}
        <header className="h-16 bg-bg border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-primary heading capitalize">{view.replace('-', ' ')}</h2>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="badge hidden sm:inline-flex">{tournament.bracket.format.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-right">
              <div className="hidden md:block">
                <p className="label-xs">Progress</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-accent" style={{ width: `${progressPct}%` }} />
                  </div>
                  <span className="text-xs font-mono text-primary">{progressPct}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={handleReset} className="p-2 text-secondary hover:text-primary hover:bg-surface rounded-lg transition-all" title="Return to Welcome">
                <Home size={16} />
              </button>
              <button onClick={handleSave} className="metallic-accent flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm">
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </header>

        {/* View content container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-bg">
          <div className="fade-up max-w-7xl mx-auto space-y-6">
            
            {view === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="card">
                      <p className="label-xs mb-1">Total Teams</p>
                      <p className="text-3xl font-mono text-primary">{tournament.bracket.teams.length} <span className="text-base text-secondary">/ {tournament.capacity}</span></p>
                   </div>
                   <div className="card">
                      <p className="label-xs mb-1">Format</p>
                      <p className="text-lg font-bold text-primary capitalize mt-2">{tournament.bracket.format.replace('-', ' ')}</p>
                   </div>
                   <div className="card">
                      <p className="label-xs mb-1">Matches</p>
                      <p className="text-3xl font-mono text-primary">{completedMatches} <span className="text-base text-secondary">/ {totalMatches}</span></p>
                   </div>
                   <div className="card">
                      <p className="label-xs mb-1">Status</p>
                      <span className="badge badge-dark mt-2">{tournament.status}</span>
                   </div>
                </div>

                <div className="card bg-surface/50 border border-border/50">
                  <h3 className="text-sm font-bold text-primary mb-4">Event Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="label-xs mb-1 text-secondary">Game / Sport</p>
                      <p className="text-sm font-medium">{tournament.gameType}</p>
                    </div>
                    <div>
                      <p className="label-xs mb-1 text-secondary">Date</p>
                      <p className="text-sm font-medium">{tournament.eventDate}</p>
                    </div>
                    <div>
                      <p className="label-xs mb-1 text-secondary">Venue</p>
                      <p className="text-sm font-medium">{tournament.venue}</p>
                    </div>
                    <div>
                      <p className="label-xs mb-1 text-secondary">Organizer</p>
                      <p className="text-sm font-medium">{tournament.organizer}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <FormatSelection teams={tournament.bracket.teams} onFormatSelected={handleGenerateBracket} disabled={tournament.bracket.teams.length < 2} />
                </div>
              </div>
            )}

            {view === 'teams' && (
              <TeamManagement teams={tournament.bracket.teams} onAddTeam={addTeam} onRemoveTeam={removeTeam} onUpdateTeam={updateTeam} />
            )}

            {view === 'bracket' && tournament.bracket.rounds.length > 0 && (
              <BracketDisplay bracket={tournament.bracket} onMatchUpdate={updateMatchResult} editMode={editMode} />
            )}

            {view === 'export' && tournament.bracket.rounds.length > 0 && (
              <ExportOptions bracket={tournament.bracket} />
            )}

            {(view === 'bracket' || view === 'export' || view === 'schedule' || view === 'results') && tournament.bracket.rounds.length === 0 && (
              <div className="card p-16 text-center">
                <ShieldAlert size={40} className="mx-auto mb-4 text-secondary opacity-50" />
                <p className="text-base font-bold text-primary">No Bracket Generated</p>
                <p className="text-sm text-secondary mt-2">Go to Overview to generate a bracket format first.</p>
              </div>
            )}

            {(view === 'schedule' || view === 'results') && (
              <div className="card p-16 text-center">
                <Settings size={40} className="mx-auto mb-4 text-secondary opacity-50 animate-spin-slow" style={{ animationDuration: '4s' }} />
                <p className="text-base font-bold text-primary">Panel Under Construction</p>
                <p className="text-sm text-secondary mt-2">The {view} module is currently being implemented for the Admin engine.</p>
              </div>
            )}

            {view === 'audit' && (
              <div className="card p-6">
                <h3 className="heading text-lg mb-6">System Audit Log</h3>
                <div className="space-y-4">
                  {tournament.auditLog?.length > 0 ? (
                    tournament.auditLog.map((log) => (
                      <div key={log.id} className="flex gap-4 p-4 rounded-xl border border-border bg-base items-start">
                        <div className="shrink-0 mt-0.5">
                          <FileText size={16} className="text-secondary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <span className="badge badge-dark text-[10px] py-0">{log.type}</span>
                            <span className="text-[11px] font-mono text-secondary">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-primary">{log.description}</p>
                          {log.matchId && <p className="text-xs font-mono text-secondary mt-2">Match: {log.matchId}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-secondary text-center py-10">No actions recorded yet.</p>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
