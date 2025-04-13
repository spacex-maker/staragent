import React, { useState } from 'react';
import { Space } from 'antd';
import { 
  RocketOutlined, 
  ProjectOutlined, 
  RobotOutlined, 
  MessageOutlined, 
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import SimpleHeader from '../../components/headers/simple';

// 导入样式组件
import {
  PageContainer,
  ContentContainer,
  HeaderTitle,
  StyledTabs,
} from './components/StyledComponents';

// 导入标签页组件
import GetStartedTab from './components/GetStartedTab';
import ProjectsTab from './components/ProjectsTab';
import AgentsTab from './components/AgentsTab';
import ChatTipsTab from './components/ChatTipsTab';

const { TabPane } = StyledTabs;

const UserGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  
  return (
    <PageContainer>
      <SimpleHeader />
      <ContentContainer>
        <HeaderTitle level={2}>
          <FormattedMessage id="userGuide.title" defaultMessage="AI助手使用指南" />
        </HeaderTitle>
        
        <StyledTabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          tabPosition="top" 
          size="large"
          centered
        >
          <TabPane 
            tab={
              <Space>
                <RocketOutlined />
                <FormattedMessage id="userGuide.tab.getStarted" defaultMessage="快速开始" />
              </Space>
            } 
            key="1"
          >
            <GetStartedTab />
          </TabPane>
          
          <TabPane 
            tab={
              <Space>
                <ProjectOutlined />
                <FormattedMessage id="userGuide.tab.projects" defaultMessage="项目管理" />
              </Space>
            } 
            key="2"
          >
            <ProjectsTab />
          </TabPane>
          
          <TabPane 
            tab={
              <Space>
                <RobotOutlined />
                <FormattedMessage id="userGuide.tab.agents" defaultMessage="AI助手" />
              </Space>
            } 
            key="3"
          >
            <AgentsTab />
          </TabPane>
          
          <TabPane 
            tab={
              <Space>
                <MessageOutlined />
                <FormattedMessage id="userGuide.tab.chat" defaultMessage="对话技巧" />
              </Space>
            } 
            key="4"
          >
            <ChatTipsTab />
          </TabPane>
        </StyledTabs>
      </ContentContainer>
    </PageContainer>
  );
};

export default UserGuide; 