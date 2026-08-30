import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { Challenge } from '@shared/game';
import GameBoard from './GameBoard';

const game: Challenge = {
  challengeId: 'planet-amber', category: 'Space', hint: 'A ringed planet', maskedWord: 'S_____', attemptsRemaining: 5,
  guessedLetters: ['S', 'X'], missedLetters: ['X'], status: 'playing',
};

it('conceals the hint until two misses and starts a new game', () => {
  const onNewGame = vi.fn();
  const { rerender } = render(<GameBoard game={game} onGuess={vi.fn()} onNewGame={onNewGame} />);

  expect(screen.queryByText('A ringed planet')).not.toBeInTheDocument();
  rerender(<GameBoard game={{ ...game, guessedLetters: ['S', 'X', 'Y'], missedLetters: ['X', 'Y'], attemptsRemaining: 4 }} onGuess={vi.fn()} onNewGame={onNewGame} />);
  expect(screen.getByText('A ringed planet')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Letter X, incorrect' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'NEW GAME' }));
  expect(onNewGame).toHaveBeenCalledOnce();
});

it('displays the lost-game banner and answer', () => {
  render(<GameBoard game={{ ...game, status: 'lost', answer: 'SATURN', attemptsRemaining: 0 }} onGuess={vi.fn()} onNewGame={vi.fn()} />);

  expect(screen.getByText('GAME OVER')).toBeInTheDocument();
  expect(screen.getByText('The word was: SATURN')).toBeInTheDocument();
});
