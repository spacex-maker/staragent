import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, List, Avatar, Typography } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import SimpleHeader from '../../components/headers/simple';
import ProjectList from './components/ProjectList';
import { Message, Project } from './types';

const { Content, Footer } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

const StyledLayout = styled(Layout)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const MainContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  margin-top: 64px;
  position: relative;
  overflow: hidden;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--ant-color-bg-container);
  min-width: 0;
  overflow: hidden;
`;

const StyledContent = styled(Content)`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledFooter = styled(Footer)`
  background: var(--ant-color-bg-container);
  border-top: 1px solid var(--ant-color-border);
  padding: 16px 24px;
  width: 100%;
`;

const MessageList = styled(List<Message>)`
  flex: 1;
  padding: 0 24px;
  width: 100%;
`;

const MessageItem = styled(List.Item)`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  background: var(--ant-color-bg-container);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  width: 100%;
  
  .ant-input-textarea {
    flex: 1;
    min-width: 0;
  }
  
  .ant-btn {
    flex-shrink: 0;
  }
`;

const Sidebar = styled.div<{ collapsed: boolean }>`
  width: ${props => props.collapsed ? '0' : '300px'};
  height: 100%;
  background: ${props => props.theme.token?.colorBgContainer};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.2s ease-in-out;
  position: relative;
  flex-shrink: 0;
  overflow: visible;
  
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 64px;
    bottom: 0;
    z-index: 1000;
    width: 300px;
    transform: translateX(${props => props.collapsed ? '-100%' : '0'});
  }
`;

const SidebarContent = styled.div<{ collapsed: boolean }>`
  width: 300px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateX(${props => props.collapsed ? '-300px' : '0'});
  transition: transform 0.2s ease-in-out;
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
  z-index: 10000;
  transition: all 0.2s ease-in-out;
  opacity: 0.8;
  
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

const AgentPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !activeProjectId) return;

    const newMessage: Message = {
      type: 'user',
      content: inputValue,
      projectId: activeProjectId,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse: Message = {
        type: 'assistant',
        content: '这是一个模拟的AI响应消息。在实际应用中，这里应该调用真实的AI API。',
        projectId: activeProjectId,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleProjectCreate = (project: Project) => {
    setProjects(prev => [...prev, project]);
    setActiveProjectId(project.id);
  };

  const handleProjectUpdate = (projectId: string, project: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, ...project, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const handleProjectDelete = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
    }
  };

  const filteredMessages = messages.filter(msg => msg.projectId === activeProjectId);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // 在移动端点击遮罩时收起侧边栏
  const handleMaskClick = () => {
    setCollapsed(true);
  };

  return (
    <StyledLayout>
      <SimpleHeader />
      
      <MainContainer>
        <Sidebar collapsed={collapsed}>
          <SidebarContent collapsed={collapsed}>
            <ProjectList
              projects={projects}
              activeProjectId={activeProjectId}
              onProjectSelect={setActiveProjectId}
              onProjectCreate={handleProjectCreate}
              onProjectUpdate={handleProjectUpdate}
              onProjectDelete={handleProjectDelete}
            />
          </SidebarContent>
          <SidebarResizer 
            $collapsed={collapsed} 
            onClick={toggleSidebar}
            title={collapsed ? "展开侧边栏" : "收起侧边栏"}
          />
        </Sidebar>
        
        <Mask visible={!collapsed && window.innerWidth <= 768} onClick={handleMaskClick} />

        <ChatContainer>
          <StyledContent>
            <MessageList
              dataSource={filteredMessages}
              renderItem={(item: Message) => (
                <MessageItem>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={item.type === 'user' ? <UserOutlined /> : <RobotOutlined />} />
                    }
                    title={
                      <Text strong>{item.type === 'user' ? '用户' : 'AI助手'}</Text>
                    }
                    description={
                      <Text>{item.content}</Text>
                    }
                  />
                </MessageItem>
              )}
            />
            <div ref={messagesEndRef} />
          </StyledContent>

          <StyledFooter>
            <InputContainer>
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={activeProjectId ? "输入您的问题..." : "请先选择一个项目"}
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={!activeProjectId}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!inputValue.trim() || !activeProjectId}
              >
                发送
              </Button>
            </InputContainer>
          </StyledFooter>
        </ChatContainer>
      </MainContainer>
    </StyledLayout>
  );
};

export default AgentPage; 