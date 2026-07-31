import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { App } from './App';

const challenge = {
  challengeId: 'planet-amber', category: 'Space', hint: 'A ringed planet', maskedWord: '______', attemptsRemaining: 6,
  guessedLetters: [], missedLetters: [], status: 'playing' as const,
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it('loads a challenge and sends complete uppercase guesses from the physical keyboard', async () => {
  const fetchMock = vi.mocked(fetch);
  fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(challenge), { status: 200 }));
  fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ ...challenge, maskedWord: 'S_____', guessedLetters: ['S'] }), { status: 200 }));
  render(<App />);

  expect(screen.getByText('LOADING WORD...')).toBeInTheDocument();
  await act(async () => { await vi.advanceTimersByTimeAsync(700); });
  expect(screen.getByText('A ringed planet')).toBeInTheDocument();

  fireEvent.keyDown(window, { key: 's' });
  await act(async () => {});
  expect(fetchMock).toHaveBeenLastCalledWith('/api/challenges/planet-amber/guess', expect.objectContaining({ body: JSON.stringify({ guessedLetters: ['S'] }) }));
});

it('shows the connection error and can retry', async () => {
  const fetchMock = vi.mocked(fetch);
  fetchMock.mockRejectedValueOnce(new Error('offline'));
  fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(challenge), { status: 200 }));
  render(<App />);

  await act(async () => { await vi.advanceTimersByTimeAsync(700); });
  expect(screen.getByRole('heading', { name: 'CONNECTION LOST' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'RETRY' }));
  await act(async () => { await vi.advanceTimersByTimeAsync(700); });
  expect(screen.getByText('A ringed planet')).toBeInTheDocument();
});
