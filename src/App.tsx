import React, { useState, useEffect } from 'react';
import { useTournamentStore } from './store/tournamentStore';
import { TeamManagement } from './components/TeamManagement';
import { FormatSelection } from './components/FormatSelection';
import { BracketDisplay } from './components/BracketDisplay';
import { ExportOptions } from './components/ExportOptions';
import { MatchListDisplay } from './components/MatchListDisplay';
import { Login } from './components/Login';
import { WelcomeDashboard } from './components/WelcomeDashboard';
import { User as UserIcon, Trophy, LayoutDashboard, Users, GitMerge, Calendar, FileText, Download, ShieldAlert, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import type { BracketFormat } from './types';

function App() {
  const [view, setView] = useState<'welcome' | 'overview' | 'teams' | 'bracket' | 'schedule' | 'results' | 'export' | 'audit'>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode] = useState(false);

  const {
    tournament, user, logout,
    generateBracket,
    addTeam, addTeams, removeTeam, updateTeam,
    updateMatchResult, resetTournament,
    fetchTournaments,
  } = useTournamentStore();

  useEffect(() => {
    if (user) {
      fetchTournaments();
    }
  }, [user, fetchTournaments]);

  const handleGenerateBracket = (format: BracketFormat, bracketName: string) => {
    generateBracket(format, bracketName);
    setView('bracket');
  };

  const handleReset = () => {
    resetTournament();
    setView('welcome');
  };



  /* ── Auth gate ─────────────────────────────────────────── */
  if (!user) return <Login />;



  /* ── Progress helper ───────────────────────────────────── */
  const totalMatches     = tournament?.bracket.rounds.reduce((a, r) => a + r.matches.filter(m => m.team1 && m.team2).length, 0) || 0;
  const completedMatches = tournament?.bracket.rounds.reduce((a, r) => a + r.matches.filter(m => m.winner).length, 0) || 0;
  const progressPct      = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;

  /* ── Main app shell (Sidebar Layout) ────────────────────── */
  
  type ViewId = 'welcome' | 'overview' | 'teams' | 'bracket' | 'schedule' | 'results' | 'export' | 'audit';

  const menuGroups: { group: string; items: { id: ViewId; icon: React.ElementType; label: string; count?: number }[] }[] = [
    {
      group: 'General',
      items: [
        { id: 'welcome', icon: LayoutDashboard, label: 'Dashboard' }
      ]
    }
  ];

  if (tournament) {
    menuGroups.push({
      group: 'Events',
      items: [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'teams', icon: Users, label: 'Teams', count: tournament.bracket.teams.length },
        { id: 'bracket', icon: GitMerge, label: 'Bracket' },
        { id: 'schedule', icon: Calendar, label: 'Schedule' },
        { id: 'results', icon: Activity, label: 'Results' },
        { id: 'export', icon: Download, label: 'Export' }
      ]
    });
    menuGroups.push({
      group: 'System',
      items: [
        { id: 'audit', icon: FileText, label: 'Audit Log' }
      ]
    });
  }

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
                <p className="text-sm font-bold truncate text-primary leading-tight">{tournament?.name || 'Nexus System'}</p>
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
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {sidebarOpen && group.group !== 'General' && (
                <p className="px-3 mb-2 text-[10px] font-bold text-secondary uppercase tracking-widest">{group.group}</p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = view === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'welcome') {
                          resetTournament();
                          setView('welcome');
                        } else {
                          setView(item.id);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        active ? 'bg-surface border border-border text-primary shadow-sm' : 
                        'text-secondary hover:text-primary hover:bg-surface/50 border border-transparent'
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
              </div>
            </div>
          ))}
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
            {tournament && (
              <>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <span className="badge hidden sm:inline-flex">{tournament.bracket.format.replace('-', ' ')}</span>
              </>
            )}
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
              <button onClick={handleReset} className="p-2 text-secondary hover:text-primary hover:bg-surface rounded-lg transition-all" title="Return to Dashboard">
                <LayoutDashboard size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-bg">
          <div className="fade-up max-w-7xl mx-auto space-y-6">

            {view === 'welcome' && (
              <WelcomeDashboard onNavigate={(v: 'overview' | 'bracket') => setView(v)} />
            )}

            {view === 'overview' && tournament && (
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

            {view === 'teams' && tournament && (
              <TeamManagement teams={tournament.bracket.teams} onAddTeam={addTeam} onAddTeams={addTeams} onRemoveTeam={removeTeam} onUpdateTeam={updateTeam} />
            )}

            {view === 'bracket' && tournament && tournament.bracket.rounds.length > 0 && (
              <BracketDisplay bracket={tournament.bracket} onMatchUpdate={updateMatchResult} editMode={editMode} />
            )}

            {view === 'export' && tournament && tournament.bracket.rounds.length > 0 && (
              <ExportOptions bracket={tournament.bracket} />
            )}

            {(view === 'bracket' || view === 'export' || view === 'schedule' || view === 'results') && tournament && tournament.bracket.rounds.length === 0 && (
              <div className="card p-16 text-center">
                <ShieldAlert size={40} className="mx-auto mb-4 text-secondary opacity-50" />
                <p className="text-base font-bold text-primary">No Bracket Generated</p>
                <p className="text-sm text-secondary mt-2">Go to Overview to generate a bracket format first.</p>
              </div>
            )}

            {view === 'schedule' && tournament && tournament.bracket.rounds.length > 0 && (
              <MatchListDisplay bracket={tournament.bracket} mode="schedule" />
            )}

            {view === 'results' && tournament && tournament.bracket.rounds.length > 0 && (
              <MatchListDisplay bracket={tournament.bracket} mode="results" />
            )}

            {view === 'audit' && tournament && (
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
