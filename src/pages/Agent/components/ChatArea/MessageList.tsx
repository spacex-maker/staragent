import React, { useContext, useEffect, useState, PropsWithChildren } from 'react';
import { List, Avatar, Typography, Spin, Tag, Image, message, Button } from 'antd';
import { UserOutlined, RobotOutlined, CopyOutlined } from '@ant-design/icons';
import styled, { ThemeContext } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-okaidia.css';
import { Message } from '../../types';
import type { Root } from 'mdast';

const { Text } = Typography;

interface StyledProps {
  $isUser?: boolean;
  $sending?: boolean;
  $error?: boolean;
}

const StyledMessageList = styled(List<Message>)`
  flex: 1;
  padding: 8px;
  width: 100%;
  
  .ant-list-items {
    border: none;
  }
`;

const MessageItem = styled(List.Item)<PropsWithChildren<StyledProps>>`
  padding: 0;
  margin-bottom: 8px;
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

const MessageContainer = styled.div<PropsWithChildren<StyledProps>>`
  display: flex;
  align-items: flex-start;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
  gap: 6px;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  width: 100%;
`;

const AvatarContainer = styled.div<PropsWithChildren<StyledProps>>`
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
`;

const StyledAvatar = styled(Avatar)<PropsWithChildren<StyledProps>>`
  width: ${props => props.$isUser ? '36px' : '40px'};
  height: ${props => props.$isUser ? '36px' : '40px'};
  background: ${props => props.$isUser ? 'var(--ant-color-white)' : 'var(--ant-color-bg-container)'};
  color: var(--ant-color-primary);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${props => props.$isUser 
    ? '2px solid var(--ant-color-primary)' 
    : '3px solid var(--ant-color-primary)'};

  .anticon {
    font-size: 18px;
  }

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;

const MessageInfo = styled.div<PropsWithChildren<StyledProps>>`
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  gap: 8px;
  position: relative;
`;

const UserName = styled(Text)<PropsWithChildren<StyledProps>>`
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

interface LoadMoreContainerProps {
  onClick?: () => void;
}

const LoadMoreContainer = styled.div<PropsWithChildren<LoadMoreContainerProps>>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  margin: 0 8px 8px 8px;
  cursor: pointer;
  color: var(--ant-color-primary);
  background: var(--ant-color-bg-container);
  border-radius: 6px;
  border: 0.5px solid var(--ant-color-border);
  transition: all 0.3s ease;
  
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

const MessageTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 1px;
`;

const SystemTag = styled(AgentTag)`
  background-color: var(--ant-color-warning);
  color: var(--ant-color-white);
`;

const SystemMessageContent = styled(Text)`
  color: var(--ant-color-text);
  background-color: var(--ant-color-warning);
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
  padding: 24px 16px;
  text-align: center;
  background: var(--ant-color-bg-container);
  border-radius: 20px;
  border: 0.5px dashed var(--ant-color-border);
`;

const MessageStatus = styled.div<PropsWithChildren<StyledProps>>`
  font-size: 12px;
  color: ${props => props.$error ? 'var(--ant-color-error)' : 'var(--ant-color-text-secondary)'};
  margin-top: 4px;
  text-align: right;
`;

const MessageActions = styled.div<PropsWithChildren<StyledProps>>`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
`;

const MessageContent = styled.div<PropsWithChildren<StyledProps>>`
  max-width: 80%;
  padding: 8px 32px 8px 12px;
  background: ${props => props.$isUser 
    ? 'var(--ant-color-primary-bg)'
    : 'var(--ant-color-bg-container)'};
  border: ${props => {
    if (props.$error) return '0.5px solid var(--ant-color-error)';
    if (props.$sending) return '0.5px solid var(--ant-color-warning)';
    return props.$isUser 
      ? '0.5px solid var(--ant-color-primary)'
      : '0.5px solid var(--ant-color-border)';
  }};
  border-radius: 20px;
  box-shadow: none;
  transition: all 0.3s ease;
  opacity: ${props => props.$sending ? 0.8 : 1};
  position: relative;

  &:hover {
    box-shadow: none;
    ${MessageActions} {
      opacity: 1;
    }
  }

  color: ${props => props.$isUser 
    ? 'var(--ant-color-text-secondary)'
    : 'var(--ant-color-text)'};
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;

  img {
    max-width: 300px;
    max-height: 200px;
    border-radius: 6px;
    margin: 8px 0;
    object-fit: contain;
    box-shadow: none;
    border: 0.5px solid var(--ant-color-border);
  }

  @media (max-width: 768px) {
    max-width: 85%;
    img {
      max-width: 100%;
    }
  }
`;

const MessageContentWrapper = styled.div<PropsWithChildren<StyledProps>>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  max-width: calc(100% - 46px); // 40px avatar + 6px gap
  position: relative;
  
  &:hover {
    ${MessageActions} {
      opacity: 1;
    }
  }
`;

const MarkdownContent = styled.div`
  font-size: 14px;
  line-height: 1.6;

  p {
    margin: 0 0 0.5em;
    &:last-child {
      margin-bottom: 0;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 1em;
    font-weight: 600;
    line-height: 1.25;
  }

  ul, ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }

  li {
    margin-bottom: 0.5em;
  }

  code {
    font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: var(--ant-color-bg-layout);
    border-radius: 3px;
  }

  pre {
    margin: 1em 0;
    padding: 1em;
    overflow: auto;
    background-color: var(--ant-color-bg-layout);
    border-radius: 6px;
    border: 1px solid var(--ant-color-border);
    position: relative;

    &:hover {
      .copy-button {
        opacity: 1;
      }
    }

    .copy-button {
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      padding: 0.3em 0.6em;
      background: var(--ant-color-bg-container);
      border: 1px solid var(--ant-color-border);
      border-radius: 4px;
      color: var(--ant-color-text);
      font-size: 12px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s ease;

      &:hover {
        background: var(--ant-color-primary-bg);
        border-color: var(--ant-color-primary);
      }
    }

    code {
      background: none;
      padding: 0;
      font-size: 14px;
      color: var(--ant-color-text);
      text-shadow: none;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    border: 1px solid var(--ant-color-border);

    th, td {
      padding: 0.5em;
      border: 1px solid var(--ant-color-border);
      text-align: left;
      vertical-align: top;
      line-height: 1.5;
      min-width: 100px;
    }

    th {
      background-color: var(--ant-color-bg-layout);
      font-weight: 600;
      white-space: nowrap;
    }

    tr:nth-child(even) {
      background-color: var(--ant-color-bg-layout);
    }

    tr:hover {
      background-color: var(--ant-color-bg-layout);
    }

    & + p {
      margin-top: 0.5em;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 1em 0;
  }

  hr {
    height: 1px;
    margin: 1em 0;
    border: none;
    background-color: var(--ant-color-border);
  }

  .math {
    overflow-x: auto;
    padding: 0.5em 0;
  }
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

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore
}) => {
  const theme = useContext(ThemeContext);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      message.success('复制成功');
    } catch (err) {
      message.error('复制失败');
      console.error('复制失败:', err);
    }
  };

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
                  <MessageContent $isUser={isUser}>
                    <MarkdownContent>
                      {msg.content}
                    </MarkdownContent>
                    <MessageActions $isUser={isUser}>
                      <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(msg.content)}
                        style={{
                          width: '24px',
                          height: '24px',
                          minWidth: '24px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          background: 'var(--ant-color-bg-container)',
                          border: '1px solid var(--ant-color-border)',
                          color: 'var(--ant-color-text)',
                        }}
                      />
                    </MessageActions>
                  </MessageContent>
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