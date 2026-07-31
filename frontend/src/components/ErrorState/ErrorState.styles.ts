import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const ErrorCard = styled.section`
  display: flex; flex-direction: column; align-items: center; gap: 16px; padding: clamp(24px, 6vw, 48px);
  border: 3px solid ${theme.colors.magenta}; border-radius: 8px; background: ${theme.colors.panel}; box-shadow: 6px 6px 0 rgb(0 0 0 / 15%); text-align: center;
`;
export const Warning = styled.div`
  display: grid; width: 48px; height: 42px; place-items: end center; padding-bottom: 6px; clip-path: polygon(50% 0, 100% 100%, 0 100%);
  background: ${theme.colors.magenta}; color: ${theme.colors.panel}; font-family: ${theme.fonts.display}; font-size: 14px;
`;
export const ErrorTitle = styled.h2`margin: 8px 0 0; color: ${theme.colors.magenta}; font-family: ${theme.fonts.display}; font-size: clamp(16px, 3vw, 20px);`;
export const ErrorCopy = styled.p`max-width: 360px; margin: 0; color: ${theme.colors.secondary};`;
export const RetryButton = styled.button`
  padding: 14px 24px; border: 0; border-radius: 6px; background: ${theme.colors.yellow}; color: ${theme.colors.dark}; box-shadow: 4px 4px 0 rgb(0 0 0 / 15%); cursor: pointer; font-family: ${theme.fonts.display}; font-size: 13px;
  &:active { transform: translate(3px, 3px); box-shadow: none; }
`;
