import styled from 'styled-components';
import { theme } from '../../styles/theme';

const panel = `background:${theme.colors.panel};border:3px solid ${theme.colors.border};border-radius:8px;box-shadow:6px 6px 0 rgb(0 0 0 / 12%);padding:20px;`;
export const GameGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;align-items:stretch;`;
export const SidePanel = styled.section`${panel} display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:16px;`;
export const Card = styled.section`${panel} display:flex;flex-direction:column;gap:16px;`;
export const Attempts = styled.div<{ $tone: 'safe' | 'warning' | 'danger' }>`font-family:${theme.fonts.display};font-size:clamp(14px,3vw,18px);color:${({ $tone }) => $tone === 'danger' ? theme.colors.magenta : $tone === 'warning' ? theme.colors.yellow : theme.colors.cyan};`;
export const MissedHeading = styled.div`margin-bottom:6px;color:${theme.colors.secondary};font-size:11px;letter-spacing:1px;`;
export const MissedChips = styled.div`display:flex;min-height:32px;flex-wrap:wrap;gap:6px;`;
export const MissedChip = styled.span`display:inline-flex;min-width:28px;height:28px;align-items:center;justify-content:center;border:2px solid ${theme.colors.magenta};border-radius:4px;background:oklch(90% 0.10 20);color:oklch(40% 0.20 20);font-size:14px;font-weight:700;`;
export const PanelMeta = styled.div`display:flex;flex-wrap:wrap;align-items:center;gap:10px;`;
export const Category = styled.span`border-radius:4px;background:${theme.colors.purple};color:${theme.colors.panel};padding:6px 10px;font-family:${theme.fonts.display};font-size:11px;letter-spacing:1px;`;
export const Hint = styled.span`color:${theme.colors.secondary};font-size:13px;`;
export const Banner = styled.div<{ $status: 'won' | 'lost' }>`display:flex;flex-direction:column;gap:2px;border-radius:6px;padding:14px 16px;background:${({ $status }) => $status === 'won' ? 'oklch(80% 0.24 90)' : 'oklch(78% 0.20 25)'};animation:pop-in .3s ease-out;strong{font-family:${theme.fonts.display};font-size:clamp(14px,3vw,18px);}span{font-size:13px;}@keyframes pop-in{from{opacity:0;transform:scale(.85) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`;
export const NewGameButton = styled.button`align-self:center;margin-top:auto;padding:14px 28px;border:0;border-radius:6px;background:${theme.colors.cyan};color:${theme.colors.panel};box-shadow:4px 4px 0 rgb(0 0 0 / 15%);cursor:pointer;font-family:${theme.fonts.display};font-size:13px;&:active{transform:translate(3px,3px);box-shadow:none;}`;
