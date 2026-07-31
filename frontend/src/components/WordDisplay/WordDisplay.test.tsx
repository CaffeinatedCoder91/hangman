import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import type { Challenge } from '@shared/game';
import WordDisplay from './WordDisplay';

const game: Challenge = {
  challengeId: 'planet-amber', category: 'Space', hint: 'A ringed planet', maskedWord: 'S_____', attemptsRemaining: 5,
  guessedLetters: ['S'], missedLetters: [], status: 'playing',
};

it('provides a screen-reader description for hidden letter slots', () => {
  render(<WordDisplay game={game} />);
  expect(screen.getByText('Word: S, blank, blank, blank, blank, blank')).toBeInTheDocument();
});

it('reveals every letter in a lost game', () => {
  render(<WordDisplay game={{ ...game, status: 'lost', answer: 'SATURN' }} />);
  expect(screen.getByText('Word: S, A, T, U, R, N')).toBeInTheDocument();
});
