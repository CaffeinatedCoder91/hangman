import { Drawing } from './HangmanDrawing.styles';

type HangmanDrawingProps = { misses: number };

const HangmanDrawing = ({ misses }: HangmanDrawingProps) => {
  const stage = (number: number) => (misses >= number ? 'drawn' : 'ghost');

  return (
    <Drawing viewBox="0 0 200 220" role="img" aria-label={`Hangman drawing, ${misses} of 6 wrong guesses made`}>
      <g className="gallows"><line x1="20" y1="200" x2="140" y2="200" /><line x1="50" y1="200" x2="50" y2="20" /><line x1="50" y1="20" x2="130" y2="20" /><line x1="50" y1="50" x2="75" y2="20" /></g>
      <line className={stage(1)} x1="130" y1="20" x2="130" y2="45" />
      <circle className={stage(2)} cx="130" cy="65" r="20" />
      <line className={stage(3)} x1="130" y1="85" x2="130" y2="140" />
      <g className={stage(4)}><line x1="130" y1="95" x2="105" y2="120" /><line x1="130" y1="95" x2="155" y2="120" /></g>
      <line className={stage(5)} x1="130" y1="140" x2="110" y2="175" />
      <line className={stage(6)} x1="130" y1="140" x2="150" y2="175" />
    </Drawing>
  );
};

export default HangmanDrawing;
