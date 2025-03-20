import React, { useContext, useEffect, useState } from 'react';
import { List, Avatar, Typography, Spin, Tag, Image, message } from 'antd';
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

const StyledMessageList = styled(List<Message>)`
  flex: 1;
  padding: 8px;
  width: 100%;
  
  .ant-list-items {
    border: none;
  }
`;

const MessageItem = styled(List.Item)<{ $isUser?: boolean }>`
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

const MessageContainer = styled.div<{ $isUser?: boolean }>`
  display: flex;
  align-items: flex-start;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
  gap: 6px;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  width: 100%;
`;

const AvatarContainer = styled.div<{ $isUser?: boolean }>`
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

const StyledAvatar = styled(Avatar)<{ $isUser?: boolean }>`
  width: ${props => props.$isUser ? '36px' : '40px'};
  height: ${props => props.$isUser ? '36px' : '40px'};
  background: ${props => props.$isUser ? '#fff' : 'var(--ant-color-bg-container)'};
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
  margin-bottom: 4px;
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
  padding: 6px;
  margin: 0 8px 8px 8px;
  cursor: pointer;
  color: var(--ant-color-primary);
  background: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.04)'
    : 'var(--ant-color-bg-container)'};
  border-radius: 6px;
  border: 0.5px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'var(--ant-color-border)'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.15)'
      : 'var(--ant-color-primary-bg)'};
    border-color: var(--ant-color-primary-border);
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
  color: #fff;
`;

const SystemMessageContent = styled(Text)`
  color: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.85)'
    : 'var(--ant-color-warning-text)'};
  background-color: ${props => props.theme.mode === 'dark'
    ? 'rgba(245, 158, 11, 0.15)'
    : 'var(--ant-color-warning-bg)'};
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
  background: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.04)'
    : 'var(--ant-color-bg-container)'};
  border-radius: 20px;
  border: 0.5px dashed ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'var(--ant-color-border)'};
`;

const MessageContent = styled.div<{ $isUser?: boolean; $sending?: boolean; $error?: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  background: ${props => props.$isUser 
    ? props.theme.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(59, 130, 246, 0.08)'
    : props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.04)'
      : 'var(--ant-color-bg-container)'};
  border: ${props => {
    if (props.$error) return '0.5px solid var(--ant-color-error)';
    if (props.$sending) return '0.5px solid var(--ant-color-warning)';
    return props.$isUser 
      ? props.theme.mode === 'dark'
        ? '0.5px solid rgba(59, 130, 246, 0.2)'
        : '0.5px solid rgba(59, 130, 246, 0.15)'
      : props.theme.mode === 'dark'
        ? '0.5px solid rgba(255, 255, 255, 0.1)'
        : '0.5px solid rgba(0, 0, 0, 0.06)';
  }};
  border-radius: 20px;
  box-shadow: none;
  transition: all 0.3s ease;
  opacity: ${props => props.$sending ? 0.8 : 1};
  position: relative;

  &:hover {
    box-shadow: none;
  }

  color: ${props => props.$isUser 
    ? props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.85)'
      : 'var(--ant-color-text-secondary)'
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
    border: 0.5px solid rgba(0, 0, 0, 0.06);
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

const MessageActions = styled.div<{ $isUser?: boolean }>`
  position: absolute;
  bottom: -24px;
  ${props => props.$isUser ? 'left: 0;' : 'right: 0;'}
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
`;

const ActionButton = styled.button`
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.65)'};
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    transform: translateY(-1px);
  }

  .anticon {
    font-size: 14px;
  }
`;

