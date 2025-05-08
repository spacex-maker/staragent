import React, { useEffect, useState,  useRef } from 'react';
import { Avatar, Spin, Tag } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Message, FrontendMessage, ProjectAgent } from '../../types';
import MessageContent from './MessageContent';
import EmptyChat from './EmptyChat';
import { useIntl } from 'react-intl';

// 定义样式组件的属性接口
interface StyledProps {
  $isUser?: boolean;  // 是否为用户消息
  $sending?: boolean; // 是否正在发送
  $error?: boolean;   // 是否发送失败
  children?: React.ReactNode;
}

// 消息列表的主容器样式
const StyledMessageList = styled.div`
  flex: 1;
  padding: 8px;
  width: 100%;
  overflow: visible;
  display: flex;
  flex-direction: column;
  min-height: 0;
  
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
`;

// 单条消息项的样式
const MessageItem = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
  margin-bottom: 16px;
  width: 100%;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// 消息容器样式，控制消息的布局方向
const MessageContainer = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
  gap: 8px;
  max-width: 80%;
  margin: ${props => props.$isUser ? '0 0 0 auto' : '0 auto 0 0'};
`;

// 头像容器样式
const AvatarContainer = styled.div<{ $isUser: boolean }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin: ${props => props.$isUser ? '0 0 0 8px' : '0 8px 0 0'};
`;

// 头像样式
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

// 消息信息区域样式（用户名、时间等）
const MessageInfo = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

// 用户名样式
const UserName = styled.span<{ $isUser: boolean }>`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  font-weight: 500;
`;

// 加载状态容器样式
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

// AI助手标签样式
const AgentTag = styled(Tag)`
  margin: 0;
  font-size: 12px;
  padding: 0 8px;
  height: 20px;
  line-height: 18px;
`;

// 消息内容包装器样式
const MessageContentWrapper = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
`;

// 消息气泡样式
const MessageBubble = styled.div<{ $isUser: boolean; $sending?: boolean; $error?: boolean }>`
  padding: 8px 12px;
  border-radius: 12px;
  background: ${props => props.$isUser ? 'var(--ant-color-primary)' : 'var(--ant-color-bg-container)'};
  color: ${props => props.$isUser ? 'white' : 'var(--ant-color-text)'};
  border: 1px solid ${props => props.$isUser ? 'var(--ant-color-primary)' : 'var(--ant-color-border)'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  opacity: ${props => props.$sending ? 0.7 : 1};
  border-color: ${props => props.$error ? 'var(--ant-color-error)' : undefined};
  max-width: 100%;
  word-break: break-word;
`;

// 消息状态样式（发送中、发送失败等）
const MessageStatus = styled.div<{ $error?: boolean }>`
  font-size: 12px;
  color: ${props => props.$error ? 'var(--ant-color-error)' : 'var(--ant-color-text-secondary)'};
  margin-top: 4px;
  text-align: right;
`;

// Token计数器样式
const TokenCounter = styled.div<{ $isUser: boolean }>`
  font-size: 11px;
  color: var(--ant-color-text-quaternary);
  margin-top: 2px;
  text-align: ${props => props.$isUser ? 'right' : 'left'};
  padding: 0 4px;
`;

// 组件属性接口定义
interface MessageListProps {
  messages: (Message | FrontendMessage)[];  // 消息列表
  loading?: boolean;                        // 是否正在加载
  loadingMore?: boolean;                    // 是否正在加载更多
  hasMore?: boolean;                        // 是否还有更多消息
  onLoadMore?: () => void;                  // 加载更多回调
  projectAgents?: ProjectAgent[];           // 项目中的AI助手列表
  onNavigateToAgents?: () => void;         // 导航到AI助手页面的回调
  messageListRef?: React.RefObject<HTMLDivElement>; // 消息列表的引用，实际上是父容器的引用
  activeSessionId?: string | null;         // 当前活动会话ID
}

// 估算文本中的token数量
const estimateTokens = (text: string): number => {
  // 针对中文：一个中文字符约为1.5个tokens
  // 针对英文：平均每4个字符约为1个token
  // 针对代码：保守估计每2个字符约为1个token
  
  if (!text) return 0;
  
  // 去除空白字符进行计算以提高准确性
  const trimmedText = text.trim();
  
  // 计算中文字符数量
  const chineseChars = trimmedText.match(/[\u4e00-\u9fa5]/g) || [];
  const chineseTokens = chineseChars.length * 1.5;
  
  // 计算英文和数字
  const englishChars = trimmedText.match(/[a-zA-Z0-9]/g) || [];
  const englishTokens = englishChars.length / 4;
  
  // 计算特殊字符和标点
  const specialChars = trimmedText.match(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g) || [];
  const specialTokens = specialChars.length * 1; // 明确乘以1，确保是数字类型
  
  // 计算空格
  const spaces = trimmedText.match(/\s/g) || [];
  const spaceTokens = spaces.length / 4;
  
  // 如果文本包含多行代码（通过检测是否包含连续3个`符号来判断）
  const codeBlocks = trimmedText.match(/```[\s\S]*?```/g) || [];
  let codeTokens = 0;
  
  codeBlocks.forEach((block: string) => {
    // 对于代码块，使用更高的token估计
    const codeChars = block.length - 6; // 减去```的长度
    codeTokens += codeChars / 2;
  });
  
  // 结合所有结果并四舍五入
  const totalTokens = Number(
    chineseTokens + 
    englishTokens + 
    specialTokens + 
    spaceTokens + 
    codeTokens
  );
  
  return Math.max(1, Math.round(totalTokens));
};

