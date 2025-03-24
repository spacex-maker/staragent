import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { Layout} from 'antd';
import styled from 'styled-components';
import { Message, Project, FrontendMessage } from '../../types';
import ProjectHeader from './ProjectHeader';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SessionList, { SessionListRef } from './SessionList';
import { useSessionManager } from './hooks/useSessionManager';
import { useMessageManager } from './hooks/useMessageManager';
import { useProjectAgents } from './hooks/useProjectAgents';
import EmptyChat from './EmptyChat';

const { Content } = Layout;

// 样式组件
const StyledComponents = {
  ChatContainer: styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    height: 100%;
    background: var(--ant-color-bg-container);
    min-width: 0;
    overflow: hidden;
  `,

  ChatMainArea: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    overflow: hidden;
  `,

  StyledContent: styled(Content)`
    flex: 1;
    padding: 8px;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    height: calc(100% - 80px);
    max-height: calc(100vh - 140px);
    
    /* 添加以下样式以确保滚动事件正确触发 */
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--ant-color-border);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: var(--ant-color-border-hover);
    }
    
    /* 修改滚动容器的样式 */
    > * {
      flex-shrink: 0;
      width: 100%;
    }
    
    /* 确保消息列表可以正确滚动 */
    .ant-list {
      flex: 1;
      overflow: visible;
      min-height: 0;
    }
    
    .ant-list-items {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
  `,

  EmptyProjectPrompt: styled.div`
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
  `,
  
  MessagesEndMarker: styled.div`
    height: 1px;
    width: 100%;
  `
};

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
  onSendMessage: (message: string) => void;
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
  setActiveSessionId,
  onSendMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sessionListRef = useRef<SessionListRef>(null);
  const [hasMore, setHasMore] = useState(true);

  // 使用自定义 hooks 管理状态和逻辑
  const {
    sessionMessages,
    loading,
    loadingMore,
    hasMore: hookHasMore,
    messagesLoaded,
    handleLoadMore: originalHandleLoadMore,
    updateSessionMessages,
    clearSessionMessages,
  } = useMessageManager(messages, activeSessionId);

  // 确保hasMore状态与hook返回的同步
  useEffect(() => {
    setHasMore(hookHasMore);
  }, [hookHasMore]);

  // 滚动到底部的函数
  const scrollToBottom = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  // 监听消息加载完成状态，自动滚动到底部
  useEffect(() => {
    if (messagesLoaded && !loading) {
      // 使用 setTimeout 确保在 DOM 更新后再滚动
      setTimeout(scrollToBottom, 100);
    }
  }, [messagesLoaded, loading, scrollToBottom]);

  // 创建一个包装的handleLoadMore函数，确保触发正确的事件
  const handleLoadMore = useCallback(() => {
    console.log('ChatArea: 调用handleLoadMore');
    // 设置本地状态
    setHasMore(hookHasMore);
    // 调用原始的加载函数
    originalHandleLoadMore();
  }, [originalHandleLoadMore, hookHasMore]);

  const {
    handleSessionSelect,
    handleNewSession,
    noSessionsMessage,
  } = useSessionManager({
    activeProject,
    activeSessionId,
    setActiveSessionId,
    clearSessionMessages,
    onClearMessages
  });

  const {
    projectAgents,
    fetchAgents
  } = useProjectAgents(activeProject?.id);

  // 监听项目变化时获取员工列表
  useEffect(() => {
    if (activeProject?.id) {
      fetchAgents();
    }
  }, [activeProject?.id, fetchAgents]);

  // 处理发送消息
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    const tempMessage: FrontendMessage = {
      id: Date.now(),
      sessionId: activeSessionId || '',
      role: 'user',
      content: inputValue,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      sending: true,
      userId: 0,
      agentName: null,
      agentId: null,
      model: null
    };

    updateSessionMessages(prev => [...prev, tempMessage]);
    setInputValue('');
    handleSend(activeSessionId);
  }, [inputValue, activeSessionId, handleSend, setInputValue, updateSessionMessages]);

  // 获取输入框占位符
  const inputPlaceholder = useMemo(() => {
    if (!activeProject) return "请先选择一个项目";
    if (!activeSessionId) return noSessionsMessage || "请先创建一个新的会话";
    if (projectAgents.length === 0) return "请先添加AI员工到项目中";
    return "输入您的问题...";
  }, [activeProject, activeSessionId, noSessionsMessage, projectAgents.length]);

  return (
    <StyledComponents.ChatContainer>
      {activeProject && (
        <SessionList
          ref={sessionListRef}
          projectId={activeProject.id}
          activeSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
        />
      )}

      <StyledComponents.ChatMainArea>
        {activeProject && <ProjectHeader project={activeProject} />}

        <StyledComponents.StyledContent ref={contentRef}>
          {activeProject ? (
            <>
              <MessageList 
                messages={activeSessionId ? sessionMessages : messages}
                loading={loading}
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                projectAgents={projectAgents}
                onNavigateToAgents={() => {
                  window.dispatchEvent(new CustomEvent('navigateToAgents'));
                }}
                messageListRef={contentRef}
                activeSessionId={activeSessionId}
              />
              <StyledComponents.MessagesEndMarker ref={messagesEndRef} />
            </>
          ) : (
            <EmptyChat
              onNavigateToAgents={() => {
                window.dispatchEvent(new CustomEvent('navigateToProjects'));
              }}
            />
          )}
        </StyledComponents.StyledContent>

        <InputArea 
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSend={handleSendMessage}
          disabled={!activeProject || !activeSessionId}
          projectId={activeProject?.id}
          activeSessionId={activeSessionId}
          loading={sendLoading}
          onCancelRequest={onCancelRequest}
          placeholder={inputPlaceholder}
        />
      </StyledComponents.ChatMainArea>
    </StyledComponents.ChatContainer>
  );
};

export default ChatArea; 