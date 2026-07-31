import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Keyboard = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(38px, 1fr)); gap: 8px;`;
export const Letter = styled.button<{ $correct: boolean; $missed: boolean }>`
  min-height: 44px; border: 2px solid ${theme.colors.border}; border-radius: 5px; background: ${({ $correct }) => $correct ? 'oklch(85% 0.16 200)' : theme.colors.raised}; color: ${({ $correct }) => $correct ? 'oklch(25% 0.10 200)' : theme.colors.dark}; cursor: pointer; font-weight: 700;
  &:hover:not(:disabled) { background: ${theme.colors.border}; color: ${theme.colors.panel}; }
  &:disabled { cursor: default; opacity: ${({ $missed }) => $missed ? 0.5 : 1}; text-decoration: ${({ $missed }) => $missed ? 'line-through' : 'none'}; }
`;