// 消息列表组件
const MessageList: React.FC<MessageListProps> = ({ 
  messages,
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  projectAgents = [],
  onNavigateToAgents,
  messageListRef,
  activeSessionId
}) => {
  const [userInfo, setUserInfo] = useState<{ username: string; avatar?: string } | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intl = useIntl(); // 使用react-intl的useIntl钩子获取国际化功能
  
  // 从父容器获取滚动事件
  useEffect(() => {
    if (!messageListRef?.current || !onLoadMore) return;
    
    const handleScroll = () => {
      const container = messageListRef.current;
      if (!container || loadingMore) return;
      
      const scrollPosition = Math.round(container.scrollTop);
      
      // 当滚动到顶部附近时加载更多消息
      if (scrollPosition < 50 && hasMore) {
        // 防抖处理，避免频繁触发
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(() => {
          onLoadMore();
        }, 300);
      }
    };
    
    const currentRef = messageListRef.current;
    currentRef.addEventListener('scroll', handleScroll);
    currentRef.addEventListener('touchmove', handleScroll);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
        currentRef.removeEventListener('touchmove', handleScroll);
      }
    };
  }, [messageListRef, hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // 获取AI助手的头像
  const getAgentAvatar = (agentId: number | null) => {
    if (!agentId) return null;
    const agent = projectAgents.find(a => a.agentId === agentId);
    return agent?.avatarUrl || null;
  };

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" tip="加载消息中..." />
      </LoadingContainer>
    );
  }

  // 如果没有消息，显示空状态
  if (!messages || messages.length === 0) {
    return (
      <EmptyChat 
        projectAgents={projectAgents} 
        onNavigateToAgents={onNavigateToAgents} 
      />
    );
  }

  // 渲染消息列表
  return (
    <>
      {/* 加载更多时显示的顶部加载提示 */}
      {loadingMore && (
        <LoadingContainer style={{ padding: '8px 0' }}>
          <Spin size="small" tip={intl.formatMessage({ id: 'chat.loadingHistory' })} />
        </LoadingContainer>
      )}
    
      
      <StyledMessageList>
        {messages.map((msg) => {
          // 判断消息类型
          const isUser = msg.role === 'user';
          const isSending = 'sending' in msg && msg.sending === true;
          const hasError = 'error' in msg && msg.error === true;
          const avatarUrl = isUser ? userInfo?.avatar : getAgentAvatar(msg.agentId);
          const tokenCount = estimateTokens(msg.content);
          
          return (
            <MessageItem key={msg.id} $isUser={isUser}>
              <MessageContainer $isUser={isUser}>
                {/* 头像区域 */}
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
                    <StyledAvatar 
                      $isUser={false}
                      src={avatarUrl}
                      icon={!avatarUrl && <RobotOutlined />}
                    />
                  )}
                </AvatarContainer>

                {/* 消息内容区域 */}
                <MessageContentWrapper $isUser={isUser}>
                  {/* 消息信息（用户名、标签等） */}
                  <MessageInfo $isUser={isUser}>
                    <UserName $isUser={isUser}>
                      {isUser ? userInfo?.username || intl.formatMessage({ id: 'chat.user' }) : msg.agentName || intl.formatMessage({ id: 'chat.aiAssistant' })}
                    </UserName>
                    {!isUser && (
                      <>
                        <AgentTag color="blue">{msg.role || 'AI'}</AgentTag>
                        {msg.model && <AgentTag color="purple">{msg.model}</AgentTag>}
                      </>
                    )}
                  </MessageInfo>

                  {/* 消息气泡 */}
                  <MessageBubble 
                    $isUser={isUser}
                    $sending={isSending}
                    $error={hasError}
                  >
                    <MessageContent content={msg.content} />
                  </MessageBubble>

                  {/* Token计数和花费信息 */}
                  <TokenCounter $isUser={isUser}>
                    {!isUser && msg.contextTokens && msg.contentTokens ? (
                      <>
                        <div>
                          {intl.formatMessage(
                            { id: 'chat.contextTokens' },
                            { count: msg.contextTokens }
                          )}
                          {' | '}
                          {intl.formatMessage(
                            { id: 'chat.contentTokens' },
                            { count: msg.contentTokens }
                          )}
                        </div>
                        {(msg.promptCost !== null || msg.completionCost !== null) && (
                          <div style={{ color: 'var(--ant-color-primary)', marginTop: '2px' }}>
                            {msg.promptCost !== null && (
                              <span>
                                {intl.formatMessage(
                                  { id: 'chat.promptCost' },
                                  { cost: msg.promptCost, unit: msg.unit || '$' }
                                )}
                              </span>
                            )}
                            {msg.promptCost !== null && msg.completionCost !== null && ' | '}
                            {msg.completionCost !== null && (
                              <span>
                                {intl.formatMessage(
                                  { id: 'chat.completionCost' },
                                  { cost: msg.completionCost, unit: msg.unit || '$' }
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        {intl.formatMessage(
                          { id: 'chat.tokenConsumption' },
                          { count: estimateTokens(msg.content) }
                        )}
                      </div>
                    )}
                  </TokenCounter>

                  {/* 消息状态 */}
                  {(isSending || hasError) && (
                    <MessageStatus $error={hasError}>
                      {isSending 
                        ? intl.formatMessage({ id: 'chat.sending' }) 
                        : intl.formatMessage({ id: 'chat.sendFailed' })}
                    </MessageStatus>
                  )}
                </MessageContentWrapper>
              </MessageContainer>
            </MessageItem>
          );
        })}
      </StyledMessageList>
    </>
  );
};

export default MessageList; 