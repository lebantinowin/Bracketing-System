export type BracketFormat = 'single-elimination' | 'double-elimination' | 'round-robin' | 'group-knockout' | 'swiss';

export type TournamentStatus = 'Draft' | 'Registration Open' | 'Registration Closed' | 'Ongoing' | 'Completed';

export interface Team {
  id: string;
  name: string;
  captain?: string;
  contact?: string;
  roster?: string[];
  notes?: string;
  seed?: number;
  logo?: string;
  status?: 'active' | 'withdrawn' | 'dq';
}

export interface Match {
  id: string; // e.g. NXL3-QF-01
  roundNumber: number;
  matchNumber: number;
  team1?: Team;
  team2?: Team;
  score1?: number;
  score2?: number;
  winner?: Team;
  bestOf?: number;
  forfeit?: 'team1' | 'team2' | 'both';
  upset?: boolean;
  status?: 'pending' | 'ongoing' | 'completed';
  timestamp?: number;
  notes?: string;
}

export interface Round {
  number: number;
  label: string; // e.g. "Quarterfinals", "Round 1"
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

export interface AuditAction {
  id: string;
  timestamp: number;
  type: 'CREATE' | 'IMPORT' | 'EDIT' | 'GENERATE' | 'RESULT' | 'ROLLBACK' | 'EXPORT' | 'STATUS_CHANGE';
  description: string;
  matchId?: string;
  details?: Record<string, unknown>;
}

export interface Tournament {
  id: string;
  code: string; // e.g. NXL3
  name: string;
  gameType: string;
  eventDate: string;
  venue: string;
  capacity: number;
  organizer: string;
  description: string;
  status: TournamentStatus;
  bracket: Bracket;
  auditLog: AuditAction[];
  isDeleted?: boolean;
  deletedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  username: string;
  role: 'admin' | 'judge';
}