const MessageContentWrapper = styled.div<{ $isUser?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  max-width: calc(100% - 46px); // 40px avatar + 6px gap
  
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
    background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    border-radius: 3px;
  }

  pre {
    margin: 1em 0;
    padding: 1em;
    overflow: auto;
    background-color: ${props => props.theme.mode === 'dark' ? '#1a1a1a' : '#f6f8fa'};
    border-radius: 6px;
    border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
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
      background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
      border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
      border-radius: 4px;
      color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)'};
      font-size: 12px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s ease;

      &:hover {
        background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
      }
    }

    code {
      background: none;
      padding: 0;
      font-size: 14px;
      color: ${props => props.theme.mode === 'dark' ? '#e6e6e6' : '#24292e'};
      text-shadow: none;
    }

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: ${props => props.theme.mode === 'dark' ? '#6a9955' : '#5c6370'};
      font-style: italic;
    }

    .token.punctuation {
      color: ${props => props.theme.mode === 'dark' ? '#d4d4d4' : '#24292e'};
    }

    .token.property,
    .token.tag,
    .token.constant,
    .token.symbol {
      color: ${props => props.theme.mode === 'dark' ? '#569cd6' : '#0550ae'};
    }

    .token.boolean,
    .token.number {
      color: ${props => props.theme.mode === 'dark' ? '#b5cea8' : '#098658'};
    }

    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted {
      color: ${props => props.theme.mode === 'dark' ? '#ce9178' : '#0a7b07'};
    }

    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .style .token.string {
      color: ${props => props.theme.mode === 'dark' ? '#d4d4d4' : '#24292e'};
    }

    .token.atrule,
    .token.attr-value,
    .token.keyword {
      color: ${props => props.theme.mode === 'dark' ? '#c586c0' : '#cf222e'};
    }

    .token.function {
      color: ${props => props.theme.mode === 'dark' ? '#dcdcaa' : '#8250df'};
    }

    .token.class-name {
      color: ${props => props.theme.mode === 'dark' ? '#4ec9b0' : '#116329'};
    }

    .token.regex,
    .token.important,
    .token.variable {
      color: ${props => props.theme.mode === 'dark' ? '#d16969' : '#953800'};
    }

    .token.deleted {
      color: ${props => props.theme.mode === 'dark' ? '#f14c4c' : '#82071e'};
    }

    .token.important,
    .token.bold {
      font-weight: bold;
    }

    .token.italic {
      font-style: italic;
    }
  }

  blockquote {
    margin: 1em 0;
    padding: 0 1em;
    color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
    border-left: 0.25em solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  }

  table {
    width: 100%;
    margin: 0.5em 0;
    border-collapse: collapse;
    border-spacing: 0;
    display: block;
    overflow-x: auto;
    white-space: normal;
    
    th, td {
      padding: 0.5em 1em;
      border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
      text-align: left;
      vertical-align: top;
      line-height: 1.5;
      min-width: 100px;
    }

    th {
      background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
      font-weight: 600;
      white-space: nowrap;
    }

    tr:nth-child(even) {
      background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'};
    }

    tr:hover {
      background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
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
    background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
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

interface MarkdownImageProps {
  src?: string;
  alt?: string;
}

interface MarkdownLinkProps {
  href?: string;
  children?: React.ReactNode;
}

interface MarkdownComponents {
  [key: string]: React.ComponentType<any>;
}

const parseMessageContent = (content: string, isUser?: boolean) => {
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(content).then(() => {
      message.success('消息已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败，请手动复制');
    });
  };

  // 预处理内容，处理 Java 转义的字符串
  const processedContent = content
    .replace(/\\n/g, '\n')  // 将 Java 转义的 \n 转换为实际的换行符
    .replace(/\r\n/g, '\n')  // 统一换行符
    .replace(/\n{3,}/g, '\n\n')  // 将连续的3个或更多换行符替换为2个
    .replace(/(?:\n\n)(\|)/g, '\n$1')  // 移除表格前的多余换行，保留一个
    .replace(/\|(?:\n\n)/g, '|\n')  // 移除表格后的多余换行，保留一个
    .replace(/^\s+|\s+$/g, '');  // 去除首尾空白

  const components: MarkdownComponents = {
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <ImageWrapper>
        <Image
          src={src || ''}
          alt={alt}
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
    ),
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    code: ({ node, inline, className, children, ...props }: { 
      node?: any; 
      inline?: boolean; 
      className?: string; 
      children: React.ReactNode;
    }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline) {
        const handleCopy = () => {
          const code = String(children).replace(/\n$/, '');
          navigator.clipboard.writeText(code).then(() => {
            message.success('代码已复制到剪贴板');
          }).catch(() => {
            message.error('复制失败，请手动复制');
          });
        };

        return (
          <div style={{ position: 'relative' }}>
            <pre className={className} {...props}>
              <code className={className} {...props}>
                {children}
              </code>
              <button className="copy-button" onClick={handleCopy}>
                复制代码
              </button>
            </pre>
          </div>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <MarkdownContent>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex, rehypePrism]}
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      </MarkdownContent>
      <MessageActions $isUser={isUser}>
        <ActionButton onClick={handleCopyMessage} title="复制消息">
          <CopyOutlined />
        </ActionButton>
      </MessageActions>
    </div>
  );
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