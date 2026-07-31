import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import LoadingState from './LoadingState';

it('announces that a new word is loading', () => {
  render(<LoadingState />);
  expect(screen.getByText('LOADING WORD...')).toBeInTheDocument();
});
