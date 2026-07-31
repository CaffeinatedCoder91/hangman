import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { Challenge } from '@shared/game';
import LetterKeyboard from './LetterKeyboard';

const game: Challenge = {
  challengeId: 'planet-amber', category: 'Space', hint: 'A ringed planet', maskedWord: 'S_____', attemptsRemaining: 5,
  guessedLetters: ['S', 'X'], missedLetters: ['X'], status: 'playing',
};

it('renders every letter, disables guesses, and submits an enabled letter', () => {
  const onGuess = vi.fn();
  render(<LetterKeyboard game={game} onGuess={onGuess} />);

  expect(screen.getAllByRole('button')).toHaveLength(26);
  expect(screen.getByRole('button', { name: 'Letter S, correct' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Letter X, incorrect' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Letter A' }));
  expect(onGuess).toHaveBeenCalledWith('A');
});
