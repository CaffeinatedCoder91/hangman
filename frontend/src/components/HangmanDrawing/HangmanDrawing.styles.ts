import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Drawing = styled.svg`
  width: 100%; max-width: 220px; stroke-width: 6; stroke-linecap: round; fill: none;
  .gallows { stroke: oklch(35% 0.02 280); }
  .drawn { stroke: ${theme.colors.magenta}; opacity: 1; }
  .ghost { stroke: ${theme.colors.ghost}; opacity: 0.6; }
`;
