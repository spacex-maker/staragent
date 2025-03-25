import React from 'react';
import styled from 'styled-components';

interface IconConfig {
  gradient: [string, string];
  paths: string[];
}

const iconConfigs: Record<string, IconConfig> = {
  'ENFJ': {
    gradient: ['#FF6B6B', '#FFE66D'],
    paths: [
      'M16 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
      'M23 14h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM11 14H9c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM16 19c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'
    ]
  },
  'ENFP': {
    gradient: ['#FF9A9E', '#FAD0C4'],
    paths: [
      'M16 8l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z',
      'M23 14c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z'
    ]
  },
  'ENTJ': {
    gradient: ['#FF4B2B', '#FF416C'],
    paths: [
      'M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z',
      'M20.1 13.9l-5.1 5.1-2.1-2.1c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l2.8 2.8c.2.2.5.3.7.3s.5-.1.7-.3l5.8-5.8c.4-.4.4-1 0-1.4s-1-.4-1.4 0z'
    ]
  },
  'ENTP': {
    gradient: ['#FD6585', '#FFD3A5'],
    paths: [
      'M20 12.2L16 8l-4 4.2V24h8V12.2zM18 22h-4v-9.2l2-2.1 2 2.1V22z',
      'M23 14l-3 3 3 3M9 14l3 3-3 3'
    ]
  },
  'INFJ': {
    gradient: ['#4B79A1', '#283E51'],
    paths: [
      'M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z',
      'M16 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'
    ]
  },
  'INFP': {
    gradient: ['#A8C0FF', '#3F2B96'],
    paths: [
      'M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z',
      'M16 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'
    ]
  },
  'INTJ': {
    gradient: ['#0F2027', '#2C5364'],
    paths: [
      'M20 12l-4-4-4 4v12h8V12zm-2 10h-4v-9.2l2-2.1 2 2.1V22z',
      'M12 8h8M12 24h8'
    ]
  },
  'INTP': {
    gradient: ['#4B6CB7', '#182848'],
    paths: [
      'M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z',
      'M16 12v8M12 16h8'
    ]
  },
  'ESFJ': {
    gradient: ['#FF8008', '#FFC837'],
    paths: [
      'M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z',
      'M16 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'
    ]
  },
  'ESFP': {
    gradient: ['#FFE000', '#FF8C00'],
    paths: [
      'M16 8l2.4 7.4h7.8l-6.3 4.6 2.4 7.4-6.3-4.6-6.3 4.6 2.4-7.4-6.3-4.6h7.8z',
      'M16 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'
    ]
  },
  'ESTJ': {
    gradient: ['#F7971E', '#FFD200'],
    paths: [
      'M20 12l-4-4-4 4v12h8V12zm-2 10h-4v-9.2l2-2.1 2 2.1V22z',
      'M12 8h8M12 24h8'
    ]
  },
  'ESTP': {
    gradient: ['#FF512F', '#FF9A44'],
    paths: [
      'M16 8l4 4-4 4-4-4 4-4zm0 2.8L14.8 12l1.2 1.2 1.2-1.2L16 10.8zM12 16l4 4 4-4-4-4-4 4zm4 1.2L14.8 16l1.2-1.2 1.2 1.2L16 17.2z',
      'M8 8h16M8 24h16'
    ]
  },
  'ISFJ': {
    gradient: ['#56CCF2', '#2F80ED'],
    paths: [
      'M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z',
      'M16 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'
    ]
  },
  'ISFP': {
    gradient: ['#00B4DB', '#0083B0'],
    paths: [
      'M20 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
      'M12 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'
    ]
  },
  'ISTJ': {
    gradient: ['#1488CC', '#2B32B2'],
    paths: [
      'M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z',
      'M16 12v8M12 16h8'
    ]
  },
  'ISTP': {
    gradient: ['#3494E6', '#EC6EAD'],
    paths: [
      'M20 12l-4-4-4 4 4 4 4-4zm-4 1.2L14.8 12l1.2-1.2 1.2 1.2L16 13.2z',
      'M12 16l4 4 4-4-4-4-4 4zm4 1.2L14.8 16l1.2-1.2 1.2 1.2L16 17.2z'
    ]
  }
};

const IconWrapper = styled.div<{ size?: number }>`
  width: ${props => props.size || 32}px;
  height: ${props => props.size || 32}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

interface MBTIIconProps {
  type: string;
  size?: number;
  className?: string;
}

const MBTIIcon: React.FC<MBTIIconProps> = ({ type, size = 32, className }) => {
  const config = iconConfigs[type];
  if (!config) return null;

  const [gradientStart, gradientEnd] = config.gradient;
  const gradientId = `mbti-gradient-${type}`;

  return (
    <IconWrapper size={size} className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="16" fill={`url(#${gradientId})`} />
        {config.paths.map((path, index) => (
          <path
            key={index}
            d={path}
            fill="#FFFFFF"
            fillOpacity={index === 0 ? 0.9 : 0.7}
          />
        ))}
      </svg>
    </IconWrapper>
  );
};

export default MBTIIcon; 