import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Layout, Typography, message } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Message, Project } from '../../types';
import ProjectHeader from './ProjectHeader';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SessionList, { SessionListRef } from './SessionList';
import axios from '../../../../api/axios';

const { Content } = Layout;
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
  padding: 8px;
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
  activeProject: Project | null;
  handleSend: (sessionId?: string) => Promise<string | undefined>;
  sendLoading?: boolean;
  onCancelRequest?: () => void;
  onClearMessages?: () => void;
  activeSessionId: string | null;
  setActiveSessionId: (sessionId: string | null) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  inputValue,
  setInputValue,
  activeProject,
  handleSend,
  sendLoading = false,
  onCancelRequest,
  onClearMessages,
  activeSessionId,
  setActiveSessionId
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionListRef = useRef<SessionListRef>(null);
  const previousProjectIdRef = useRef<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [beforeId, setBeforeId] = useState<number | null>(null);
  const [noSessionsMessage, setNoSessionsMessage] = useState<string>('');
  const PAGE_SIZE = 20;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 监听消息变化，只在发送新消息时自动滚动
  useEffect(() => {
    // 检查是否是新消息（而不是加载历史消息）
    const isNewMessage = messages.some(msg => msg.sending);
    if (isNewMessage) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // 获取会话消息
  const fetchSessionMessages = useCallback(async (sessionId: string, loadMore: boolean = false) => {
    if (!activeProject) return;
    
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await axios.get('/chat/history', {
        params: {
          sessionId,
          pageSize: PAGE_SIZE,
          beforeId: loadMore ? beforeId : null
        }
      });
      
      if (response.data.success) {
        const messages = response.data.data || [];
        
        // 更新beforeId为最后一条消息的ID
        if (messages.length > 0) {
          setBeforeId(messages[messages.length - 1].id);
        }
        
        // 设置是否还有更多消息
        setHasMore(messages.length === PAGE_SIZE);
        
        // 如果是加载更多，添加到消息列表顶部
        // 如果是首次加载，直接设置消息列表
        setSessionMessages(prev => 
          loadMore ? [...messages, ...prev] : messages
        );
      } else {
        message.error(response.data.message || '获取会话消息失败');
      }
    } catch (error) {
      console.error('获取会话消息错误:', error);
      message.error('获取会话消息失败，请稍后重试');
    } finally {
      if (loadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [activeProject, beforeId]);

  // 加载更多消息
  const loadMoreMessages = useCallback(() => {
    if (!activeSessionId || loadingMore || !hasMore) return;
    fetchSessionMessages(activeSessionId, true);
  }, [activeSessionId, loadingMore, hasMore, fetchSessionMessages]);

  // 刷新会话列表
  const refreshSessionList = useCallback(() => {
    sessionListRef.current?.refreshSessions();
  }, []);

  // 处理会话选择
  const handleSessionSelect = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    setSessionMessages([]); // 清空当前消息
    setBeforeId(null); // 重置beforeId
    setHasMore(true); // 重置加载更多状态
    fetchSessionMessages(sessionId); // 加载会话消息
  }, [fetchSessionMessages]);

  // 处理新消息更新
  useEffect(() => {
    if (!messages || !activeProject?.id) return;
    
    console.log('收到新消息更新:', messages);
    console.log('当前活动会话:', activeSessionId);
    
    // 如果有活动会话，则更新该会话的消息
    if (activeSessionId) {
      // 过滤出属于当前会话的消息
      const currentSessionMessages = messages.filter(msg => msg.sessionId === activeSessionId);
      console.log('当前会话的消息:', currentSessionMessages);
      
      if (currentSessionMessages.length > 0) {
        setSessionMessages(prev => {
          // 创建一个新的消息数组，移除所有发送中的消息
          const withoutTemp = prev.filter(msg => !msg.sending);
          
          // 将新消息添加到数组中
          currentSessionMessages.forEach(msg => {
            if (!withoutTemp.some(m => m.id === msg.id)) {
              withoutTemp.push(msg);
            }
          });
          
          // 按照创建时间排序
          return withoutTemp.sort((a, b) => 
            new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
          );
        });
      }
    }
    // 如果没有活动会话，但有新消息，则设置会话ID
    else if (messages.length > 0) {
      const firstMessage = messages[0];
      console.log('设置新会话:', firstMessage);
      
      if (firstMessage.sessionId) {
        setActiveSessionId(firstMessage.sessionId);
        setSessionMessages(messages.sort((a, b) => 
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
        ));
      }
    }
  }, [messages, activeProject?.id, activeSessionId]);

  // 获取会话列表并自动选择最新会话
  const fetchAndSelectFirstSession = useCallback(async () => {
    if (!activeProject?.id) return;
    
    try {
      const response = await axios.get('/chat/sessions', {
        params: {
          projectId: activeProject.id,
          pageSize: 1,
          currentPage: 1
        }
      });
      
      if (response.data.success) {
        const sessions = response.data.data.records || [];
        if (sessions.length > 0) {
          // 直接使用第一个会话（已经是最新的）
          const latestSession = sessions[0];
          console.log('选择会话:', latestSession);
          handleSessionSelect(latestSession.id.toString());
          setNoSessionsMessage('');
        } else {
          setNoSessionsMessage('请先创建一个新的会话');
        }
      }
    } catch (error) {
      console.error('获取会话列表错误:', error);
      message.error('获取会话列表失败，请稍后重试');
    }
  }, [activeProject?.id, handleSessionSelect]);

  // 监听项目变化
  useEffect(() => {
    const currentProjectId = activeProject?.id || null;
    
    // 只在项目ID真正变化时执行
    if (currentProjectId !== previousProjectIdRef.current) {
      previousProjectIdRef.current = currentProjectId;
      
      if (currentProjectId) {
        // 使用批量更新，避免多次渲染
        setActiveSessionId(null);
        setSessionMessages([]);
        setBeforeId(null);
        setHasMore(true);
        // 不再主动获取会话列表，由 SessionList 组件处理
      }
    }
  }, [activeProject?.id]);

  // 处理新建会话
  const handleNewSession = useCallback(async () => {
    if (!activeProject?.id) return;
    
    try {
      const response = await axios.post('/chat/create-session', {
        projectId: parseInt(activeProject.id),
        title: '新会话'  // 默认标题
      });
      
      if (response.data.success) {
        console.log('创建新会话成功:', response.data);
        const newSession = response.data.data;
        
        // 批量更新状态
        const updateState = () => {
          setActiveSessionId(newSession.id.toString());
          setSessionMessages([]);
          setBeforeId(null);
          setHasMore(true);
          setInputValue('');
          onClearMessages?.();
        };
        
        updateState();
      } else {
        message.error(response.data.message || '创建会话失败');
      }
    } catch (error) {
      console.error('创建会话错误:', error);
      message.error('创建会话失败，请稍后重试');
    }
  }, [activeProject?.id, setInputValue, onClearMessages]);

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    if (!activeSessionId) {
      message.warning('请先创建一个新的会话');
      return;
    }
    
    console.log('发送消息:', inputValue);
    console.log('当前会话ID:', activeSessionId);
    
    const tempMessage: Message = {
      id: Date.now(),
      sessionId: activeSessionId,
      role: 'user',
      content: inputValue,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      sending: true
    };

    setSessionMessages(prev => [...prev, tempMessage]);
    setInputValue('');
    scrollToBottom(); // 发送新消息时滚动到底部
    
    try {
      await handleSend(activeSessionId);
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败，请稍后重试');
      
      setSessionMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, sending: false, error: true } 
            : msg
        )
      );
    }
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
        {activeProject && <ProjectHeader project={activeProject} />}

        <StyledContent>
          {activeProject ? (
            <>
              <MessageList 
                messages={activeSessionId ? sessionMessages : messages}
                loading={loading}
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={loadMoreMessages}
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
          disabled={!activeProject || !activeSessionId}
          projectId={activeProject?.id}
          activeSessionId={activeSessionId}
          loading={sendLoading}
          onCancelRequest={onCancelRequest}
          placeholder={
            !activeProject 
              ? "请先选择一个项目" 
              : !activeSessionId 
                ? noSessionsMessage || "请先创建一个新的会话"
                : "输入您的问题..."
          }
        />
      </ChatMainArea>
    </ChatContainer>
  );
};

export default ChatArea; 