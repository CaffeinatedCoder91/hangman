import { useCallback, useEffect, useState } from 'react';
import type { Challenge } from '@shared/game';
import { getChallenge, submitGuess } from './api/gameApi';
import ErrorState from './components/ErrorState/ErrorState';
import GameBoard from './components/GameBoard/GameBoard';
import LoadingState from './components/LoadingState/LoadingState';
import PageHeader from './components/PageHeader/PageHeader';
import GlobalStyle from './styles/GlobalStyle';
import { AppShell, LiveRegion } from './App.styles';

type ViewStatus = 'loading' | 'playing' | 'won' | 'lost' | 'error';
const loadingDuration = 700;

const waitForLoadingDuration = (startedAt: number) => new Promise<void>((resolve) => {
  const remaining = loadingDuration - (Date.now() - startedAt);
  window.setTimeout(resolve, Math.max(0, remaining));
});

export const App = () => {
  const [game, setGame] = useState<Challenge>();
  const [viewStatus, setViewStatus] = useState<ViewStatus>('loading');
  const [announcement, setAnnouncement] = useState('');

  const loadGame = useCallback(async () => {
    const startedAt = Date.now();
    setViewStatus('loading');
    setGame(undefined);

    try {
      const [challenge] = await Promise.all([getChallenge(), waitForLoadingDuration(startedAt)]);
      setGame(challenge);
      setViewStatus(challenge.status);
      setAnnouncement(`New game started. Category: ${challenge.category}.`);
    } catch {
      await waitForLoadingDuration(startedAt);
      setViewStatus('error');
      setAnnouncement('Failed to load a new word.');
    }
  }, []);

  const guessLetter = useCallback(async (letter: string) => {
    if (!game || viewStatus !== 'playing' || game.guessedLetters.includes(letter)) return;

    try {
      const updatedGame = await submitGuess(game.challengeId, [...game.guessedLetters, letter]);
      setGame(updatedGame);
      setViewStatus(updatedGame.status);

      if (updatedGame.status === 'won') setAnnouncement(`You won! The word was ${updatedGame.answer}.`);
      else if (updatedGame.status === 'lost') setAnnouncement(`Out of attempts. The word was ${updatedGame.answer}.`);
      else if (updatedGame.missedLetters.includes(letter)) setAnnouncement(`Wrong. ${letter} is not in the word. ${updatedGame.attemptsRemaining} attempts left.`);
      else setAnnouncement(`Correct! ${letter} is in the word.`);
    } catch {
      setViewStatus('error');
      setAnnouncement('Unable to submit that guess.');
    }
  }, [game, viewStatus]);

  useEffect(() => { void loadGame(); }, [loadGame]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const letter = event.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) void guessLetter(letter);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guessLetter]);

  return <>
    <GlobalStyle />
    <AppShell>
      <LiveRegion role="status" aria-live="polite">{announcement}</LiveRegion>
      <PageHeader />
      {viewStatus === 'loading' && <LoadingState />}
      {viewStatus === 'error' && <ErrorState onRetry={() => void loadGame()} />}
      {game && (viewStatus === 'playing' || viewStatus === 'won' || viewStatus === 'lost') && <GameBoard game={game} onGuess={(letter) => void guessLetter(letter)} onNewGame={() => void loadGame()} />}
    </AppShell>
  </>;
};

export default App;
