import type { Challenge } from '@shared/game';
import { ScreenReaderText, Slots, Slot } from './WordDisplay.styles';

type WordDisplayProps = { game: Challenge };

const WordDisplay = ({ game }: WordDisplayProps) => {
  const answer = game.answer;
  const lost = game.status === 'lost';
  const won = game.status === 'won';
  const letters = (answer ?? game.maskedWord).split('');
  const screenReaderWord = letters.map((letter, index) => game.maskedWord[index] === '_' && !lost ? 'blank' : letter).join(', ');

  return (
    <>
      <Slots aria-hidden="true">
        {letters.map((letter, index) => {
          const guessed = game.maskedWord[index] !== '_';
          const revealed = lost && !guessed;
          return <Slot key={`${letter}-${index}`} $won={won} $revealed={revealed} $guessed={guessed}>{guessed || lost || won ? letter : ''}</Slot>;
        })}
      </Slots>
      <ScreenReaderText>Word: {screenReaderWord}</ScreenReaderText>
    </>
  );
};

export default WordDisplay;
