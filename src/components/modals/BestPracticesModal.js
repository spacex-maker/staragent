import React, { useState } from 'react';
import { Modal, Tabs, Spin } from 'antd';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    background: ${props => props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .ant-modal-header {
    border-radius: 20px 20px 0 0;
    background: transparent;
    border-bottom: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }

  .ant-tabs-nav::before {
    border-bottom: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }

  .ant-tabs-tab {
    color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
    &:hover {
      color: var(--ant-color-primary);
    }
  }

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: var(--ant-color-primary) !important;
    }
  }
`;

const ContentContainer = styled.div`
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BestPracticesModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('1');

  const items = [
    {
      key: '1',
      label: '基本使用教程',
      children: (
        <ContentContainer>
          <Spin tip="加载中..." />
        </ContentContainer>
      ),
    },
    {
      key: '2',
      label: '最佳实践',
      children: (
        <ContentContainer>
          <Spin tip="加载中..." />
        </ContentContainer>
      ),
    },
  ];

  return (
    <StyledModal
      title="系统使用指南"
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        size="large"
      />
    </StyledModal>
  );
};

export default BestPracticesModal; 