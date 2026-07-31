import words from './data/words.json' with { type: 'json' };
import type { Challenge, GameStatus, WordEntry } from '@shared/game.js';

export const MAX_ATTEMPTS = 6;

const entries = words satisfies WordEntry[];

function mask(word: string, guesses: Set<string>): string {
  return [...word]
    .map((character) =>
      /[A-Z]/.test(character) && !guesses.has(character)
        ? '_'
        : character,
    )
    .join('');
}

function responseFor(entry: WordEntry, guessedLetters: string[]): Challenge {
  const guesses = new Set(guessedLetters);
  const letters = new Set(
    [...entry.word].filter((letter) => /[a-z]/i.test(letter)),
  );
  const missedLetters = guessedLetters.filter((letter) => !letters.has(letter));
  const maskedWord = mask(entry.word, guesses);
  const status: GameStatus = !maskedWord.includes('_')
    ? 'won'
    : missedLetters.length >= MAX_ATTEMPTS
      ? 'lost'
      : 'playing';

  return {
    challengeId: entry.id,
    category: entry.category,
    hint: entry.hint,
    maskedWord,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - missedLetters.length),
    guessedLetters,
    missedLetters,
    status,
    ...(status === 'playing' ? {} : { answer: entry.word }),
  };
}

export function newChallenge(random = Math.random): Challenge {
  const entry = entries[Math.floor(random() * entries.length)];
  if (!entry) throw new Error('No challenge words are configured');
  return responseFor(entry, []);
}

export function playChallenge(
  challengeId: string,
  guessedLetters: string[],
): Challenge | undefined {
  const entry = entries.find(({ id }) => id === challengeId);
  return entry ? responseFor(entry, guessedLetters) : undefined;
}

export function validateGuesses(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const guesses = value.map((letter) => (typeof letter === 'string' ? letter : ''));
  const valid =
    guesses.every((letter) => /^[A-Z]$/.test(letter)) &&
    new Set(guesses).size === guesses.length;
  return valid ? guesses : undefined;
}
