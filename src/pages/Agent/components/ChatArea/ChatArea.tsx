import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Layout, Input, Button, List, Avatar, Typography, message } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, ProjectOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Message, Project, ChatSession } from '../../types';
import ProjectHeader from './ProjectHeader';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SessionList, { SessionListRef } from './SessionList';
import axios from '../../../../api/axios';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  height: 100%;
  background: var(--ant-color-bg-container);
  min-width: 0;
  overflow: hidden;
`;

const ChatMainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  handleSend: (sessionId?: string) => void;
  sendLoading?: boolean;
  onCancelRequest?: () => void;
  onClearMessages?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  inputValue,
  setInputValue,
  activeProject,
  handleSend,
  sendLoading = false,
  onCancelRequest,
  onClearMessages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionListRef = useRef<SessionListRef>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  // 添加refreshTimerId用于防止重复刷新会话列表
  const refreshTimerId = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 防抖函数，用于延迟刷新会话列表
  const debouncedRefreshSessions = () => {
    // 清除之前的定时器
    if (refreshTimerId.current) {
      clearTimeout(refreshTimerId.current);
    }
    
    // 设置新的定时器，延迟刷新会话列表
    refreshTimerId.current = setTimeout(() => {
      sessionListRef.current?.refreshSessions();
      refreshTimerId.current = null;
    }, 1000);
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessionMessages]);

  // 当项目变更时，重置会话状态
  useEffect(() => {
    setActiveSessionId(null);
    setSessionMessages([]);
  }, [activeProject?.id]);

  // 当选择会话时，加载会话消息
  useEffect(() => {
    if (activeSessionId) {
      // 清空当前会话消息，显示加载状态
      setSessionMessages([]);
      // 加载会话消息
      fetchSessionMessages(activeSessionId);
    } else {
      setSessionMessages([]);
    }
  }, [activeSessionId]);

  // 当收到新消息时，更新会话消息
  useEffect(() => {
    if (activeProject) {
      if (activeSessionId) {
        // 如果有活动会话，将新消息添加到会话消息中
        const newUserMessage = messages.find(msg => 
          msg.projectId === activeProject.id && 
          msg.type === 'user' && 
          !sessionMessages.some(existingMsg => 
            existingMsg.content === msg.content && 
            existingMsg.type === 'user'
          )
        );
        
        if (newUserMessage) {
          // 如果有新的用户消息，添加到会话消息中
          setSessionMessages(prev => [...prev, newUserMessage]);
        }
        
        // 检查是否有新的AI回复（包括系统消息）
        const newAIMessages = messages.filter(msg => 
          msg.projectId === activeProject.id && 
          msg.type === 'assistant' && 
          !sessionMessages.some(existingMsg => 
            existingMsg.content === msg.content && 
            existingMsg.type === 'assistant' &&
            (
              // 对于系统消息，只检查内容
              (msg.agentName === '系统' && existingMsg.agentName === '系统' && existingMsg.content === msg.content) ||
              // 对于普通AI消息，检查内容和agentId
              (msg.agentName !== '系统' && existingMsg.agentId === msg.agentId && existingMsg.content === msg.content)
            )
          )
        );
        
        if (newAIMessages.length > 0) {
          // 如果有新的AI回复，添加到会话消息中
          setSessionMessages(prev => [...prev, ...newAIMessages]);
        }
      } else {
        // 如果没有活动会话但有消息，可能是新创建的会话
        // 检查是否有新的用户消息
        const userMessages = messages.filter(msg => 
          msg.projectId === activeProject.id && 
          msg.type === 'user'
        );
        
        // 检查是否有新的AI回复
        const aiMessages = messages.filter(msg => 
          msg.projectId === activeProject.id && 
          msg.type === 'assistant'
        );
        
        // 如果有用户消息和AI回复，说明是新会话
        if (userMessages.length > 0 && aiMessages.length > 0) {
          // 将所有消息添加到会话消息中
          setSessionMessages(messages.filter(msg => msg.projectId === activeProject.id));
          
          // 刷新会话列表，获取新会话ID
          debouncedRefreshSessions();
        }
      }
    }
  }, [messages, activeProject, activeSessionId]);

  // 获取会话消息
  const fetchSessionMessages = async (sessionId: string) => {
    if (!activeProject) return;
    
    setLoading(true);
    try {
      // 调用获取会话消息的API
      const response = await axios.get(`/chat/history/${sessionId}`, {
        params: {
          currentPage: 1,
          pageSize: 100 // 获取足够多的消息
        }
      });
      
      if (response.data.success) {
        // 获取数据
        const messagesData = response.data.data || [];
        
        // 转换消息格式
        const formattedMessages = messagesData.map((msg: any) => ({
          type: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
          projectId: activeProject?.id,
          timestamp: msg.createTime || new Date().toISOString(),
          // 添加AI员工信息
          ...(msg.role !== 'user' && msg.agentName ? { agentName: msg.agentName } : {}),
          ...(msg.role !== 'user' && msg.agentId ? { agentId: msg.agentId } : {})
        }));
        
        setSessionMessages(formattedMessages);
      } else {
        message.error(response.data.message || '获取会话消息失败');
        // 如果获取失败，使用过滤的消息作为备选
        setSessionMessages(messages.filter(msg => msg.projectId === activeProject?.id));
      }
    } catch (error) {
      console.error('获取会话消息错误:', error);
      message.error('获取会话消息失败，请稍后重试');
      // 如果获取失败，使用过滤的消息作为备选
      setSessionMessages(messages.filter(msg => msg.projectId === activeProject?.id));
    } finally {
      setLoading(false);
    }
  };

  // 处理选择会话
  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  // 处理新建会话
  const handleNewSession = () => {
    // 清空会话ID
    setActiveSessionId(null);
    // 清空会话消息
    setSessionMessages([]);
    // 清空输入框
    setInputValue('');
    
    // 清空全局消息列表
    if (onClearMessages) {
      onClearMessages();
    }
    
    // 滚动到底部，确保视图更新
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  // 处理发送消息
  const handleSendMessage = () => {
    // 如果是新会话，不传递会话ID
    if (!activeSessionId) {
      // 发送消息，不带会话ID，后端会自动创建新会话
      handleSend(undefined);
    } else {
      // 发送消息，带上现有会话ID
      handleSend(activeSessionId);
    }
  };

  // 刷新会话列表
  const refreshSessionList = () => {
    sessionListRef.current?.refreshSessions();
  };

  return (
    <ChatContainer>
      {activeProject && (
        <SessionList
          ref={sessionListRef}
          projectId={activeProject.id}
          activeSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
        />
      )}

      <ChatMainArea>
        {/* 项目标题栏 - 只在选择了项目时显示 */}
        {activeProject && <ProjectHeader project={activeProject} />}

        <StyledContent>
          {activeProject ? (
            <>
              <MessageList 
                messages={activeSessionId ? sessionMessages : (messages.length > 0 ? messages : [])} 
                loading={loading} 
              />
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
          handleSend={handleSendMessage}
          disabled={!activeProject}
          projectId={activeProject?.id}
          loading={sendLoading}
          onCancelRequest={onCancelRequest}
        />
      </ChatMainArea>
    </ChatContainer>
  );
};

export default ChatArea; 