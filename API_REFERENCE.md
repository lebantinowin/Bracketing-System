# API Reference - Nexus League Tournament System

## Type Definitions

### Tournament
```typescript
interface Tournament {
  id: string;
  name: string;
  organizer: string;
  description: string;
  bracket: Bracket;
  createdAt: number;
  updatedAt: number;
}
```

### Bracket
```typescript
interface Bracket {
  id: string;
  name: string;
  format: BracketFormat;
  teams: Team[];
  rounds: Round[];
  status: 'planning' | 'in-progress' | 'completed';
  createdAt: number;
  updatedAt: number;
}
```

### Team
```typescript
interface Team {
  id: string;
  name: string;
  seed?: number;
  logo?: string;
}
```

### Match
```typescript
interface Match {
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
```

### Round
```typescript
interface Round {
  number: number;
  matches: Match[];
}
```

### BracketFormat
```typescript
type BracketFormat = 'single-elimination' | 'double-elimination' | 'round-robin';
```

## Zustand Store API

### State
```typescript
tournament: Tournament | null;
tournaments: Tournament[];
```

### Actions

#### createTournament(name, organizer, description)
Creates a new tournament with an empty bracket.

**Parameters:**
- `name: string` - Tournament name
- `organizer: string` - Organizer name
- `description: string` - Tournament description

**Example:**
```typescript
createTournament('Spring Championship', 'John Doe', 'Regional qualifiers');
```

#### generateBracket(format, bracketName)
Generates bracket based on format and current teams.

**Parameters:**
- `format: BracketFormat` - 'single-elimination' | 'double-elimination' | 'round-robin'
- `bracketName: string` - Name for the bracket

**Example:**
```typescript
generateBracket('single-elimination', 'Main Bracket');
```

#### addTeam(team)
Adds a team to the bracket.

**Parameters:**
- `team: Team` - Team object with id, name, and optional seed

**Example:**
```typescript
addTeam({
  id: 'team-1',
  name: 'Team Alpha',
  seed: 1
});
```

#### removeTeam(teamId)
Removes a team from the bracket.

**Parameters:**
- `teamId: string` - Team ID to remove

**Example:**
```typescript
removeTeam('team-1');
```

#### updateTeam(team)
Updates an existing team's information.

**Parameters:**
- `team: Team` - Updated team object

**Example:**
```typescript
updateTeam({
  id: 'team-1',
  name: 'Team Beta',
  seed: 2
});
```

#### updateMatchResult(matchId, score1, score2)
Updates match scores and determines winner.

**Parameters:**
- `matchId: string` - Match ID
- `score1: number` - Team 1 score
- `score2: number` - Team 2 score

**Example:**
```typescript
updateMatchResult('match-1-0', 3, 1);
```

#### saveTournament()
Persists tournament to localStorage.

**Example:**
```typescript
saveTournament();
```

#### loadTournament(tournament)
Loads a tournament into the store.

**Parameters:**
- `tournament: Tournament` - Tournament to load

**Example:**
```typescript
loadTournament(savedTournament);
```

#### resetTournament()
Clears current tournament.

**Example:**
```typescript
resetTournament();
```

## Bracket Generator API

### generateSingleElimination(teams)
Generates single elimination bracket.

**Parameters:**
- `teams: Team[]` - Array of teams

**Returns:** `Round[]`

**Example:**
```typescript
const rounds = generateSingleElimination([
  { id: '1', name: 'Team A', seed: 1 },
  { id: '2', name: 'Team B', seed: 2 }
]);
```

### generateDoubleElimination(teams)
Generates double elimination bracket.

**Parameters:**
- `teams: Team[]` - Array of teams

**Returns:** `Round[]`

### generateRoundRobin(teams)
Generates round-robin schedule.

**Parameters:**
- `teams: Team[]` - Array of teams

**Returns:** `Round[]`

### generateBracket(format, teams, name)
Main bracket generation function.

**Parameters:**
- `format: BracketFormat` - Bracket format
- `teams: Team[]` - Array of teams
- `name: string` - Bracket name

**Returns:** `Bracket`

### updateMatchResult(bracket, matchId, score1, score2)
Updates match within bracket.

**Parameters:**
- `bracket: Bracket` - Current bracket
- `matchId: string` - Match ID
- `score1: number` - Team 1 score
- `score2: number` - Team 2 score

**Returns:** `Bracket` - Updated bracket

### advanceWinner(bracket, matchId)
Progresses winner to next round.

