import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { marqueeGlow, pulseEffect } from './styles';
import UserSettingsModal from '../../modals/UserSettingsModal';
import instance from '../../../api/axios';

const UserMenuContainer = styled.div`
  position: relative;
  display: inline-block;
  margin: 0.5rem 0;
  margin-left: 1.5rem;
`;

const UserButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  border-radius: 50px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;
`;

const ButtonGlow = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50px;
  z-index: -1;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50px;
    background: linear-gradient(
      90deg, 
      transparent 0%, 
      #1890ff 25%, 
      #40a9ff 50%, 
      #1890ff 75%, 
      transparent 100%
    );
    background-size: 200% 100%;
    animation: ${marqueeGlow} 3s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 48px;
    background: ${props => props.isDark ? '#141414' : '#ffffff'};
    z-index: 0;
  }
`;

const GlowOverlay = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50px;
  box-shadow: 0 0 8px 2px rgba(24, 144, 255, 0.3);
  opacity: 0.7;
  z-index: -1;
  animation: ${pulseEffect} 2s ease-in-out infinite;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 38px;
  height: 38px;
  margin-right: 10px;
`;

const UserAvatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 2;
  border: 2px solid transparent;
  box-sizing: border-box;
`;

const AvatarFallback = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  position: relative;
  z-index: 2;
  border: 2px solid transparent;
  box-sizing: border-box;
`;

const StatusIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #52c41a;
  border: 2px solid ${props => props.isDark ? '#141414' : '#ffffff'};
  z-index: 3;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--ant-color-text);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.span`
  font-size: 0.75rem;
  color: var(--ant-color-text-secondary);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserDropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 220px;
  background: ${props => props.isDark ? 'rgba(22, 24, 29, 0.85)' : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: 0 8px 32px ${props => props.isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  display: ${props => props.show ? 'block' : 'none'};
  z-index: 50;
  overflow: hidden;
  padding: 8px;

  &:before {
    content: '';
    position: absolute;
    top: -4px;
    right: 20px;
    width: 8px;
    height: 8px;
    background: ${props => props.isDark ? 'rgba(22, 24, 29, 0.85)' : 'rgba(255, 255, 255, 0.7)'};
    backdrop-filter: blur(10px);
    transform: rotate(45deg);
    border-left: 1px solid ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-top: 1px solid ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    z-index: 1;
  }
`;

const DropdownHeader = styled.div`
  padding: 8px 12px;
  font-weight: 600;
  color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  border-bottom: 1px solid ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  margin-bottom: 8px;
`;

const UserMenuItem = styled.button`
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  font-size: 0.875rem;
  color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.1)'};
    color: ${props => props.isDark ? '#61dafb' : '#3b82f6'};
  }

  .icon {
    margin-right: 10px;
    font-size: 1rem;
    color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'};
  }

  &:hover .icon {
    color: ${props => props.isDark ? '#61dafb' : '#3b82f6'};
  }
`;

const LogoutMenuItem = styled(UserMenuItem)`
  margin-top: 8px;
  border-top: 1px solid ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  padding-top: 12px;
  
  &:hover {
    color: #ff4d4f;
    background: ${props => props.isDark ? 'rgba(255, 77, 79, 0.25)' : 'rgba(255, 77, 79, 0.1)'};
  }
  
  &:hover .icon {
    color: #ff4d4f;
  }
`;

const UserMenu = ({ userInfo, isDark, onLogout }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [localUserInfo, setLocalUserInfo] = useState(userInfo);

  useEffect(() => {
    setLocalUserInfo(userInfo);
  }, [userInfo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    setShowSettingsModal(true);
  };

  const handleSettingsSuccess = async () => {
    try {
      const response = await instance.get('/productx/user/user-detail');
      if (response.data.success) {
        setLocalUserInfo(response.data.data);
        // 更新localStorage中的用户信息
        localStorage.setItem('userInfo', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Failed to fetch updated user info:', error);
    }
  };

  return (
    <UserMenuContainer className="user-menu">
      <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
        <ButtonGlow isDark={isDark} />
        <GlowOverlay />
        <AvatarContainer>
          {localUserInfo.avatar ? (
            <UserAvatar 
              src={localUserInfo.avatar} 
              alt={localUserInfo.username} 
              isDark={isDark}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <AvatarFallback isDark={isDark}>{getInitial(localUserInfo.username)}</AvatarFallback>
          )}
          <StatusIndicator isDark={isDark} />
        </AvatarContainer>
        <UserInfo>
          <UserName>{localUserInfo.username}</UserName>
          <UserEmail>{localUserInfo.email}</UserEmail>
        </UserInfo>
      </UserButton>
      
      <UserDropdown 
        show={showUserMenu} 
        isDark={isDark}
      >
        <DropdownHeader isDark={isDark}>账号</DropdownHeader>
        <UserMenuItem 
          isDark={isDark}
          onClick={() => {
            setShowUserMenu(false);
            navigate('/profile');
          }}
        >
          <i className="bi bi-person icon" />
          个人中心
        </UserMenuItem>
        <UserMenuItem 
          isDark={isDark}
          onClick={handleSettingsClick}
        >
          <i className="bi bi-gear icon" />
          账号设置
        </UserMenuItem>
        <LogoutMenuItem 
          isDark={isDark}
          onClick={() => {
            setShowUserMenu(false);
            onLogout();
          }}
        >
          <i className="bi bi-box-arrow-right icon" />
          退出登录
        </LogoutMenuItem>
      </UserDropdown>

      <UserSettingsModal
        open={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSuccess={handleSettingsSuccess}
      />
    </UserMenuContainer>
  );
};

export default UserMenu; 