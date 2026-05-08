import { create } from 'zustand';
import type { Tournament, Team, BracketFormat } from '../types';
import { generateBracket, updateMatchResult } from '../utils/bracketGenerator';

interface TournamentStore {
  tournament: Tournament | null;
  tournaments: Tournament[];

  // Actions
  createTournament: (name: string, organizer: string, description: string) => void;
  generateBracket: (format: BracketFormat, bracketName: string) => void;
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  updateTeam: (team: Team) => void;
  updateMatchResult: (matchId: string, score1: number, score2: number) => void;
  saveTournament: () => void;
  loadTournament: (tournament: Tournament) => void;
  resetTournament: () => void;
  deleteTournament: (tournamentId: string) => void;
}

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  tournament: null,
  tournaments: JSON.parse(localStorage.getItem('tournaments') || '[]'),

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

  saveTournament: () => {
    const { tournament, tournaments } = get();
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
  },

  loadTournament: (tournament) => {
    set({ tournament });
  },

  resetTournament: () => set({ tournament: null }),

  deleteTournament: (tournamentId) => {
    const { tournaments, tournament } = get();
    const newTournaments = tournaments.filter((t) => t.id !== tournamentId);
    
    set({ 
      tournaments: newTournaments,
      // If we're deleting the current tournament, reset it
      tournament: tournament?.id === tournamentId ? null : tournament
    });
    
    localStorage.setItem('tournaments', JSON.stringify(newTournaments));
  },
}));
