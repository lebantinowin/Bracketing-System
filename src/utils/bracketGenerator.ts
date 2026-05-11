import type { Team, Match, Round, Bracket, BracketFormat } from '../types';

/**
 * Generate a single elimination bracket
 */
export const generateSingleElimination = (teams: Team[]): Round[] => {
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

    for (let i = 0; i < currentRound.length; i += 2) {
      const team1 = currentRound[i];
      const team2 = currentRound[i + 1];

      matches.push({
        id: `match-${roundNumber}-${i / 2}`,
        roundNumber,
        matchNumber: i / 2,
        team1,
        team2,
      });
    }

    rounds.push({
      number: roundNumber,
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
export const generateDoubleElimination = (teams: Team[]): Round[] => {
  if (teams.length === 0) return [];

  // For simplicity, generate winners bracket and losers bracket separately
  const rounds: Round[] = [];

  // Winners bracket
  const winnersRounds = generateSingleElimination(teams);
  winnersRounds.forEach((round) => {
    rounds.push({
      number: round.number,
      matches: round.matches.map((match: Match) => ({
        ...match,
        id: `winners-${match.id}`,
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
export const generateRoundRobin = (teams: Team[]): Round[] => {
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
          id: `match-${roundNum}-${matchNum}`,
          roundNumber: roundNum,
          matchNumber: matchNum,
          team1: teams[team1Index],
          team2: teams[team2Index],
        });
        matchNum++;
      }
    }

    // Add bye if odd number of teams
    if (isOdd) {
      const byeTeamIndex = (round + Math.floor(n / 2)) % n;
      // Bye is represented by a match with only one team
      matches.push({
        id: `match-${roundNum}-bye`,
        roundNumber: roundNum,
        matchNumber: matchNum,
        team1: teams[byeTeamIndex],
        team2: undefined,
      });
    }

    if (matches.length > 0) {
      rounds.push({
        number: roundNum,
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
  name: string
): Bracket => {
  let rounds: Round[] = [];

  switch (format) {
    case 'single-elimination':
      rounds = generateSingleElimination(teams);
      break;
    case 'double-elimination':
      rounds = generateDoubleElimination(teams);
      break;
    case 'round-robin':
      rounds = generateRoundRobin(teams);
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
  score2: number
): Bracket => {
  const newBracket = JSON.parse(JSON.stringify(bracket));

  for (const round of newBracket.rounds) {
    const match = round.matches.find((m: Match) => m.id === matchId);
    if (match) {
      match.score1 = score1;
      match.score2 = score2;
      match.timestamp = Date.now();

      // Determine winner
      if (score1 > score2) {
        match.winner = match.team1;
      } else if (score2 > score1) {
        match.winner = match.team2;
      } else {
        match.winner = undefined; // Tie
      }

      newBracket.updatedAt = Date.now();
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
