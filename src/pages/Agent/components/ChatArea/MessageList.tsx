import React, { useContext, useEffect, useState } from 'react';
import { List, Avatar, Typography, Spin, Tag, Image } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import styled, { ThemeContext } from 'styled-components';
import { Message } from '../../types';

const { Text } = Typography;

const StyledMessageList = styled(List<Message>)`
  flex: 1;
  padding: 24px;
  width: 100%;
`;

const MessageItem = styled(List.Item)<{ $isUser?: boolean }>`
  padding: 0;
  border-radius: 12px;
  margin-bottom: 24px;
  background: transparent;
  border: none;
  box-shadow: none;

  &:hover {
    background: transparent;
  }

  .ant-list-item-meta {
    align-items: flex-start;
    margin-bottom: 0;
  }
`;

const MessageContainer = styled.div<{ $isUser?: boolean }>`
  display: flex;
  align-items: flex-start;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
  gap: 16px;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  width: 100%;
`;

const AvatarContainer = styled.div<{ $isUser?: boolean }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(to right, 
    ${props => props.$isUser 
      ? 'var(--ant-color-primary), var(--ant-color-primary-active)' 
      : 'var(--ant-color-primary-bg), var(--ant-color-primary-3)'
    });
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(
      90deg, 
      transparent 0%, 
      var(--ant-color-primary) 25%, 
      var(--ant-color-primary-active) 50%, 
      var(--ant-color-primary) 75%, 
      transparent 100%
    );
    background-size: 200% 100%;
    z-index: -1;
    opacity: 0.5;
  }
`;

const StyledAvatar = styled(Avatar)<{ $isUser?: boolean }>`
  width: 100%;
  height: 100%;
  background: ${props => props.$isUser ? '#fff' : 'var(--ant-color-bg-container)'};
  color: ${props => props.$isUser ? 'var(--ant-color-primary)' : 'var(--ant-color-primary)'};
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.$isUser ? '#fff' : 'var(--ant-color-bg-container)'};
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);

  .anticon {
    font-size: 18px;
  }

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;

const StatusIndicator = styled.div<{ $isUser?: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$isUser ? '#52c41a' : 'var(--ant-color-primary)'};
  border: 2px solid ${props => props.theme.mode === 'dark' ? '#141414' : '#ffffff'};
  z-index: 3;
  box-shadow: 0 0 8px 2px rgba(82, 196, 26, 0.3);
  opacity: 0.9;
`;

const MessageInfo = styled.div<{ $isUser?: boolean }>`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  gap: 8px;
  position: relative;
`;

const UserName = styled(Text)<{ $isUser?: boolean }>`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.$isUser ? 'var(--ant-color-primary)' : 'var(--ant-color-text)'};
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.$isUser ? 'var(--ant-color-primary)' : 'transparent'};
    opacity: 0.3;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  margin: 0 24px 24px 24px;
  cursor: pointer;
  color: var(--ant-color-primary);
  background: var(--ant-color-bg-container);
  border-radius: 8px;
  border: 1px solid var(--ant-color-border);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--ant-color-primary-bg);
    border-color: var(--ant-color-primary-border);
  }
`;

const AgentTag = styled(Tag)`
  margin-left: 8px;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
`;

const MessageTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 1px;
`;

const SystemTag = styled(AgentTag)`
  background-color: var(--ant-color-warning);
  color: #fff;
`;

const SystemMessageContent = styled(Text)`
  color: var(--ant-color-warning-text);
  background-color: var(--ant-color-warning-bg);
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
  font-size: 14px;
`;

const ImageWrapper = styled.div`
  margin: 8px 0;
  display: inline-block;
  max-width: 300px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--ant-color-text-secondary);
  padding: 40px 20px;
  text-align: center;
  background: var(--ant-color-bg-container);
  border-radius: 12px;
  border: 1px dashed var(--ant-color-border);
  margin: 24px;
`;

