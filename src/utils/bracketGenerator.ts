import type { Team, Match, Round, Bracket, BracketFormat } from '../types';

/**
 * Generate a single elimination bracket
 */
export const generateSingleElimination = (teams: Team[], code: string): Round[] => {
  if (teams.length === 0) return [];

  // Sort teams by seed if available
  const sortedTeams = [...teams].sort((a, b) => (a.seed || 999) - (b.seed || 999));

  // Find the next power of 2
  const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(sortedTeams.length)));
  const paddedTeams = [...sortedTeams];

  // Pad with byes (undefined teams)
  while (paddedTeams.length < nextPowerOf2) {
    paddedTeams.push(undefined as any);
  }

  const rounds: Round[] = [];
  let currentRound = paddedTeams;
  let roundNumber = 1;
  while (currentRound.length > 1) {
    const matches: Match[] = [];

    const totalRounds = Math.log2(nextPowerOf2);
    let roundLabel = `Round ${roundNumber}`;
    if (roundNumber === totalRounds) roundLabel = 'Finals';
    else if (roundNumber === totalRounds - 1) roundLabel = 'Semifinals';
    else if (roundNumber === totalRounds - 2) roundLabel = 'Quarterfinals';

    const roundCode = roundLabel === 'Finals' ? 'F' : roundLabel === 'Semifinals' ? 'SF' : roundLabel === 'Quarterfinals' ? 'QF' : `R${roundNumber}`;

    for (let i = 0; i < currentRound.length; i += 2) {
      const team1 = currentRound[i];
      const team2 = currentRound[i + 1];

      matches.push({
        id: `${code}-${roundCode}-${(i / 2 + 1).toString().padStart(2, '0')}`,
        roundNumber,
        matchNumber: i / 2,
        team1,
        team2,
        status: 'pending'
      });
    }

    rounds.push({
      number: roundNumber,
      label: roundLabel,
      matches,
    });

    // Set up next round with byes for teams that don't need to play
    currentRound = matches.map(() => undefined as any);
    roundNumber++;
  }

  return rounds;
};

/**
 * Generate a double elimination bracket
 */
export const generateDoubleElimination = (teams: Team[], code: string): Round[] => {
  if (teams.length === 0) return [];

  // For simplicity, generate winners bracket and losers bracket separately
  const rounds: Round[] = [];

  // Winners bracket
  const winnersRounds = generateSingleElimination(teams, code);
  winnersRounds.forEach((round) => {
    rounds.push({
      number: round.number,
      label: `Winners ${round.label}`,
      matches: round.matches.map((match: Match) => ({
        ...match,
        id: match.id.replace(`${code}-`, `${code}-W`),
      })),
    });
  });

  // Losers bracket would start at the same time, but for MVP we'll keep it simplified
  // In a full implementation, you'd create matches based on losers from each round

  return rounds;
};

/**
 * Generate a round-robin bracket
 */
export const generateRoundRobin = (teams: Team[], code: string): Round[] => {
  if (teams.length === 0) return [];

  const rounds: Round[] = [];
  const n = teams.length;
  const isOdd = n % 2 === 1;

  let roundNum = 1;

  // Generate round-robin schedule (Berger tables algorithm)
  for (let round = 0; round < n - 1; round++) {
    const matches: Match[] = [];
    let matchNum = 0;

    // Match teams
    for (let i = 0; i < Math.floor(n / 2); i++) {
      let team1Index: number;
      let team2Index: number;

      if (i === 0) {
        team1Index = round % n;
        team2Index = (n - 1 - round) % n;
      } else {
        team1Index = (round + i) % n;
        team2Index = (round - i + n) % n;
      }

      if (team1Index !== team2Index) {
        matches.push({
          id: `${code}-RR${roundNum}-${(matchNum + 1).toString().padStart(2, '0')}`,
          roundNumber: roundNum,
          matchNumber: matchNum,
          team1: teams[team1Index],
          team2: teams[team2Index],
          status: 'pending'
        });
        matchNum++;
      }
    }

    // Add bye if odd number of teams
    if (isOdd) {
      const byeTeamIndex = (round + Math.floor(n / 2)) % n;
      // Bye is represented by a match with only one team
      matches.push({
        id: `${code}-RR${roundNum}-BYE`,
        roundNumber: roundNum,
        matchNumber: matchNum,
        team1: teams[byeTeamIndex],
        team2: undefined,
        status: 'completed'
      });
    }

    if (matches.length > 0) {
      rounds.push({
        number: roundNum,
        label: `Round ${roundNum}`,
        matches,
      });
      roundNum++;
    }
  }

  return rounds;
};

