import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
  position: relative;
  z-index: 2;
`;

const BrandText = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  color: ${props => props.theme.mode === 'dark' ? '#FFFFFF' : '#000000'};
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;

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

const Logo = () => {
  return (
    <LogoLink to="/">
      <BrandContainer>
        <BrandText>
          <span className="full-name">AI MateX</span>
          <span className="short-name">AM</span>
        </BrandText>
      </BrandContainer>
    </LogoLink>
  );
};

export default Logo; 