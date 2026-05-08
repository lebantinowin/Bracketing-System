# Architecture & Data Flow Diagrams

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   App.tsx (Root)                      │   │
│  │        - View Management (Setup, Bracket, Export)    │   │
│  │        - Header with tournament info                 │   │
│  │        - Tab-based navigation                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│    ┌────▼────┐    ┌──────▼──────┐    ┌────▼──────┐         │
│    │  Setup  │    │   Bracket   │    │  Export   │         │
│    │  View   │    │   View      │    │  View     │         │
│    └────┬────┘    └──────┬──────┘    └────┬──────┘         │
│         │                 │                 │               │
│    ┌────┴──────────┐  ┌──┴──────────┐  ┌──┴──────┐        │
│    │               │  │             │  │          │        │
│  Team         Format   Bracket      Export        │        │
│  Mgmt         Select   Display      Options       │        │
│    │               │  │             │  │          │        │
│    └───────────────┴──┴─────────────┴──┴──────────┘        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Zustand Store (State Management)            │   │
│  │  - tournament: Tournament | null                     │   │
│  │  - tournaments: Tournament[]                         │   │
│  │  - Actions: create, add, update, remove, generate   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│        ┌──────────────────┼──────────────────┐              │
│        │                  │                  │              │
│   ┌────▼────┐      ┌─────▼──────┐    ┌─────▼────┐         │
│   │Bracket  │      │   Export   │    │Local     │         │
│   │Generator│      │   Utils    │    │Storage   │         │
│   └────┬────┘      └─────┬──────┘    └─────┬────┘         │
│        │                  │                  │              │
│    Algorithms         JSON/CSV/PDF/        Persist          │
│    + Types            HTML Export           Data            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow: Tournament Creation to Export

```
1. CREATE TOURNAMENT
   ┌─────────────────┐
   │  Welcome Screen │
   │  (Form Input)   │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────────────┐
   │ createTournament(...)   │
   │ - Initialize bracket    │
   │ - Set status: planning  │
   └────────┬────────────────┘
            │
            ▼
   ┌─────────────────────────┐
   │ Store: tournament       │
   │ Teams: []               │
   │ Rounds: []              │
   └─────────────────────────┘

2. ADD TEAMS
   ┌──────────────┐
   │ Add Team UI  │
   └────┬─────────┘
        │
        ▼
   ┌──────────────────┐
   │ addTeam({...})   │
   └────┬─────────────┘
        │
        ▼
   ┌──────────────────────┐
   │ Store: teams array   │
   │ [Team1, Team2, ...]  │
   └──────────────────────┘

3. SELECT FORMAT & GENERATE
   ┌──────────────────┐
   │ Format Selection │
   └────┬─────────────┘
        │
        ▼
   ┌──────────────────────────┐
   │ generateBracket(format)  │
   └────┬─────────────────────┘
        │
        ▼
   ┌─────────────────────────────────┐
   │ bracketGenerator.ts             │
   │ - generateSingleElimination()   │
   │ - generateDoubleElimination()   │
   │ - generateRoundRobin()          │
   └────┬────────────────────────────┘
        │
        ▼
   ┌──────────────────────┐
   │ Store: bracket       │
   │ Rounds: [...]        │
   │ Matches: [...]       │
   └──────────────────────┘

4. ENTER RESULTS
   ┌──────────────┐
   │  Match Card  │
   │  (Edit Mode) │
   └────┬─────────┘
        │
        ▼
   ┌────────────────────────┐
   │ updateMatchResult(...) │
   │ - Update scores        │
   │ - Determine winner     │
   └────┬───────────────────┘
        │
        ▼
   ┌──────────────────────┐
   │ Store: match updated │
   │ winner: Team         │
   │ status: in-progress  │
   └──────────────────────┘

5. EXPORT
   ┌─────────────────┐
   │ Export Options  │
   │ (4 formats)     │
   └────┬────────────┘
        │
        ├─────────┬──────────┬───────────┬─────────┐
        │         │          │           │         │
        ▼         ▼          ▼           ▼         ▼
   ┌─────┐  ┌──┐ ┌────┐  ┌────┐  ┌──────┐
   │JSON │  │ │ │CSV │  │PDF │  │HTML │
   └─────┘  │ │ └────┘  └────┘  └──────┘
        │   └─┘      │           │        │
        │   ↓        │           │        │
        └─→ Browser Downloads ←──┴────────┘
```

## Component Communication

```
                        ┌──────────────┐
                        │   App.tsx    │
                        │  (View Mgmt) │
                        └──────┬───────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          ┌──────────┐   ┌──────────┐   ┌──────────┐
          │  Setup   │   │ Bracket  │   │  Export  │
          │  View    │   │  View    │   │  View    │
          └────┬─────┘   └────┬─────┘   └────┬─────┘
               │              │              │
        ┌──────┴───────┐     ┌┴────┐        │
        │              │     │     │        │
        ▼              ▼     ▼     ▼        ▼
     ┌─────────┐  ┌──────┐ ┌───┐ ┌────────────┐
     │  Team   │  │Format│ │   │ │  Export   │
     │  Mgmt   │  │Select│ │   │ │  Options  │
     └────┬────┘  └──┬───┘ │   │ └────┬──────┘
          │         │      │   │      │
          └─────────┴──────┬┴───┴──────┘
                           │
                           ▼
                 ┌─────────────────────┐
                 │ Zustand Store       │
                 │ - tournament        │
                 │ - teams             │
                 │ - bracket           │
                 │ - updateActions()   │
                 └─────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐     ┌────────┐      ┌─────────┐
    │ Bracket  │     │ Export │      │localStorage
    │Generator │     │ Utils  │      └─────────┘
    └──────────┘     └────────┘
```

