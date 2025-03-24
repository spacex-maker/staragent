import styled, { keyframes } from 'styled-components';

// 动画效果
export const marqueeGlow = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

export const sendingPulse = keyframes`
  0% {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-50%) scale(0.95);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
`;

export const glowRipple = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

// 页面容器
export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${props => props.theme.mode === 'dark' 
    ? 'var(--ant-color-bg-container)' 
    : '#f5f7fa'};
`;

// 顶部控制区
export const TopRightControls = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 1rem;
  z-index: 10;
`;

export const IconButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(0, 0, 0, 0.06)'};
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.04)' 
    : '#ffffff'};
  color: var(--ant-color-text-secondary);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: var(--ant-color-primary);
    border-color: var(--ant-color-primary);
    background: var(--ant-color-primary-bg);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

// 右侧区域
export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: ${props => props.theme.mode === 'dark' 
    ? 'var(--ant-color-bg-container)' 
    : '#ffffff'};
`;

export const ResetBox = styled.div`
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
`;

export const Logo = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--ant-color-text);
`;

// 表单相关
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
  font-size: 0.875rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: var(--ant-color-primary);
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

// 按钮相关
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
  border-radius: 0.5rem;
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

  a {
    color: var(--ant-color-primary);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: var(--ant-color-primary-hover);
    }
  }
`;

// 邮箱后缀相关
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