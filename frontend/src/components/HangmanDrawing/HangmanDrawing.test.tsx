import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import HangmanDrawing from './HangmanDrawing';

it('describes the current drawing stage', () => {
  render(<HangmanDrawing misses={4} />);
  expect(screen.getByRole('img', { name: 'Hangman drawing, 4 of 6 wrong guesses made' })).toBeInTheDocument();
});
