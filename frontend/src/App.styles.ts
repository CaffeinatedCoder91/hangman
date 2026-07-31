import styled from 'styled-components';

export const AppShell = styled.main`
  display: flex;
  min-height: 100vh;
  max-width: 900px;
  margin: 0 auto;
  padding: clamp(16px, 4vw, 40px);
  flex-direction: column;
  gap: 24px;
`;

export const LiveRegion = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
`;
