import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; min-width: 320px; background: ${theme.colors.page}; color: ${theme.colors.dark}; font-family: ${theme.fonts.body}; }
  button { font: inherit; }
  button:focus-visible { outline: 3px solid ${theme.colors.purple}; outline-offset: 3px; }
`;

export default GlobalStyle;
