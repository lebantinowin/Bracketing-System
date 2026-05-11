import React, { useState, useEffect } from 'react';
import { useTournamentStore } from './store/tournamentStore';
import { WelcomeDashboard } from './components/WelcomeDashboard';
import { TeamManagement } from './components/TeamManagement';
import { FormatSelection } from './components/FormatSelection';
import { BracketDisplay } from './components/BracketDisplay';
import { ExportOptions } from './components/ExportOptions';
import { Login } from './components/Login';
import { 
  Settings, Home, Save, User as UserIcon, LogOut, 
  Trophy, LayoutDashboard, Users, GitMerge, Calendar, 
  FileText, Download, ShieldAlert, ChevronLeft, ChevronRight, Activity 
} from 'lucide-react';
import type { BracketFormat } from './types';

function App() {
  const [view, setView] = useState<'welcome' | 'overview' | 'teams' | 'bracket' | 'schedule' | 'results' | 'export' | 'audit'>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const {
    tournament, tournaments, user, logout,
    fetchTournaments, generateBracket,
    addTeam, removeTeam, updateTeam,
    updateMatchResult, saveTournament, resetTournament
  } = useTournamentStore();

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

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
    }
  };

  if (!user) return <Login />;

  if (!tournament && view === 'welcome') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 gap-8">
        <div className="w-full max-w-5xl flex items-end justify-between">
          <div>
            <h1 className="heading text-3xl flex items-center gap-2.5">
              <Trophy size={28} className="text-metallic-600" />
              Nexus<span className="text-metallic-500 font-medium">System</span>
            </h1>
            <p className="text-sm text-metallic-500 font-medium mt-1">Championship Management Interface</p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-metallic-600 hover:text-metallic-900 bg-white border border-metallic-300 rounded-lg hover:bg-bg transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
        <WelcomeDashboard onNavigate={() => setView('overview')} />
      </div>
    );
  }

  if (!tournament) return null;

  const totalMatches = tournament.bracket.rounds.reduce((a, r) => a + r.matches.filter(m => m.team1 && m.team2).length, 0);
  const completedMatches = tournament.bracket.rounds.reduce((a, r) => a + r.matches.filter(m => m.winner).length, 0);
  const progressPct = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;

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
    <div className="flex h-screen bg-bg overflow-hidden text-metallic-900 font-sans">
      
      {/* Sidebar */}
      <aside className={`bg-white border-r border-metallic-200 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} shrink-0 z-20`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-metallic-200">
          {sidebarOpen ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded bg-metallic-50 border border-metallic-200 flex items-center justify-center shrink-0">
                <Trophy size={16} className="text-metallic-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-metallic-900 leading-tight">{tournament.name}</p>
                <p className="text-[10px] text-metallic-400 font-mono tracking-widest uppercase">Admin</p>
              </div>
            </div>
          ) : (
            <Trophy size={20} className="mx-auto text-metallic-600" />
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  active ? 'bg-metallic-50 border border-metallic-200 text-metallic-950 shadow-sm' : 'text-metallic-500 hover:text-metallic-950 hover:bg-metallic-50 border border-transparent'
                } ${sidebarOpen ? 'justify-between' : 'justify-center'}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={active ? 'text-metallic-950' : 'text-metallic-500'} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </div>
                {sidebarOpen && item.count !== undefined && (
                  <span className="badge">{item.count}</span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-metallic-200">
          <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-metallic-50 rounded-full flex items-center justify-center border border-metallic-200 shrink-0">
              <UserIcon size={14} className="text-metallic-500" />
            </div>
            {sidebarOpen && user && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate text-metallic-900">{user.username}</p>
                <button onClick={() => logout()} className="text-[10px] text-metallic-400 hover:text-red-500 font-mono tracking-wide uppercase transition-colors">Logout</button>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-metallic-500 hover:text-metallic-950 hover:bg-metallic-50 rounded-lg transition-colors mx-auto">
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-metallic-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-metallic-950 heading capitalize">{view.replace('-', ' ')}</h2>
            <div className="h-4 w-px bg-metallic-200 hidden sm:block" />
            <span className="badge hidden sm:inline-flex">{tournament.bracket.format.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-right">
              <div className="hidden md:block">
                <p className="label-xs">Progress</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-24 h-1.5 bg-metallic-50 rounded-full overflow-hidden border border-metallic-200">
                    <div className="h-full bg-metallic-950" style={{ width: `${progressPct}%` }} />
                  </div>
                  <span className="text-xs font-mono text-metallic-900">{progressPct}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={handleReset} className="p-2 text-metallic-500 hover:text-metallic-950 hover:bg-metallic-50 rounded-lg transition-all" title="Return to Welcome">
                <Home size={16} />
              </button>
              <button onClick={handleSave} className="metallic-accent flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm">
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-bg">
          <div className="max-w-7xl mx-auto space-y-6">
            {view === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="card">
                      <p className="label-xs mb-1">Total Teams</p>
                      <p className="text-3xl font-mono text-metallic-950">{tournament.bracket.teams.length} <span className="text-base text-metallic-400">/ {tournament.capacity}</span></p>
                   </div>
                   <div className="card">
                      <p className="label-xs mb-1">Format</p>
                      <p className="text-lg font-bold text-metallic-950 capitalize mt-2">{tournament.bracket.format.replace('-', ' ')}</p>
                   </div>
                   <div className="card">
                      <p className="label-xs mb-1">Matches</p>
                      <p className="text-3xl font-mono text-metallic-950">{completedMatches} <span className="text-base text-metallic-400">/ {totalMatches}</span></p>
                   </div>
                   <div className="card">
                      <p className="label-xs mb-1">Status</p>
                      <span className="badge mt-2">{tournament.status}</span>
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

            {view === 'bracket' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="heading text-xl">Tournament Bracket</h3>
                  <button 
                    onClick={() => setEditMode(!editMode)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${editMode ? 'bg-metallic-950 text-white' : 'bg-white text-metallic-600 border border-metallic-200'}`}
                  >
                    {editMode ? 'Score Mode Active' : 'Enter Scores'}
                  </button>
                </div>
                {tournament.bracket.rounds.length > 0 ? (
                  <BracketDisplay bracket={tournament.bracket} onMatchUpdate={updateMatchResult} editMode={editMode} />
                ) : (
                  <div className="card p-16 text-center">
                    <ShieldAlert size={40} className="mx-auto mb-4 text-metallic-300" />
                    <p className="text-base font-bold text-metallic-900">No Bracket Generated</p>
                    <p className="text-sm text-metallic-500 mt-2">Go to Overview to generate a bracket format first.</p>
                  </div>
                )}
              </div>
            )}

            {view === 'export' && tournament.bracket.rounds.length > 0 && (
              <ExportOptions bracket={tournament.bracket} />
            )}

            {(view === 'schedule' || view === 'results') && (
              <div className="card p-16 text-center">
                <Settings size={40} className="mx-auto mb-4 text-metallic-300 animate-spin-slow" />
                <p className="text-base font-bold text-metallic-900">Panel Under Construction</p>
                <p className="text-sm text-metallic-500 mt-2">The {view} module is currently being implemented for the Admin engine.</p>
              </div>
            )}

            {view === 'audit' && (
              <div className="card p-6">
                <h3 className="heading text-lg mb-6">System Audit Log</h3>
                <div className="space-y-4">
                  <p className="text-sm text-metallic-500 text-center py-10">No actions recorded yet.</p>
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
