import { create } from 'zustand';
import type { Tournament, Team, BracketFormat, User } from '../types';
import { generateBracket, updateMatchResult } from '../utils/bracketGenerator';

interface TournamentStore {
  tournament: Tournament | null;
  tournaments: Tournament[];
  user: User | null;

  // Auth
  login: (username: string, password: string) => void;
  logout: () => void;

  // Tournament CRUD
  createTournament: (name: string, organizer: string, description: string) => void;
  loadTournament: (tournament: Tournament) => void;
  resetTournament: () => void;
  saveTournament: () => void;
  fetchTournaments: () => void;
  deleteTournament: (id: string) => void;

  // Bracket
  generateBracket: (format: BracketFormat, bracketName: string) => void;
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  updateTeam: (team: Team) => void;
  updateMatchResult: (matchId: string, score1: number, score2: number) => void;
}

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  tournament: null,
  tournaments: [],
  user: (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })(),

  /* ── Auth ─────────────────────────────────────────────── */
  login: (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      const user: User = { username, role: 'admin' };
      set({ user });
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      alert('Invalid credentials. Try admin / admin123');
    }
  },

  logout: () => {
    set({ user: null, tournament: null });
    localStorage.removeItem('user');
  },

  /* ── Tournament CRUD ───────────────────────────────────── */
  createTournament: (name, organizer, description) => {
    const now = Date.now();
    const tournament: Tournament = {
      id: `tournament-${now}`,
      name,
      organizer,
      description,
      bracket: {
        id: `bracket-${now}`,
        name: 'Bracket 1',
        format: 'single-elimination',
        teams: [],
        rounds: [],
        status: 'planning',
        createdAt: now,
        updatedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    };
    set({ tournament });
  },

  loadTournament: (tournament) => set({ tournament }),

  resetTournament: () => set({ tournament: null }),

  fetchTournaments: () => {
    try {
      const saved = localStorage.getItem('tournaments');
      if (saved) set({ tournaments: JSON.parse(saved) });
    } catch { /* ignore */ }
  },

  saveTournament: () => {
    const { tournament, tournaments } = get();
    if (!tournament) return;

    const idx = tournaments.findIndex(t => t.id === tournament.id);
    const updated = idx >= 0
      ? tournaments.map(t => t.id === tournament.id ? tournament : t)
      : [...tournaments, tournament];

    set({ tournaments: updated });
    localStorage.setItem('tournaments', JSON.stringify(updated));
  },

  deleteTournament: (id) => {
    const { tournaments, tournament } = get();
    const updated = tournaments.filter(t => t.id !== id);
    set({
      tournaments: updated,
      tournament: tournament?.id === id ? null : tournament,
    });
    localStorage.setItem('tournaments', JSON.stringify(updated));
  },

  /* ── Bracket ───────────────────────────────────────────── */
  generateBracket: (format, bracketName) => {
    const { tournament } = get();
    if (!tournament) return;
    const newBracket = generateBracket(format, tournament.bracket.teams, bracketName);
    set({ tournament: { ...tournament, bracket: newBracket, updatedAt: Date.now() } });
  },

  addTeam: (team) => {
    const { tournament } = get();
    if (!tournament) return;
    set({
      tournament: {
        ...tournament,
        bracket: { ...tournament.bracket, teams: [...tournament.bracket.teams, team] },
        updatedAt: Date.now(),
      },
    });
  },

  removeTeam: (teamId) => {
    const { tournament } = get();
    if (!tournament) return;
    set({
      tournament: {
        ...tournament,
        bracket: { ...tournament.bracket, teams: tournament.bracket.teams.filter(t => t.id !== teamId) },
        updatedAt: Date.now(),
      },
    });
  },

  updateTeam: (team) => {
    const { tournament } = get();
    if (!tournament) return;
    set({
      tournament: {
        ...tournament,
        bracket: { ...tournament.bracket, teams: tournament.bracket.teams.map(t => t.id === team.id ? team : t) },
        updatedAt: Date.now(),
      },
    });
  },

  updateMatchResult: (matchId, score1, score2) => {
    const { tournament } = get();
    if (!tournament) return;
    const updatedBracket = updateMatchResult(tournament.bracket, matchId, score1, score2);
    set({ tournament: { ...tournament, bracket: updatedBracket, updatedAt: Date.now() } });
  },
}));
