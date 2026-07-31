import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.purple};
  font-family: ${theme.fonts.display};
  font-size: clamp(26px, 6vw, 42px);
  letter-spacing: 2px;
  text-shadow: 3px 3px 0 oklch(68% 0.22 85 / 0.6);
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${theme.colors.secondary};
  font-size: 13px;
  letter-spacing: 0.5px;
`;
