import styled, { keyframes } from 'styled-components';

const textReveal = keyframes`
  0% {
    clip-path: inset(0 0 0 100%);
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  100% {
    clip-path: inset(0 0 0 0);
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const PhilosophyQuoteWrapper = styled.div`
  position: fixed;
  bottom: 3.5rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  color: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.75)' 
    : 'rgba(0, 0, 0, 0.65)'};
  font-style: italic;
  padding: 0.75rem 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  z-index: 10;
  white-space: nowrap;

  span {
    display: inline-block;
    animation: ${textReveal} 0.5s ease-out forwards;
    opacity: 0;
  }

  span:nth-child(1) { animation-delay: 1.2s; }
  span:nth-child(2) { animation-delay: 1.3s; }
  span:nth-child(3) { animation-delay: 1.4s; }
  span:nth-child(4) { animation-delay: 1.5s; }
  span:nth-child(5) { animation-delay: 1.6s; }
  span:nth-child(6) { animation-delay: 1.7s; }
  span:nth-child(7) { animation-delay: 1.8s; }
  span:nth-child(8) { animation-delay: 1.9s; }
  span:nth-child(9) { animation-delay: 2.0s; }
  
  @media (max-width: 768px) {
    bottom: 2.5rem;
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
`;

export const PoweredByWrapper = styled.div`
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: var(--ant-color-text-quaternary);
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(10px);
  z-index: 10;
  white-space: nowrap;
  
  .team-name {
    color: var(--ant-color-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0 2px;
    
    &:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
  }
  
  @media (max-width: 768px) {
    bottom: 0.5rem;
    font-size: 0.7rem;
    padding: 0.25rem 0.75rem;
  }
  
  .version {
    margin-top: 0.25rem;
    opacity: 0.7;
    font-size: 0.7rem;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

export const TeamMembersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`;

export const TeamMemberCard = styled.div`
  position: relative;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateX(4px);
    
    .hover-effect {
      opacity: 1;
    }
  }

  .content {
    position: relative;
    z-index: 2;
  }

  .name {
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    margin-bottom: 4px;
  }

  .role {
    color: var(--ant-color-primary);
    font-size: 0.75rem;
    font-weight: 500;
    opacity: 0.9;
    letter-spacing: 0.01em;
  }

  .hover-effect {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
`;

export const JoinTeamCard = styled.div`
  position: relative;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(var(--ant-primary-rgb), 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;

  &:hover {
    background: rgba(var(--ant-primary-rgb), 0.25);
    transform: translateX(4px);
    
    .hover-effect {
      opacity: 1;
    }

    .mail-icon {
      transform: translateY(-2px);
    }
  }

  .mail-icon {
    font-size: 16px;
    color: var(--ant-color-primary);
    transition: transform 0.3s ease;
  }

  .text {
    color: var(--ant-color-primary);
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .hover-effect {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(var(--ant-primary-rgb), 0.1),
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
`;

export const EmailInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0 4px;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  .icon {
    font-size: 12px;
    color: var(--ant-color-text-quaternary);
  }

  .email {
    font-size: 12px;
    color: var(--ant-color-text-quaternary);
    font-family: monospace;
    letter-spacing: 0.02em;
  }
`; 