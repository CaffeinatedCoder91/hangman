export const MAX_ATTEMPTS = 6

export type GameStatus = 'playing' | 'won' | 'lost'

export interface GuessEvaluation {
  maskedWord: string
  attemptsRemaining: number
  status: GameStatus
}

export function maskWord(word: string, guessedLetters: string[]): string {
  const guessed = new Set(guessedLetters)
  return word
    .split('')
    .map((letter) => (guessed.has(letter) ? letter : '_'))
    .join('')
}

export function evaluateGuess(word: string, guessedLetters: string[]): GuessEvaluation {
  const maskedWord = maskWord(word, guessedLetters)
  const wrongGuesses = guessedLetters.filter((letter) => !word.includes(letter)).length
  const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - wrongGuesses)

  // Checked in this order so a winning final guess never gets reported as a
  // loss, even if attemptsRemaining also happens to hit 0 on the same guess.
  const status: GameStatus = !maskedWord.includes('_')
    ? 'won'
    : attemptsRemaining <= 0
      ? 'lost'
      : 'playing'

  return { maskedWord, attemptsRemaining, status }
}
