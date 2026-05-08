export type BracketFormat = 'single-elimination' | 'double-elimination' | 'round-robin';

export interface Team {
  id: string;
  name: string;
  seed?: number;
  logo?: string;
}

export interface Match {
  id: string;
  roundNumber: number;
  matchNumber: number;
  team1?: Team;
  team2?: Team;
  score1?: number;
  score2?: number;
  winner?: Team;
  timestamp?: number;
  notes?: string;
}

export interface Round {
  number: number;
  matches: Match[];
}

export interface Bracket {
  id: string;
  name: string;
  format: BracketFormat;
  teams: Team[];
  rounds: Round[];
  status: 'planning' | 'in-progress' | 'completed';
  createdAt: number;
  updatedAt: number;
}

export interface Tournament {
  id: string;
  name: string;
  organizer: string;
  description: string;
  bracket: Bracket;
  createdAt: number;
  updatedAt: number;
}
