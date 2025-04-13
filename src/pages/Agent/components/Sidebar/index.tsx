import React, { useState } from 'react';
import { Tabs } from 'antd';
import styled from 'styled-components';
import ProjectListTab from '../ProjectListTab';
import AIAgentListTab from '../AIAgentListTab';
import { Project } from '../../types';
import { FormattedMessage, useIntl } from 'react-intl';

interface StyledSidebarProps {
  $collapsed: boolean;
}

interface StyledContentProps {
  $collapsed: boolean;
}

const SidebarContainer = styled.div`
  height: 100%;
  width: 300px;
  display: flex;
  flex-direction: column;
  background: var(--ant-color-bg-container);
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
`;

const StyledTabs = styled(Tabs)`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 300px;
  
  .ant-tabs-nav {
    margin: 0;
    padding: 0 16px;
    background: var(--ant-color-bg-container);
    border-bottom: 1px solid var(--ant-color-border);
    flex-shrink: 0;
    width: 300px;
    
    &::before {
      display: none;
    }

    .ant-tabs-nav-list {
      gap: 24px;
    }

    .ant-tabs-tab {
      padding: 16px 0;
      margin: 0;
      font-size: 14px;
      height: 64px;
      display: flex;
      align-items: center;
      
      &:hover {
        color: var(--ant-color-primary);
      }
      
      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        font-weight: 600;
      }
    }

    .ant-tabs-ink-bar {
      height: 2px;
    }
  }

  .ant-tabs-content-holder {
    flex: 1;
    overflow: hidden;
    height: calc(100% - 64px);
    width: 300px;
  }

  .ant-tabs-content {
    height: 100%;
    width: 300px;
  }

  .ant-tabs-tabpane {
    height: 100%;
    padding: 0;
    width: 300px;
  }
`;

const SidebarContent = styled.div<StyledContentProps>`
  height: 100%;
  width: ${props => props.$collapsed ? '0' : '300px'};
  position: relative;
  overflow: hidden;
  transition: width 0.3s ease-in-out;
`;

const SidebarWrapper = styled.div<StyledSidebarProps>`
  width: ${props => props.$collapsed ? '0' : '300px'};
  height: 100%;
  background: var(--ant-color-bg-container);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: width 0.3s ease-in-out;
  position: relative;
  flex-shrink: 0;
  overflow: visible;
  z-index: 2;
  
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 64px;
    bottom: 0;
    z-index: 1000;
    width: 300px;
    transform: translateX(${props => props.$collapsed ? '-100%' : '0'});
  }

  /* 当宽度小于完全展开时隐藏内容 */
  &[style*="width:"] {
    ${SidebarContent} {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0s, visibility 0s;
    }
  }

  /* 当完全展开时显示内容 */
  &[style*="width: 300px"] {
    ${SidebarContent} {
      opacity: 1;
      visibility: visible;
      transition: opacity 0.2s ease-in-out 0.3s, visibility 0.2s ease-in-out 0.3s;
    }
  }
`;

const SidebarResizer = styled.div<{ $collapsed: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -12px;
  width: 4px;
  height: 80px;
  background-color: ${props => props.theme.mode === 'dark' ? '#ffffff' : '#000000'};
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.2s ease-in-out;
  opacity: 0.8;
  pointer-events: auto;
  display: block !important;
  
  &:hover {
    opacity: 1;
  }

  &:after {
    content: '';
    position: absolute;
    left: -4px;
    right: -4px;
    top: 0;
    bottom: 0;
  }
`;

const Mask = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
  display: ${props => props.visible ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onProjectSelect: (project: Project) => void;
  onProjectCreate: (values: any) => Promise<void>;
  onProjectUpdate: (projectId: string, values: any) => Promise<void>;
  onProjectDelete: (projectId: string) => Promise<void>;
  defaultActiveKey?: string;
  activeKey?: string;
  onTabChange?: (key: string) => void;
  autoTriggerAddAgent?: boolean;
  loading?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
  defaultActiveKey = 'projects',
  activeKey,
  onTabChange,
  autoTriggerAddAgent = false,
  loading = false,
}) => {
  const intl = useIntl();
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);

  // 监听窗口大小变化
  React.useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleMaskClick = () => {
    setCollapsed(true);
  };

  const items = [
    {
      key: 'projects',
      label: <FormattedMessage id="sidebar.projects" defaultMessage="项目列表" />,
      children: (
        <ProjectListTab
          projects={projects}
          activeProjectId={activeProjectId}
          onProjectSelect={onProjectSelect}
          onProjectCreate={onProjectCreate}
          onProjectUpdate={onProjectUpdate}
          onProjectDelete={onProjectDelete}
          loading={loading}
        />
      ),
    },
    {
      key: 'agents',
      label: <FormattedMessage id="sidebar.agents" defaultMessage="AI助手" />,
      children: (
        <AIAgentListTab
          autoTriggerAddAgent={autoTriggerAddAgent}
        />
      ),
    },
  ];

  return (
    <>
      <SidebarWrapper $collapsed={collapsed}>
        <SidebarContent $collapsed={collapsed}>
          <SidebarContainer>
            <StyledTabs
              items={items}
              activeKey={activeKey || defaultActiveKey}
              onChange={onTabChange}
              animated={{ tabPane: true }}
            />
          </SidebarContainer>
        </SidebarContent>
        <SidebarResizer 
          $collapsed={collapsed}
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
          title={collapsed 
            ? intl.formatMessage({ id: 'sidebar.expand', defaultMessage: '展开侧边栏' }) 
            : intl.formatMessage({ id: 'sidebar.collapse', defaultMessage: '收起侧边栏' })
          }
        />
      </SidebarWrapper>
      <Mask visible={!collapsed && window.innerWidth <= 768} onClick={handleMaskClick} />
    </>
  );
};

export default Sidebar; 