**Parameters:**
- `bracket: Bracket` - Current bracket
- `matchId: string` - Match ID

**Returns:** `Bracket` - Updated bracket

## Export API

### exportToJSON(bracket, filename?)
Exports bracket to JSON file.

**Parameters:**
- `bracket: Bracket` - Bracket to export
- `filename?: string` - Output filename (default: 'bracket.json')

**Example:**
```typescript
exportToJSON(tournament.bracket, 'my-tournament.json');
```

### exportToCSV(bracket, filename?)
Exports bracket to CSV file.

**Parameters:**
- `bracket: Bracket` - Bracket to export
- `filename?: string` - Output filename (default: 'bracket.csv')

**Example:**
```typescript
exportToCSV(tournament.bracket, 'results.csv');
```

### exportToPDF(bracket, filename?)
Exports bracket to PDF file.

**Parameters:**
- `bracket: Bracket` - Bracket to export
- `filename?: string` - Output filename (default: 'bracket.pdf')

**Example:**
```typescript
exportToPDF(tournament.bracket, 'bracket.pdf');
```

### exportToHTML(bracket, filename?)
Exports bracket to HTML file.

**Parameters:**
- `bracket: Bracket` - Bracket to export
- `filename?: string` - Output filename (default: 'bracket.html')

**Example:**
```typescript
exportToHTML(tournament.bracket, 'printable.html');
```

## Component Props

### BracketDisplay
```typescript
interface BracketDisplayProps {
  bracket: Bracket;
  onMatchUpdate?: (matchId: string, score1: number, score2: number) => void;
  editMode?: boolean;
}
```

### MatchCard
```typescript
interface MatchCardProps {
  match: Match;
  onUpdate?: (score1: number, score2: number) => void;
  editMode?: boolean;
  compact?: boolean;
}
```

### TeamManagement
```typescript
interface TeamManagementProps {
  teams: Team[];
  onAddTeam: (team: Team) => void;
  onRemoveTeam: (teamId: string) => void;
  onUpdateTeam: (team: Team) => void;
}
```

### FormatSelection
```typescript
interface FormatSelectionProps {
  teams: Team[];
  onFormatSelected: (format: BracketFormat, bracketName: string) => void;
  disabled?: boolean;
}
```

### ExportOptions
```typescript
interface ExportOptionsProps {
  bracket: Bracket;
}
```

## Usage Examples

### Complete Tournament Flow
```typescript
import { useTournamentStore } from './store/tournamentStore';

function TournamentManager() {
  const store = useTournamentStore();

  // 1. Create tournament
  store.createTournament('Spring 2026', 'Admin', 'Regional qualifiers');

  // 2. Add teams
  store.addTeam({ id: '1', name: 'Team Alpha', seed: 1 });
  store.addTeam({ id: '2', name: 'Team Beta', seed: 2 });

  // 3. Generate bracket
  store.generateBracket('single-elimination', 'Main Bracket');

  // 4. Update results
  store.updateMatchResult('match-1-0', 3, 1);

  // 5. Save
  store.saveTournament();

  // 6. Export
  const { bracket } = store.tournament;
  exportToPDF(bracket, 'results.pdf');
}
```

### Bracket Generation Example
```typescript
import { generateBracket } from './utils/bracketGenerator';

const teams = [
  { id: '1', name: 'Team A', seed: 1 },
  { id: '2', name: 'Team B', seed: 2 },
  { id: '3', name: 'Team C', seed: 3 },
  { id: '4', name: 'Team D', seed: 4 }
];

const bracket = generateBracket('single-elimination', teams, 'Main Bracket');
// bracket.rounds contains all rounds and matches
```

## Error Handling

### Team Validation
- Minimum 2 teams required to generate bracket
- Team names must be non-empty strings
- Duplicate team names allowed (but not recommended)

### Match Updates
- Invalid matchId silently ignored
- Scores must be non-negative numbers
- Winner automatically determined (higher score wins)

### Export Errors
- File download may fail on restricted domains
- Large brackets may take time to export
- PDF export requires browser canvas support

## Performance Considerations

- Single elimination: O(n) generation time
- Round-robin: O(n²) generation time
- Maximum tested: 32 teams
- Match updates: O(n) search through rounds

## Browser Compatibility

- LocalStorage: Required for persistence
- Canvas: Required for PDF export
- ES2020: Modern JavaScript features used
- Fetch API: Not used (file downloads only)

---

**Last Updated:** May 2026
**Version:** 1.0.0
