import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, message } from 'antd';
import { LoadingOutlined, CheckCircleFilled } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import instance from '../../api/axios';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(var(--ant-color-primary-rgb), 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(var(--ant-color-primary-rgb), 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(var(--ant-color-primary-rgb), 0);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const CallbackContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.mode === 'dark' 
    ? 'linear-gradient(45deg, #1a1a1a 0%, #2d3748 100%)'
    : 'linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 100%)'};
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  position: relative;
  overflow: hidden;
`;

const LoadingCard = styled.div`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: ${props => props.theme.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)'};
  animation: ${floatAnimation} 3s ease-in-out infinite;
`;

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 48px;
  color: var(--ant-color-primary);
  animation: ${pulseAnimation} 2s infinite;
`;

const LoadingText = styled.div`
  margin-top: 20px;
  color: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.85)'
    : 'rgba(0, 0, 0, 0.85)'};
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const StatusText = styled.div`
  color: var(--ant-color-text-secondary);
  font-size: 14px;
  margin-top: 8px;
`;

const BackgroundCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: var(--ant-color-primary);
  opacity: 0.1;
  
  &:nth-child(1) {
    width: 300px;
    height: 300px;
    top: -150px;
    left: -150px;
  }
  
  &:nth-child(2) {
    width: 200px;
    height: 200px;
    bottom: -100px;
    right: -100px;
  }
`;

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code) {
        message.error('授权失败，缺少必要参数');
        navigate('/login');
        return;
      }

      try {
        const response = await instance.post('/base/productx/auth/google/handle-auth', {
          code,
          state
        });

        if (response.data.success) {
          // 存储token
          localStorage.setItem('token', response.data.data);
          message.success('Google登录成功');
          navigate('/');
        } else {
          throw new Error(response.data.message || '登录失败');
        }
      } catch (error: any) {
        message.error(error.message || 'Google登录失败，请重试');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <CallbackContainer>
      <BackgroundCircle />
      <BackgroundCircle />
      <LoadingCard>
        <LoadingIcon />
        <LoadingText>正在登录中</LoadingText>
        <StatusText>正在验证您的身份...</StatusText>
      </LoadingCard>
    </CallbackContainer>
  );
};

export default OAuthCallback; 