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
  createTournament: (params: { name: string; organizer: string; description: string; gameType: string; eventDate: string; venue: string; capacity: number }) => void;
  generateBracket: (format: BracketFormat, bracketName: string) => void;
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  updateTeam: (team: Team) => void;
  updateMatchResult: (matchId: string, score1: number, score2: number) => void;
  saveTournament: () => Promise<void>;
  loadTournament: (tournament: Tournament) => void;
  resetTournament: () => void;
  deleteTournament: (tournamentId: string) => Promise<void>;
  fetchTournaments: () => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  tournament: null,
  tournaments: JSON.parse(localStorage.getItem('tournaments') || '[]'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  fetchTournaments: async () => {
    try {
      const response = await fetch(`${API_URL}/tournaments`);
      if (response.ok) {
        const data = await response.json();
        const loadedTournaments = data.map((t: any) => t.data);
        set({ tournaments: loadedTournaments });
      }
    } catch (error) {
      console.error('Failed to fetch tournaments', error);
    }
  },

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

  createTournament: (params) => {
    const now = Date.now();
    const code = params.name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 100);
    const tournament: Tournament = {
      id: `tournament-${now}`,
      code,
      name: params.name,
      organizer: params.organizer,
      description: params.description,
      gameType: params.gameType,
      eventDate: params.eventDate,
      venue: params.venue,
      capacity: params.capacity,
      status: 'Draft',
      auditLog: [{
        id: `audit-${now}`,
        timestamp: now,
        type: 'CREATE',
        description: `Tournament "${params.name}" created.`
      }],
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

    if (tournament.bracket.rounds.length > 0) {
      if (!window.confirm("This will overwrite the current bracket. Confirm?")) return;
    }

    const newBracket = generateBracket(format, tournament.bracket.teams, bracketName, tournament.code);

    set({
      tournament: {
        ...tournament,
        bracket: newBracket,
        updatedAt: Date.now(),
        auditLog: [{
          id: `audit-${Date.now()}`,
          timestamp: Date.now(),
          type: 'GENERATE',
          description: `Bracket generated with format: ${format}`
        }, ...tournament.auditLog]
      },
    });
  },

  addTeam: (team) => {
    const { tournament } = get();
    if (!tournament) return;

    if (tournament.bracket.teams.length >= tournament.capacity) {
      alert(`Cannot add team. Tournament is at full capacity (${tournament.capacity}).`);
      return;
    }

    const updatedTeams = [...tournament.bracket.teams, team];

    set({
      tournament: {
        ...tournament,
        bracket: {
          ...tournament.bracket,
          teams: updatedTeams,
        },
        updatedAt: Date.now(),
        auditLog: [{
          id: `audit-${Date.now()}`,
          timestamp: Date.now(),
          type: 'IMPORT',
          description: `Team added manually: ${team.name}`
        }, ...tournament.auditLog]
      },
    });
  },

  removeTeam: (teamId) => {
    const { tournament } = get();
    if (!tournament) return;

    const teamToRemove = tournament.bracket.teams.find((t) => t.id === teamId);
    const updatedTeams = tournament.bracket.teams.filter((t) => t.id !== teamId);

    set({
      tournament: {
        ...tournament,
        bracket: {
          ...tournament.bracket,
          teams: updatedTeams,
        },
        updatedAt: Date.now(),
        auditLog: [{
          id: `audit-${Date.now()}`,
          timestamp: Date.now(),
          type: 'EDIT',
          description: `Team removed: ${teamToRemove?.name}`
        }, ...tournament.auditLog]
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
        auditLog: [{
          id: `audit-${Date.now()}`,
          timestamp: Date.now(),
          type: 'RESULT',
          matchId,
          description: `Result entered for match ${matchId}: ${score1} - ${score2}`
        }, ...tournament.auditLog]
      },
    });
  },

  saveTournament: async () => {
    const { tournament, tournaments } = get();
    if (!tournament) return;

    try {
      const response = await fetch(`${API_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tournament)
      });
      
      if (response.ok) {
        const existingIndex = tournaments.findIndex((t) => t.id === tournament.id);
        let newTournaments: Tournament[];
        if (existingIndex >= 0) {
          newTournaments = tournaments.map((t) => (t.id === tournament.id ? tournament : t));
        } else {
          newTournaments = [...tournaments, tournament];
        }
        set({ tournaments: newTournaments });
      } else {
        throw new Error('Failed to save to backend');
      }
    } catch (error) {
      console.error('Backend save failed, falling back to localStorage', error);
      const existingIndex = tournaments.findIndex((t) => t.id === tournament.id);
      let newTournaments: Tournament[];
      if (existingIndex >= 0) {
        newTournaments = tournaments.map((t) => (t.id === tournament.id ? tournament : t));
      } else {
        newTournaments = [...tournaments, tournament];
      }
      set({ tournaments: newTournaments });
      localStorage.setItem('tournaments', JSON.stringify(newTournaments));
    }
  },

  loadTournament: (tournament) => {
    set({ tournament });
  },

  resetTournament: () => set({ tournament: null }),

  deleteTournament: async (tournamentId) => {
    const { tournaments, tournament } = get();
    
    try {
      await fetch(`${API_URL}/tournaments/${tournamentId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Backend delete failed, falling back to localStorage', error);
    }
    
    const newTournaments = tournaments.filter((t) => t.id !== tournamentId);
    
    set({ 
      tournaments: newTournaments,
      tournament: tournament?.id === tournamentId ? null : tournament
    });
    
    localStorage.setItem('tournaments', JSON.stringify(newTournaments));
  },
}));
