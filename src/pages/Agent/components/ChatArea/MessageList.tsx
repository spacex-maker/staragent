import React, { useContext, useEffect, useState, PropsWithChildren } from 'react';
import { List, Avatar, Typography, Spin, Tag, Button } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import styled, { ThemeContext } from 'styled-components';
import { Message, FrontendMessage } from '../../types';
import MessageContent from './MessageContent';

const { Text } = Typography;

interface StyledProps {
  $isUser?: boolean;
  $sending?: boolean;
  $error?: boolean;
  children?: React.ReactNode;
}

const StyledMessageList = styled(List<Message | FrontendMessage>)`
  flex: 1;
  padding: 8px;
  width: 100%;
  
  .ant-list-items {
    border: none;
  }
`;

const MessageItem = styled(List.Item)<StyledProps>`
  padding: 0;
  margin-bottom: 16px;
  background: transparent;
  border: none !important;
  box-shadow: none;

  &:hover {
    background: transparent;
  }

  .ant-list-item-meta {
    align-items: flex-start;
    margin-bottom: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const MessageContainer = styled.div<StyledProps>`
  display: flex;
  align-items: flex-start;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
  gap: 12px;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const AvatarContainer = styled.div<StyledProps>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  margin-top: 4px;
`;

const StyledAvatar = styled(Avatar)<StyledProps>`
  width: ${props => props.$isUser ? '36px' : '40px'};
  height: ${props => props.$isUser ? '36px' : '40px'};
  background: ${props => props.$isUser ? 'var(--ant-color-primary)' : 'var(--ant-color-bg-container)'};
  color: ${props => props.$isUser ? 'var(--ant-color-white)' : 'var(--ant-color-primary)'};
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${props => props.$isUser 
    ? 'none'
    : '2px solid var(--ant-color-primary)'};
  box-shadow: ${props => props.$isUser 
    ? '0 2px 8px rgba(0, 0, 0, 0.15)'
    : 'none'};

  .anticon {
    font-size: 18px;
  }

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;

const MessageInfo = styled.div<StyledProps>`
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  gap: 8px;
  position: relative;
`;

const UserName = styled(Text)<StyledProps>`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.$isUser ? 'var(--ant-color-primary)' : 'var(--ant-color-text)'};
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  z-index: 1;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
`;

const LoadMoreButton = styled(Button)`
  width: 100%;
  margin: 16px 0;
  border-radius: 8px;
  height: 40px;
  
  &:hover {
    background: var(--ant-color-primary-bg);
    border-color: var(--ant-color-primary);
  }
`;

const AgentTag = styled(Tag)`
  margin-left: 8px;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 500;
`;

const MessageContentWrapper = styled.div<StyledProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  max-width: calc(100% - 52px);
`;

const MessageBubble = styled.div<StyledProps>`
  background: ${props => props.$isUser 
    ? 'var(--ant-color-primary-bg)'
    : 'var(--ant-color-bg-container)'};
  border: ${props => {
    if (props.$error) return '1px solid var(--ant-color-error)';
    if (props.$sending) return '1px solid var(--ant-color-warning)';
    return props.$isUser 
      ? '1px solid var(--ant-color-primary-border)'
      : '1px solid var(--ant-color-border)';
  }};
  border-radius: 20px;
  padding: 12px 16px;
  max-width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  opacity: ${props => props.$sending ? 0.8 : 1};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.$isUser 
      ? 'var(--ant-color-primary)'
      : 'var(--ant-color-primary-border)'};
  }
`;

const MessageStatus = styled.div<StyledProps>`
  font-size: 12px;
  color: ${props => props.$error ? 'var(--ant-color-error)' : 'var(--ant-color-text-secondary)'};
  margin-top: 4px;
  text-align: right;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--ant-color-text-secondary);
  padding: 24px 16px;
  text-align: center;
  background: var(--ant-color-bg-container);
  border-radius: 20px;
  border: 1px dashed var(--ant-color-border);
`;

interface MessageListProps {
  messages: (Message | FrontendMessage)[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore
}) => {
  const theme = useContext(ThemeContext);
  const [userInfo, setUserInfo] = useState<{ username: string; avatar?: string } | null>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" tip="加载消息中..." />
      </LoadingContainer>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <EmptyContainer>
        <Text style={{ fontSize: '16px', marginBottom: '8px' }}>
          开始一个新的对话
        </Text>
        <Text style={{ fontSize: '14px', opacity: 0.8 }}>
          在下方输入框中输入您的问题
        </Text>
      </EmptyContainer>
    );
  }

  return (
    <>
      {hasMore && (
        <LoadMoreButton 
          onClick={onLoadMore}
          loading={loadingMore}
          type="dashed"
        >
          {loadingMore ? '加载更多消息...' : '加载更多消息'}
        </LoadMoreButton>
      )}
      
      <StyledMessageList
        dataSource={messages}
        renderItem={(msg) => {
          const isUser = msg.role === 'user';
          const isSending = 'sending' in msg && msg.sending === true;
          const hasError = 'error' in msg && msg.error === true;
          
          return (
            <MessageItem $isUser={isUser}>
              <MessageContainer $isUser={isUser}>
                <AvatarContainer $isUser={isUser}>
                  {isUser ? (
                    userInfo?.avatar ? (
                      <StyledAvatar 
                        $isUser={true}
                        src={userInfo.avatar}
                      />
                    ) : (
                      <StyledAvatar $isUser={true}>
                        <UserOutlined />
                      </StyledAvatar>
                    )
                  ) : (
                    <StyledAvatar $isUser={false}>
                      <RobotOutlined />
                    </StyledAvatar>
                  )}
                </AvatarContainer>
                <MessageContentWrapper $isUser={isUser}>
                  <MessageInfo $isUser={isUser}>
                    <UserName $isUser={isUser}>
                      {isUser ? userInfo?.username || '用户' : msg.agentName || 'AI 助手'}
                    </UserName>
                    {!isUser && (
                      <>
                        <AgentTag color="blue">{msg.role || 'AI'}</AgentTag>
                        {msg.model && <AgentTag color="purple">{msg.model}</AgentTag>}
                      </>
                    )}
                  </MessageInfo>
                  <MessageBubble 
                    $isUser={isUser}
                    $sending={isSending}
                    $error={hasError}
                  >
                    <MessageContent content={msg.content} />
                  </MessageBubble>
                  {(isSending || hasError) && (
                    <MessageStatus $error={hasError}>
                      {isSending ? '发送中...' : '发送失败'}
                    </MessageStatus>
                  )}
                </MessageContentWrapper>
              </MessageContainer>
            </MessageItem>
          );
        }}
      />
    </>
  );
};

export default MessageList; 