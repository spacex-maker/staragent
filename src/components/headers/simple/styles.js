import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

// 定义跑马灯效果
export const marqueeGlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

// 定义脉冲效果
export const pulseEffect = keyframes`
  0% {
    transform: scale(0.97);
    opacity: 0.8;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.97);
    opacity: 0.8;
  }
`;

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 64px;
  z-index: 1000;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(0, 0, 0, 0.3)'
    : 'rgba(255, 255, 255, 0.3)'};
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  border-bottom: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.scrolled
    ? props.theme.mode === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)'
    : 'none'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(8px) saturate(180%);
    -webkit-backdrop-filter: blur(8px) saturate(180%);
    background: ${props => props.theme.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.15) 100%)'
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.15) 100%)'};
    z-index: -1;
  }

  @supports not (backdrop-filter: blur(8px)) {
    background: ${props => props.theme.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.8)'
      : 'rgba(255, 255, 255, 0.8)'};
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 0 48px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const NavLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ant-color-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.2s;

  &:hover {
    color: var(--ant-color-primary);
    background: var(--ant-color-bg-container);
  }
`;

export const PrimaryLink = styled(NavLink)`
  color: var(--ant-color-text);
  border: 1px solid var(--ant-color-text);
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  height: 36px;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: var(--ant-color-primary);
    background: var(--ant-color-bg-container);
    border-color: var(--ant-color-primary);
  }
`;

export const DarkModeButton = styled.button`
  padding: 0.5rem;
  border-radius: 4px;
  color: var(--ant-color-text);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--ant-color-text-secondary);
    background: var(--ant-color-bg-container);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke-width: 2;
  }
`;

export const LanguageButton = styled.button`
  padding: 0.5rem;
  border-radius: 4px;
  color: var(--ant-color-text);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--ant-color-text-secondary);
    background: var(--ant-color-bg-container);
  }

  .anticon {
    font-size: 1.25rem;
  }
`; 