import type { Challenge } from '@shared/game';

const apiUrl = import.meta.env.VITE_API_URL ?? '';

const requestChallenge = async (path: string, options?: RequestInit): Promise<Challenge> => {
  const response = await fetch(`${apiUrl}${path}`, options);
  if (!response.ok) throw new Error('Unable to reach the game server.');
  return (await response.json()) as Challenge;
};

export const getChallenge = () => requestChallenge('/api/challenges');

export const submitGuess = (challengeId: string, guessedLetters: string[]) =>
  requestChallenge(`/api/challenges/${challengeId}/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guessedLetters }),
  });
