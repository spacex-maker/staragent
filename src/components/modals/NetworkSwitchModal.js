import React from 'react';
import { Modal, Space } from 'antd';
import styled from 'styled-components';
import { GlobalOutlined } from '@ant-design/icons';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    background: ${props => props.theme.mode === 'dark' ? 'rgba(17, 25, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(12px);
    border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
    padding: 24px;
    border-radius: 20px 20px 0 0;
  }

  .ant-modal-title {
    color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ant-modal-body {
    padding: 24px;
  }

  .ant-modal-close {
    color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'};
    
    &:hover {
      color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
    }
  }
`;

const NetworkCard = styled.div`
  position: relative;
  padding: 20px;
  border-radius: 16px;
  background: ${props => props.theme.mode === 'dark' 
    ? props.isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'
    : props.isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.02)'
  };
  border: 2px solid ${props => props.isSelected 
    ? 'var(--ant-color-primary)' 
    : props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
  };
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--ant-color-primary);
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(59, 130, 246, 0.08)'
    };
  }
`;

const NetworkTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NetworkDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'};
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.isSelected
    ? props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.15)'
    : props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
  };
  color: ${props => props.isSelected
    ? 'var(--ant-color-primary)'
    : props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'
  };
`;

const NetworkSwitchModal = ({ open, onClose, currentNetwork, onNetworkChange }) => {
  return (
    <StyledModal
      title={
        <>
          <GlobalOutlined style={{ fontSize: '20px' }} />
          切换网络
        </>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <NetworkCard 
          isSelected={currentNetwork === 'china'} 
          onClick={() => onNetworkChange('china')}
        >
          <StatusBadge isSelected={currentNetwork === 'china'}>
            {currentNetwork === 'china' ? '当前使用中' : '点击切换'}
          </StatusBadge>
          <NetworkTitle>
            <span>🇨🇳</span>
            中国节点
          </NetworkTitle>
          <NetworkDescription>
            中国大陆地区优化线路，访问速度更快
          </NetworkDescription>
        </NetworkCard>

        <NetworkCard 
          isSelected={currentNetwork === 'usa'} 
          onClick={() => onNetworkChange('usa')}
        >
          <StatusBadge isSelected={currentNetwork === 'usa'}>
            {currentNetwork === 'usa' ? '当前使用中' : '点击切换'}
          </StatusBadge>
          <NetworkTitle>
            <span>🇺🇸</span>
            美国节点
          </NetworkTitle>
          <NetworkDescription>
            海外优化线路，无地域限制访问
          </NetworkDescription>
        </NetworkCard>
      </Space>
    </StyledModal>
  );
};

export default NetworkSwitchModal; 