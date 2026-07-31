import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

const card = css`
  background: ${theme.colors.panel};
  border: 3px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 24px;
`;

export const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

export const SkeletonCard = styled.div`
  ${card};
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Skeleton = styled.div<{ $height?: string; $width?: string }>`
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '16px'};
  border-radius: 4px;
  background: oklch(90% 0.015 90);
  animation: pulse 1.4s ease-in-out infinite;

  @keyframes pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.7; } }
`;

export const LoadingCaption = styled.p`
  margin: 16px 0 0;
  color: ${theme.colors.secondary};
  font-size: 13px;
  text-align: center;
`;
