import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { slideInFromRight, fadeInScale, marqueeGlow, sendingPulse, glowRipple } from '../../styles';

const slideUpFade = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: ${props => props.theme.mode === 'dark' 
    ? '#1f1f1f'
    : '#ffffff'};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  animation: ${slideInFromRight} 0.8s ease-out forwards;
  
  @media (max-width: 768px) {
    padding: 1rem;
    justify-content: flex-start;
    padding-top: 4rem;
  }
`;

export const LoginBox = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  background: ${props => props.theme.mode === 'dark' 
    ? 'transparent' 
    : '#ffffff'};
  border-radius: 1rem;
  box-shadow: none;
  opacity: 0;
  animation: ${slideUpFade} 0.8s ease-out forwards;
  animation-delay: 0.3s;

  @media (max-width: 768px) {
    padding: 1.5rem;
    box-shadow: none;
  }
`;

export const Logo = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--ant-color-text);
  opacity: 0;
  animation: ${slideUpFade} 0.8s ease-out forwards;
  animation-delay: 0.1s;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
`;

export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  animation: ${slideUpFade} 0.8s ease-out forwards;
  animation-delay: ${props => 0.4 + props.index * 0.1}s;
  position: relative;

  &:focus-within {
    z-index: 1000;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'var(--ant-color-border)' 
    : '#e5e7eb'};
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.04)' 
    : '#f9fafb'};
  color: var(--ant-color-text);
  font-size: 1rem;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 16px;
  }

  &:focus {
    outline: none;
    border-color: transparent;
    background: ${props => props.theme.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.04)' 
      : '#ffffff'};
  }

  &::placeholder {
    color: ${props => props.theme.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.25)' 
      : 'rgba(0, 0, 0, 0.25)'};
  }
`;

export const BorderGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 9999px;
  pointer-events: none;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    border-radius: inherit;
    background: linear-gradient(
      90deg, 
      transparent 0%, 
      #1890ff 25%, 
      #40a9ff 50%, 
      #1890ff 75%, 
      transparent 100%
    );
    background-size: 200% 100%;
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: 
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    animation: ${marqueeGlow} 3s linear infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &.active::before {
    opacity: 1;
  }
`;

export const EmailSuffixButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--ant-color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 3;

  &:hover {
    color: var(--ant-color-text);
  }
`;

export const EmailSuffixDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(31, 31, 31, 0.8)'
    : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 0.75rem;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)'};
  max-height: 200px;
  overflow-y: auto;
  z-index: 99999;
  display: none;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.3)'
        : 'rgba(0, 0, 0, 0.3)'};
    }
  }
  
  &.show {
    display: block;
  }
`;

export const EmailSuffixOption = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  color: var(--ant-color-text);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;

  &:hover {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.08)'};
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--ant-color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-size: 1.1rem;
  z-index: 3;
  
  &:hover {
    color: var(--ant-color-text);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  border-radius: 9999px;
  border: none;
  background: var(--ant-color-primary);
  color: ${props => props.theme.mode === 'dark' ? '#ffffff' : '#000000'};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;

  &:hover {
    background: var(--ant-color-primary-hover);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.div`
  color: var(--ant-color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: var(--ant-color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 6rem;
  position: relative;
  z-index: 20;

  @media (max-width: 768px) {
    margin-bottom: 7rem;
  }

  a {
    color: var(--ant-color-primary);
    text-decoration: none;
    font-weight: 500;
    position: relative;
    z-index: 20;

    &:hover {
      color: var(--ant-color-primary-hover);
    }
  }
`;

export const CountrySelector = styled.div.attrs({ tabIndex: 0 })`
  width: 100%;
  height: 50px;
  border-radius: 9999px;
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'var(--ant-color-border)' 
    : '#e5e7eb'};
  background: transparent !important;
  color: var(--ant-color-text);
  font-size: 0.875rem;
  transition: all 0.3s;
  position: relative;
  z-index: 1000;
  cursor: pointer;
  display: flex;
  align-items: center;
  outline: none;

  &:hover {
    border-color: var(--ant-color-primary);
  }

  &:focus-within {
    z-index: 1001;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: transparent !important;
    pointer-events: none;
  }
`;

export const SelectedCountryContent = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  gap: 12px;
  color: var(--ant-color-text);
  background: transparent !important;
  z-index: 2;
  position: relative;
  width: 100%;
  
  &.placeholder {
    color: #8E99AB;
  }

  span {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 1;
    transform: translateY(0);
  }

  &.changing {
    span {
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: transparent !important;
    pointer-events: none;
  }
`;

export const CountryFlag = styled.img`
  width: 28px;
  height: 21px;
  margin-right: 12px;
  border-radius: 4px;
  object-fit: cover;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.changing {
    opacity: 0;
    transform: scale(0.8);
  }
`;

export const CountryDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(31, 31, 31, 0.8)'
    : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 0.75rem;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)'};
  max-height: 200px;
  overflow-y: auto;
  z-index: 99999;
  display: none;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.3)'
        : 'rgba(0, 0, 0, 0.3)'};
    }
  }
  
  &.show {
    display: block;
  }
`;

export const CountryOption = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  color: var(--ant-color-text);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${fadeScale} 0.2s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.03}s;

  &:hover {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.08)'};
    transform: scale(0.98);
  }
`;

export const CountryOptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

export const VerifyCodeButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--ant-color-primary);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  transition: all 0.3s;
  z-index: 3;
  border-radius: 4px;

  &:disabled {
    color: var(--ant-color-text-disabled);
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    color: var(--ant-color-primary-hover);
  }

  &.sending {
    animation: ${sendingPulse} 1.5s ease-in-out infinite;
    background: var(--ant-color-primary);
    color: white;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--ant-color-primary);
      animation: ${glowRipple} 1.5s ease-out infinite;
      z-index: -1;
    }
  }
`;

export const RuleHint = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.65)' 
    : 'rgba(0, 0, 0, 0.65)'};
  margin-top: 0.25rem;
  padding: 0.75rem 1.25rem;
  position: absolute;
  left: 0;
  right: 0;
  background: ${props => props.theme.mode === 'dark' 
    ? '#1f1f1f' 
    : '#ffffff'};
  border: 1px solid ${props => props.theme.mode === 'dark'
    ? '#303030'
    : '#d9d9d9'};
  border-radius: 15px;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
    : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
  
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(100% + 8px);
    transform: translateY(10px);
    border-radius: 15px;
    background: ${props => props.theme.mode === 'dark' 
      ? 'rgba(31, 31, 31, 0.98)' 
      : 'rgba(255, 255, 255, 0.98)'};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'};
    box-shadow: ${props => props.theme.mode === 'dark' 
      ? '0 -4px 20px rgba(0, 0, 0, 0.4)' 
      : '0 -4px 20px rgba(0, 0, 0, 0.15)'};
    margin: 0;
    
    &.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &.valid {
      color: var(--ant-color-success);
    }
    
    &.invalid {
      color: var(--ant-color-error);
    }
  }
  
  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`; 