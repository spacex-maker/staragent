import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const glowPulse = keyframes`
  0% {
    filter: drop-shadow(0 0 8px var(--ant-color-primary))
           drop-shadow(0 0 16px var(--ant-color-primary));
    opacity: 0.15;
  }
  50% {
    filter: drop-shadow(0 0 16px var(--ant-color-primary))
           drop-shadow(0 0 32px var(--ant-color-primary));
    opacity: 0.25;
  }
  100% {
    filter: drop-shadow(0 0 8px var(--ant-color-primary))
           drop-shadow(0 0 16px var(--ant-color-primary));
    opacity: 0.15;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 8px;
  transition: transform 0.2s ease;
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-1px);
  }
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
`;

const BrandText = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--ant-color-text);
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 1.35rem;
    
    .full-name {
      display: none;
    }
    
    .short-name {
      display: block;
    }
  }

  @media (min-width: 769px) {
    .full-name {
      display: block;
    }
    
    .short-name {
      display: none;
    }
  }
`;

const StarIcon = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  color: var(--ant-color-primary);
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const Logo = () => {
  return (
    <LogoLink to="/">
      <BrandContainer>
        <StarIcon>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </StarIcon>
        <BrandText>
          <span className="full-name">StarAgent</span>
          <span className="short-name">SA</span>
        </BrandText>
      </BrandContainer>
    </LogoLink>
  );
};

export default Logo; 