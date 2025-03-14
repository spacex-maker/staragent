import React, { useRef, useEffect } from 'react';
import { Layout, Input, Button, List, Avatar, Typography } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, ProjectOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Message, Project } from '../../types';
import ProjectHeader from './ProjectHeader';
import MessageList from './MessageList';
import InputArea from './InputArea';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

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

const EmptyProjectPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  text-align: center;
  color: var(--ant-color-text-secondary);
  
  .anticon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  h3 {
    margin-bottom: 8px;
    font-weight: normal;
  }
`;

interface ChatAreaProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  activeProject: Project | undefined;
  handleSend: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  inputValue,
  setInputValue,
  activeProject,
  handleSend
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ChatContainer>
      {/* 项目标题栏 - 只在选择了项目时显示 */}
      {activeProject && <ProjectHeader project={activeProject} />}

      <StyledContent>
        {activeProject ? (
          <>
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
          </>
        ) : (
          <EmptyProjectPrompt>
            <ProjectOutlined />
            <Title level={3}>请选择一个项目开始对话</Title>
            <Text>从左侧选择一个已有项目，或创建一个新项目</Text>
          </EmptyProjectPrompt>
        )}
      </StyledContent>

      <InputArea 
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        disabled={!activeProject}
        projectId={activeProject?.id}
      />
    </ChatContainer>
  );
};

export default ChatArea; 