const MessageContent = styled.div<{ $isUser?: boolean; $sending?: boolean; $error?: boolean }>`
  max-width: 80%;
  padding: 16px 24px;
  background: ${props => props.$isUser ? 'var(--ant-color-primary-bg)' : 'var(--ant-color-bg-container)'};
  border: 1px solid ${props => {
    if (props.$error) return 'var(--ant-color-error)';
    if (props.$sending) return 'var(--ant-color-warning)';
    return props.$isUser ? 'var(--ant-color-primary-border)' : 'var(--ant-color-border)';
  }};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  opacity: ${props => props.$sending ? 0.8 : 1};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  color: ${props => props.$isUser ? 'var(--ant-color-text-secondary)' : 'var(--ant-color-text)'};
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  img {
    max-width: 300px;
    max-height: 200px;
    border-radius: 8px;
    margin: 8px 0;
    object-fit: contain;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    max-width: 85%;
    img {
      max-width: 100%;
    }
  }
`;

const MessageStatus = styled.div<{ $error?: boolean }>`
  font-size: 12px;
  color: ${props => props.$error ? 'var(--ant-color-error)' : 'var(--ant-color-text-secondary)'};
  margin-top: 4px;
  text-align: right;
`;

const MessageContentWrapper = styled.div<{ $isUser?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  max-width: calc(100% - 56px); // 40px avatar + 16px gap
`;

interface UserInfo {
  username: string;
  avatar?: string;
  email?: string;
}

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

// 解析Markdown格式的图片
const parseMessageContent = (content: string, isUser?: boolean) => {
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    // 添加图片前的文本
    if (match.index > lastIndex) {
      parts.push(
        <Text key={`text-${lastIndex}`}>
          {content.slice(lastIndex, match.index)}
        </Text>
      );
    }

    // 添加图片
    parts.push(
      <ImageWrapper key={`img-${match.index}`}>
        <Image
          src={match[2]}
          alt={match[1]}
          style={{ 
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            objectFit: 'contain'
          }}
          preview={{
            mask: '点击预览'
          }}
        />
      </ImageWrapper>
    );

    lastIndex = match.index + match[0].length;
  }

  // 添加剩余的文本
  if (lastIndex < content.length) {
    parts.push(
      <Text key={`text-${lastIndex}`}>
        {content.slice(lastIndex)}
      </Text>
    );
  }

  return parts.length > 0 ? parts : <Text>{content}</Text>;
};

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore
}) => {
  const theme = useContext(ThemeContext);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  useEffect(() => {
    // 从 localStorage 获取用户信息
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <Spin tip="加载消息中..." />
      </LoadingContainer>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <EmptyContainer>
        <div style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 500 }}>
          开始一个新的对话
        </div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          在下方输入框中输入您的问题
        </div>
      </EmptyContainer>
    );
  }

  return (
    <>
      {hasMore && (
        <LoadMoreContainer onClick={onLoadMore}>
          {loadingMore ? (
            <Spin size="small" style={{ marginRight: '8px' }} />
          ) : (
            '加载更多消息'
          )}
        </LoadMoreContainer>
      )}
      
      <StyledMessageList
        dataSource={messages}
        renderItem={(msg) => {
          const isUser = msg.role === 'user';
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
                        {userInfo?.username?.[0]?.toUpperCase() || '用户'}
                      </StyledAvatar>
                    )
                  ) : (
                    <StyledAvatar $isUser={false}>
                      <RobotOutlined />
                    </StyledAvatar>
                  )}
                  <StatusIndicator $isUser={isUser} />
                </AvatarContainer>
                <MessageContentWrapper $isUser={isUser}>
                  <MessageInfo $isUser={isUser}>
                    <UserName $isUser={isUser}>
                      {isUser ? userInfo?.username || '用户' : msg.agentName || 'AI助手'}
                    </UserName>
                    {!isUser && msg.agentName && (
                      msg.agentName === '系统' ? 
                        <SystemTag>{msg.agentName}</SystemTag> : 
                        <AgentTag color="blue">{msg.agentName}</AgentTag>
                    )}
                  </MessageInfo>
                  {!isUser && msg.agentName === '系统' ? (
                    <SystemMessageContent>{msg.content}</SystemMessageContent>
                  ) : (
                    <MessageContent 
                      $isUser={isUser} 
                      $sending={msg.sending}
                      $error={msg.error}
                    >
                      {parseMessageContent(msg.content, isUser)}
                      {msg.sending && (
                        <MessageStatus>发送中...</MessageStatus>
                      )}
                      {msg.error && (
                        <MessageStatus $error>发送失败</MessageStatus>
                      )}
                    </MessageContent>
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