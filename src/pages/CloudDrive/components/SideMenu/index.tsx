import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  CloudOutlined,
  StarOutlined,
  FolderOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CommentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LockOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import FeedbackModalEntry from 'components/modals/FeedbackModalEntry';
import AboutModal from 'components/modals/AboutModal';
import ProductLogModal from 'components/modals/ProductLogModal';
import { useNavigate } from 'react-router-dom';
import { CollapseTrigger, Overlay } from '../styles/StyledComponents';
import styled from 'styled-components';
import StorageInfo from './StorageInfo';

const { Sider } = Layout;

interface SideMenuProps {
  selectedKeys: string[];
  onSelect: (key: string) => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const StyledSider = styled(Sider)<{ collapsed?: boolean }>`
  background: ${props => props.theme.mode === 'dark' 
    ? '#141414'
    : '#fff'} !important;
  border-right: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.06)'};
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  height: calc(100vh - 64px);
  overflow: auto;
  z-index: 99;

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${props => props.theme.mode === 'dark' 
      ? '#141414'
      : '#fff'};
  }

  @media (max-width: 768px) {
    position: fixed !important;
    z-index: 999;
    height: 100vh !important;
    top: 0;
    left: 0;
    transition: all 0.2s ease-in-out;
    box-shadow: ${props => props.collapsed ? 'none' : '2px 0 8px rgba(0, 0, 0, 0.15)'};
    transform: ${props => props.collapsed ? 'translateX(-100%)' : 'translateX(0)'};
  }
`;

const StyledMenu = styled(Menu)`
  flex: 1;
  border-inline-end: none !important;
  padding: 8px;
  
  .ant-menu-item {
    border-radius: 6px;
    margin: 4px 0 !important;
    
    &:hover {
      background-color: ${props => props.theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)'} !important;
    }
    
    &.ant-menu-item-selected {
      background-color: ${props => props.theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.06)'} !important;
    }
  }
`;

const BottomMenu = styled(Menu)`
  border-inline-end: none !important;
  padding: 8px;
  border-top: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.06)'};
  
  .ant-menu-item {
    border-radius: 6px;
    margin: 4px 0 !important;
    
    &:hover {
      background-color: ${props => props.theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)'} !important;
    }
  }
`;

const SideMenu: React.FC<SideMenuProps> = ({ selectedKeys, onSelect, collapsed, onCollapse }) => {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isProductLogVisible, setIsProductLogVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 769;
      setIsMobile(mobile);
      if (!mobile) {
        onCollapse(false);
      } else {
        onCollapse(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onCollapse]);

  const mainMenuItems = [
    {
      key: 'all',
      icon: <CloudOutlined />,
      label: <FormattedMessage id="sidebar.allFiles" />
    },
    {
      key: 'starred',
      icon: <StarOutlined />,
      label: <FormattedMessage id="sidebar.starred" />
    },
    {
      key: 'folders',
      icon: <FolderOutlined />,
      label: <FormattedMessage id="sidebar.folders" />
    },
    {
      key: 'trash',
      icon: <DeleteOutlined />,
      label: <FormattedMessage id="sidebar.trash" />
    },
    {
      key: 'decrypt',
      icon: <LockOutlined />,
      label: <FormattedMessage id="sidebar.decrypt" />
    }
  ];

  const bottomMenuItems = [
    {
      key: 'productLog',
      icon: <HistoryOutlined />,
      label: <FormattedMessage id="sidebar.productLog" defaultMessage="产品日志" />
    },
    {
      key: 'feedback',
      icon: <CommentOutlined />,
      label: <FormattedMessage id="sidebar.feedback" />
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: <FormattedMessage id="sidebar.about" />
    }
  ];

  const handleMenuSelect = ({ key }: { key: string }) => {
    if (key === 'decrypt') {
      navigate('/decrypt');
      if (isMobile) {
        onCollapse(true);
      }
      return;
    }
    
    if (key === 'about') {
      setIsAboutVisible(true);
      if (isMobile) {
        onCollapse(true);
      }
      return;
    }
    
    if (key === 'feedback') {
      setIsFeedbackVisible(true);
      if (isMobile) {
        onCollapse(true);
      }
      return;
    }

    if (key === 'productLog') {
      setIsProductLogVisible(true);
      if (isMobile) {
        onCollapse(true);
      }
      return;
    }
    
    onSelect(key);
    if (isMobile) {
      onCollapse(true);
    }
  };

  return (
    <>
      <StyledSider width={200} collapsed={collapsed}>
        <StyledMenu
          mode="inline"
          selectedKeys={selectedKeys}
          items={mainMenuItems}
          onSelect={handleMenuSelect}
        />
        <BottomMenu
          mode="inline"
          selectedKeys={[]}
          items={bottomMenuItems}
          onSelect={handleMenuSelect}
        />
        {!collapsed && <StorageInfo />}
      </StyledSider>

      <CollapseTrigger
        onClick={() => onCollapse(!collapsed)}
        collapsed={collapsed}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </CollapseTrigger>

      <Overlay 
        visible={!collapsed && isMobile} 
        onClick={() => onCollapse(true)}
      />

      <FeedbackModalEntry
        open={isFeedbackVisible}
        onClose={() => setIsFeedbackVisible(false)}
      />

      <AboutModal
        open={isAboutVisible}
        onClose={() => setIsAboutVisible(false)}
      />

      <ProductLogModal
        open={isProductLogVisible}
        onClose={() => setIsProductLogVisible(false)}
      />
    </>
  );
};

export default SideMenu; 