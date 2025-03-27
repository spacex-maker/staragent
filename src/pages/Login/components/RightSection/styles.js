import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { slideInFromRight, fadeInScale, marqueeGlow } from '../../styles';

// 社交媒体的品牌颜色
const SOCIAL_COLORS = {
  google: {
    color: '#DB4437',
    hoverColor: '#C13B2F'
  },
  github: {
    color: '#333333',
    hoverColor: '#24292E'
  },
  apple: {
    color: '#000000',
    hoverColor: '#1A1A1A'
  },
  facebook: {
    color: '#4267B2',
    hoverColor: '#385899'
  },
  twitter: {
    color: '#1DA1F2',
    hoverColor: '#1A91DA'
  },
  linkedin: {
    color: '#0077B5',
    hoverColor: '#006399'
  }
};

export const RightSectionWrapper = styled.div`
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
  animation: ${slideInFromRight} 0.8s ease-out;
  
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
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? 'none' 
    : '0 4px 24px rgba(0, 0, 0, 0.08)'};
  animation: ${fadeInScale} 0.8s ease-out 0.5s both;

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
  color: ${props => props.theme.mode === 'dark' ? '#ffffff' : '#000000'};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
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
  color: ${props => props.theme.mode === 'dark' 
    ? '#ffffff' 
    : '#000000'};
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
    ? 'rgba(255, 255, 255, 0.08)' 
    : '#ffffff'};
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'var(--ant-color-border)' 
    : '#e5e7eb'};
  border-radius: 0.5rem;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
    : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  display: none;
  
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

  &:hover {
    background: ${props => props.theme.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'var(--ant-color-primary-bg)'};
    color: var(--ant-color-primary);
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
  position: relative;
  overflow: hidden;

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

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: var(--ant-color-text-quaternary);
  font-size: 0.875rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.mode === 'dark' 
      ? 'var(--ant-color-border)' 
      : '#e5e7eb'};
  }

  span {
    padding: 0 1rem;
  }
`;

export const SocialLogin = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export const SocialButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.socialType ? SOCIAL_COLORS[props.socialType].color : 'transparent'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.25rem;
  opacity: 0;
  animation: ${fadeInScale} 0.5s ease-out forwards;
  animation-delay: ${props => props.index * 0.1 + 0.8}s;

  &:hover {
    background: ${props => props.socialType ? SOCIAL_COLORS[props.socialType].hoverColor : 'transparent'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: var(--ant-color-text-secondary);
  font-size: 0.875rem;

  a {
    color: var(--ant-color-primary);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: var(--ant-color-primary-hover);
    }
  }
`;

export const TermsPrivacyLinks = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--ant-color-text-quaternary);

  a {
    color: var(--ant-color-text-secondary);
    text-decoration: none;
    margin: 0 0.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: var(--ant-color-primary);
    }
  }

  span {
    color: var(--ant-color-text-quaternary);
  }
`;

export const ErrorText = styled.div`
  color: var(--ant-color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export const ForgotPasswordLink = styled(Link)`
  text-align: right;
  font-size: 0.875rem;
  color: var(--ant-color-text-secondary);
  text-decoration: none;
  margin-top: 0.5rem;
  display: block;
  padding: 0.25rem 0;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--ant-color-primary);
  }
`; 