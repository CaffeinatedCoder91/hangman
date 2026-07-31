import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Slots = styled.div`display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 8px 0;`;
export const Slot = styled.span<{ $won: boolean; $revealed: boolean; $guessed: boolean }>`
  display: flex; width: clamp(26px, 7vw, 42px); height: clamp(34px, 9vw, 48px); align-items: center; justify-content: center;
  border-bottom: 4px solid ${({ $won, $revealed, $guessed }) => $won || $guessed ? theme.colors.cyan : $revealed ? theme.colors.magenta : theme.colors.border};
  color: ${({ $won, $revealed }) => $won ? theme.colors.cyan : $revealed ? theme.colors.magenta : theme.colors.dark}; font-family: ${theme.fonts.display}; font-size: clamp(16px, 4vw, 24px);
`;
export const ScreenReaderText = styled.span`position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0);`;
