import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import ErrorState from './ErrorState';

it('explains the connection error and retries on request', () => {
  const onRetry = vi.fn();
  render(<ErrorState onRetry={onRetry} />);

  expect(screen.getByRole('heading', { name: 'CONNECTION LOST' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'RETRY' }));
  expect(onRetry).toHaveBeenCalledOnce();
});