/**
 * Generate bracket based on format
 */
export const generateBracket = (
  format: BracketFormat,
  teams: Team[],
  name: string,
  code: string
): Bracket => {
  let rounds: Round[] = [];

  switch (format) {
    case 'single-elimination':
      rounds = generateSingleElimination(teams, code);
      break;
    case 'double-elimination':
      rounds = generateDoubleElimination(teams, code);
      break;
    case 'round-robin':
      rounds = generateRoundRobin(teams, code);
      break;
    case 'group-knockout':
    case 'swiss':
      // Stub for new formats
      rounds = generateRoundRobin(teams, code);
      break;
  }

  const now = Date.now();
  return {
    id: `bracket-${now}`,
    name,
    format,
    teams,
    rounds,
    status: 'planning',
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Update match score and determine winner
 */
export const updateMatchResult = (
  bracket: Bracket,
  matchId: string,
  score1: number,
  score2: number,
  forfeit?: 'team1' | 'team2' | 'both'
): Bracket => {
  const newBracket = JSON.parse(JSON.stringify(bracket));

  for (const round of newBracket.rounds) {
    const match = round.matches.find((m: Match) => m.id === matchId);
    if (match) {
      match.score1 = score1;
      match.score2 = score2;
      match.timestamp = Date.now();
      match.forfeit = forfeit;

      // Determine winner
      if (forfeit === 'team1') {
        match.winner = match.team2;
      } else if (forfeit === 'team2') {
        match.winner = match.team1;
      } else if (score1 > score2) {
        match.winner = match.team1;
      } else if (score2 > score1) {
        match.winner = match.team2;
      } else {
        match.winner = undefined; // Tie
      }

      // Detect upset
      if (match.winner && match.team1 && match.team2) {
        const t1Seed = match.team1.seed || 999;
        const t2Seed = match.team2.seed || 999;
        
        if (match.winner.id === match.team1.id && t1Seed > t2Seed) {
          match.upset = true;
        } else if (match.winner.id === match.team2.id && t2Seed > t1Seed) {
          match.upset = true;
        } else {
          match.upset = false;
        }
      }

      match.status = 'completed';
      newBracket.updatedAt = Date.now();
      
      // Auto-advance winner for single/double elimination
      if (bracket.format === 'single-elimination' || bracket.format === 'double-elimination') {
        return advanceWinner(newBracket, matchId);
      }
      return newBracket;
    }
  }

  return bracket;
};

/**
 * Get next round opponent for a winner
 */
export const advanceWinner = (bracket: Bracket, matchId: string): Bracket => {
  const newBracket = JSON.parse(JSON.stringify(bracket));

  // Find the match and its winner
  let currentMatch: Match | undefined;
  let currentRound: Round | undefined;

  for (const round of newBracket.rounds) {
    const match = round.matches.find((m: Match) => m.id === matchId);
    if (match) {
      currentMatch = match;
      currentRound = round;
      break;
    }
  }

  if (!currentMatch || !currentMatch.winner) return bracket;

  // Find the next round match to populate
  const nextRound = newBracket.rounds[currentRound!.number];
  if (!nextRound) return newBracket;

  // Calculate which match in the next round
  const matchIndex = Math.floor(currentMatch.matchNumber / 2);
  const isFirstTeam = currentMatch.matchNumber % 2 === 0;

  const nextMatch = nextRound.matches[matchIndex];
  if (!nextMatch) return newBracket;

  if (isFirstTeam) {
    nextMatch.team1 = currentMatch.winner;
  } else {
    nextMatch.team2 = currentMatch.winner;
  }

  return newBracket;
};