## Bracket Generation Pipeline

```
Input: Teams Array
│
├─ Sort by Seed
│  Team1 (seed 1)
│  Team2 (seed 2)
│  Team3 (seed 3)
│  Team4 (seed 4)
│
▼
├─ Single Elimination
│  │
│  ├─ Find next power of 2
│  ├─ Insert byes if needed
│  └─ Create Round 1 matches:
│     │ [Team1 vs Team2] → Match 1
│     │ [Team3 vs Team4] → Match 2
│     │ ... (byes added here)
│
│  ├─ Winners from Round 1 enter Round 2
│  ├─ Continue until 1 winner
│  │
│  └─ Output: Bracket with ~log(n) rounds
│
├─ Double Elimination
│  │
│  ├─ Create Winners Bracket (as above)
│  └─ Create Losers Bracket
│     └─ Losers get second chance
│        Each loss moves to losers bracket
│
│  └─ Output: Dual bracket structure
│
└─ Round Robin
   │
   ├─ Use Berger tables algorithm
   ├─ Every team plays every team once
   │  Round 1: [1 vs 2, 3 vs 4, ...]
   │  Round 2: [1 vs 3, 2 vs 4, ...]
   │  ... rotate schedule
   │
   └─ Output: n-1 rounds with comprehensive coverage
```

## Match Result Flow

```
User enters score: 3 vs 1
        │
        ▼
┌─────────────────────┐
│ MatchCard Component │
│ (Edit Mode)         │
└────────┬────────────┘
         │
         ▼
┌───────────────────────────┐
│ updateMatchResult()       │
│ (Store Action)            │
│ - Find match by ID        │
│ - Update scores           │
│ - Compare scores          │
└────────┬──────────────────┘
         │
         ▼
┌───────────────────────┐
│ Determine Winner      │
│ 3 > 1 → Team1 wins    │
└────────┬──────────────┘
         │
         ▼
┌───────────────────────────┐
│ Update Match Object       │
│ - score1: 3              │
│ - score2: 1              │
│ - winner: Team1          │
│ - timestamp: now()        │
└────────┬──────────────────┘
         │
         ▼
┌──────────────────────┐
│ Save to Store        │
│ (localStorage auto)  │
└────────┬─────────────┘
         │
         ▼
┌────────────────────────┐
│ Update UI              │
│ - Winner highlighted   │
│ - Green background     │
│ - Scores displayed     │
└────────────────────────┘
```

## Export Pipeline

```
    tournament.bracket
           │
     ┌─────┴─────┬──────────┬─────────┐
     │           │          │         │
     ▼           ▼          ▼         ▼
  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
  │JSON  │  │CSV   │  │PDF   │  │HTML  │
  │Export│  │Export│  │Export│  │Export│
  └───┬──┘  └───┬──┘  └───┬──┘  └───┬──┘
      │         │         │        │
      ▼         ▼         ▼        ▼
  JSON.stringify  Tabular  jsPDF   Template
  Full data      Format   Render  String
      │         │         │        │
      └─────────┴─────────┴────────┘
              │
              ▼
      ┌──────────────┐
      │ Blob Created │
      └──────┬───────┘
             │
             ▼
      ┌────────────────┐
      │ Download Link  │
      │ Created        │
      └──────┬─────────┘
             │
             ▼
      ┌────────────────┐
      │ User Browser   │
      │ File Downloaded│
      └────────────────┘
```

## State Management Tree

```
useTournamentStore
│
├─ State
│  ├─ tournament: Tournament | null
│  │  ├─ id
│  │  ├─ name
│  │  ├─ organizer
│  │  ├─ description
│  │  ├─ bracket
│  │  │  ├─ teams: Team[]
│  │  │  ├─ rounds: Round[]
│  │  │  ├─ format
│  │  │  └─ status
│  │  └─ timestamps
│  │
│  └─ tournaments: Tournament[]
│     └─ Historical tournaments
│
└─ Actions
   ├─ createTournament(name, organizer, desc)
   ├─ generateBracket(format, name)
   ├─ addTeam(team)
   ├─ removeTeam(id)
   ├─ updateTeam(team)
   ├─ updateMatchResult(matchId, s1, s2)
   ├─ saveTournament()
   ├─ loadTournament(tournament)
   └─ resetTournament()
```

## Responsive Layout Breakpoints

```
Mobile (< 768px)
├─ Stack navigation vertically
├─ Single column layout
├─ Full width components
└─ Touch-optimized buttons

Tablet (768px - 1024px)
├─ 2 column grid
├─ Side-by-side components
├─ Optimized spacing
└─ Readable font sizes

Desktop (> 1024px)
├─ Multi-column layouts
├─ Full feature display
├─ Comprehensive sidebar
└─ Spacious design
```

---

**These diagrams represent the complete architecture and data flow of the Nexus League Tournament Bracket Management System.**
