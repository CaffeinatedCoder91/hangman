import type { Challenge } from '@shared/game';
import HangmanDrawing from '../HangmanDrawing/HangmanDrawing';
import LetterKeyboard from '../LetterKeyboard/LetterKeyboard';
import WordDisplay from '../WordDisplay/WordDisplay';
import { Attempts, Banner, Card, Category, GameGrid, Hint, MissedChip, MissedChips, MissedHeading, NewGameButton, PanelMeta, SidePanel } from './GameBoard.styles';

type GameBoardProps = { game: Challenge; onGuess: (letter: string) => void; onNewGame: () => void };

const GameBoard = ({ game, onGuess, onNewGame }: GameBoardProps) => {
  const misses = game.missedLetters.length;
  const attemptsTone = game.attemptsRemaining <= 2 ? 'danger' : game.attemptsRemaining <= 4 ? 'warning' : 'safe';

  return <GameGrid>
    <SidePanel>
      <HangmanDrawing misses={misses} />
      <Attempts $tone={attemptsTone}>ATTEMPTS: {game.attemptsRemaining}/6</Attempts>
      <div><MissedHeading>MISSED LETTERS</MissedHeading><MissedChips>{game.missedLetters.map((letter) => <MissedChip key={letter}>{letter}</MissedChip>)}</MissedChips></div>
    </SidePanel>
    <Card>
      <PanelMeta>
        <Category>{game.category.toUpperCase()}</Category>
        {misses >= 2 && <Hint>{game.hint}</Hint>}
      </PanelMeta>
      {game.status === 'won' && <Banner $status="won"><strong>YOU WIN! ★</strong><span>Solved it: {game.answer}</span></Banner>}
      {game.status === 'lost' && <Banner $status="lost"><strong>GAME OVER</strong><span>The word was: {game.answer}</span></Banner>}
      <WordDisplay game={game} />
      <LetterKeyboard game={game} onGuess={onGuess} />
      <NewGameButton onClick={onNewGame}>NEW GAME</NewGameButton>
    </Card>
  </GameGrid>;
};

export default GameBoard;
