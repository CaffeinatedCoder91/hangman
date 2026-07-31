export type GameStatus = 'playing' | 'won' | 'lost';

export type WordEntry = {
  id: string;
  word: string;
  category: string;
  hint: string;
};

export type Challenge = {
  challengeId: string;
  category: string;
  hint: string;
  maskedWord: string;
  attemptsRemaining: number;
  guessedLetters: string[];
  missedLetters: string[];
  status: GameStatus;
  answer?: string;
};
