import { create } from 'zustand';
import type { Tournament, Team, BracketFormat, User } from '../types';
import { generateBracket, updateMatchResult } from '../utils/bracketGenerator';

interface TournamentStore {
  tournament: Tournament | null;
  tournaments: Tournament[];
  user: User | null;

  // Actions
  login: (username: string, password: string) => void;
  logout: () => void;
  createTournament: (data: Partial<Tournament>) => void;
  generateBracket: (format: BracketFormat, bracketName: string) => void;
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  updateTeam: (team: Team) => void;
  updateMatchResult: (matchId: string, score1: number, score2: number) => void;
  saveTournament: () => Promise<void>;
  fetchTournaments: () => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
  loadTournament: (tournament: Tournament) => void;
  resetTournament: () => void;
}

const API_URL = 'http://localhost:3001/api';

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  tournament: null,
  tournaments: [],
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  login: (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      const user: User = { username, role: 'admin' };
      set({ user });
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      alert('INVALID ACCESS CREDENTIALS. SYSTEM LOCK ACTIVE.');
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem('user');
  },

  fetchTournaments: async () => {
    try {
      const response = await fetch(`${API_URL}/tournaments`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      set({ tournaments: data.map((t: any) => t.data || t) });
    } catch (error) {
      console.error('API Error:', error);
      const saved = localStorage.getItem('tournaments');
      if (saved) {
        set({ tournaments: JSON.parse(saved) });
      }
    }
  },

  createTournament: (data) => {
    const now = Date.now();
    const tournament: Tournament = {
      id: `tournament-${now}`,
      name: data.name || 'Untitled Tournament',
      organizer: data.organizer || 'Unknown',
      description: data.description || '',
      gameType: data.gameType,
      eventDate: data.eventDate,
      venue: data.venue,
      capacity: data.capacity,
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

  generateBracket: (format, bracketName) => {
    const { tournament } = get();
    if (!tournament) return;

    const newBracket = generateBracket(format, tournament.bracket.teams, bracketName);

    set({
      tournament: {
        ...tournament,
        bracket: newBracket,
        updatedAt: Date.now(),
      },
    });
  },

  addTeam: (team) => {
    const { tournament } = get();
    if (!tournament) return;

    const updatedTeams = [...tournament.bracket.teams, team];

    set({
      tournament: {
        ...tournament,
        bracket: {
          ...tournament.bracket,
          teams: updatedTeams,
        },
        updatedAt: Date.now(),
      },
    });
  },

  removeTeam: (teamId) => {
    const { tournament } = get();
    if (!tournament) return;

    const updatedTeams = tournament.bracket.teams.filter((t) => t.id !== teamId);

    set({
      tournament: {
        ...tournament,
        bracket: {
          ...tournament.bracket,
          teams: updatedTeams,
        },
        updatedAt: Date.now(),
      },
    });
  },

  updateTeam: (team) => {
    const { tournament } = get();
    if (!tournament) return;

    const updatedTeams = tournament.bracket.teams.map((t) =>
      t.id === team.id ? team : t
    );

    set({
      tournament: {
        ...tournament,
        bracket: {
          ...tournament.bracket,
          teams: updatedTeams,
        },
        updatedAt: Date.now(),
      },
    });
  },

  updateMatchResult: (matchId, score1, score2) => {
    const { tournament } = get();
    if (!tournament) return;

    const updatedBracket = updateMatchResult(tournament.bracket, matchId, score1, score2);

    set({
      tournament: {
        ...tournament,
        bracket: updatedBracket,
        updatedAt: Date.now(),
      },
    });
  },

  saveTournament: async () => {
    const { tournament, tournaments, fetchTournaments } = get();
    if (!tournament) return;

    const existingIndex = tournaments.findIndex((t) => t.id === tournament.id);
    let newTournaments: Tournament[];

    if (existingIndex >= 0) {
      newTournaments = tournaments.map((t) => (t.id === tournament.id ? tournament : t));
    } else {
      newTournaments = [...tournaments, tournament];
    }

    set({ tournaments: newTournaments });
    localStorage.setItem('tournaments', JSON.stringify(newTournaments));

    try {
      const payload = {
        ...tournament,
        code: tournament.id.slice(-8),
        gameType: tournament.bracket.format,
        status: tournament.bracket.status
      };

      await fetch(`${API_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      await fetchTournaments();
    } catch (error) {
      console.error('Failed to save to backend:', error);
    }
  },

  deleteTournament: async (id) => {
    const { tournaments, tournament } = get();
    const newTournaments = tournaments.filter((t) => t.id !== id);
    
    set({ 
      tournaments: newTournaments,
      tournament: tournament?.id === id ? null : tournament
    });
    
    localStorage.setItem('tournaments', JSON.stringify(newTournaments));

    try {
      await fetch(`${API_URL}/tournaments/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete from backend:', error);
    }
  },

  loadTournament: (tournament) => {
    set({ tournament });
  },

  resetTournament: () => {
    set({ tournament: null });
  },
}));
