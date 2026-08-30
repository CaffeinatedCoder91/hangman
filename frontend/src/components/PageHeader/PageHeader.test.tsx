import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import PageHeader from './PageHeader';

it('provides the game title and instructions', () => {
  render(<PageHeader />);
  expect(screen.getByRole('heading', { name: 'HANGMAN' })).toBeInTheDocument();
  expect(screen.getByText('guess the word before the gallows wins!')).toBeInTheDocument();
});
