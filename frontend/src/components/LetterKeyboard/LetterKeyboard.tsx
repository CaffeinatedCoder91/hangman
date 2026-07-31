import type { Challenge } from '@shared/game';
import { Keyboard, Letter } from './LetterKeyboard.styles';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
type LetterKeyboardProps = { game: Challenge; onGuess: (letter: string) => void };

const LetterKeyboard = ({ game, onGuess }: LetterKeyboardProps) => (
  <Keyboard role="group" aria-label="Letter keyboard">
    {alphabet.map((letter) => {
      const guessed = game.guessedLetters.includes(letter);
      const correct = guessed && !game.missedLetters.includes(letter);
      const missed = game.missedLetters.includes(letter);
      return <Letter key={letter} $correct={correct} $missed={missed} disabled={guessed || game.status !== 'playing'} onClick={() => onGuess(letter)} aria-label={`Letter ${letter}${correct ? ', correct' : missed ? ', incorrect' : ''}`}>{letter}</Letter>;
    })}
  </Keyboard>
);

export default LetterKeyboard;
