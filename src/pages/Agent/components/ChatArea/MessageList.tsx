import React, { useEffect, useState,  useRef } from 'react';
import { Avatar, Spin, Tag, Tooltip } from 'antd';
import { UserOutlined, RobotOutlined, ClockCircleOutlined } from '@ant-design/icons';
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
  padding-bottom: 24px; /* 增加底部间距，与输入框保持距离 */
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

// 消息信息区域样式
const MessageInfo = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  flex-wrap: wrap;
`;

// 用户名样式
const UserName = styled.span<{ $isUser: boolean }>`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  font-weight: 500;
  margin-right: 2px;
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
  border-radius: 10px;
`;

// 模型标签样式
const ModelTag = styled(Tag)`
  margin: 0;
  font-size: 12px;
  padding: 0 8px;
  height: 20px;
  line-height: 18px;
  font-weight: 500;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;

// 临时会话标签样式
const TemporaryTag = styled(Tag)`
  margin: 0;
  font-size: 12px;
  padding: 0 8px;
  height: 20px;
  line-height: 18px;
  border-radius: 10px;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(250, 173, 20, 0.15)'
    : 'rgba(250, 173, 20, 0.1)'};
  color: ${props => props.theme.mode === 'dark'
    ? 'rgba(250, 173, 20, 0.85)'
    : 'rgba(250, 173, 20, 0.85)'};
  border: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(250, 173, 20, 0.3)'
    : 'rgba(250, 173, 20, 0.3)'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-color: rgba(250, 173, 20, 0.6);
  }
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
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  align-items: center;
`;

// 免费模型标签样式
const FreeModelTag = styled(Tag)`
  margin-left: 6px;
  font-size: 10px;
  line-height: 16px;
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

// 根据模型类型选择颜色
const getModelTagColor = (modelType: string): string => {
  if (!modelType) return 'default';
  
  const lowerCaseType = modelType.toLowerCase();
  
  // OpenAI 模型
  if (lowerCaseType.includes('gpt-4-turbo')) return 'purple';
  if (lowerCaseType.includes('gpt-4-o')) return 'purple';
  if (lowerCaseType.includes('gpt-4')) return 'purple';
  if (lowerCaseType.includes('gpt-3.5-turbo')) return 'magenta';
  if (lowerCaseType.includes('gpt-3')) return 'magenta';
  if (lowerCaseType.includes('davinci')) return 'magenta';
  
  // Anthropic 模型
  if (lowerCaseType.includes('claude-3')) return 'geekblue';
  if (lowerCaseType.includes('claude-2')) return 'cyan';
  if (lowerCaseType.includes('claude')) return 'cyan';
  
  // Google 模型
  if (lowerCaseType.includes('gemini-pro')) return 'blue';
  if (lowerCaseType.includes('gemini-ultra')) return 'blue';
  if (lowerCaseType.includes('gemini')) return 'blue';
  if (lowerCaseType.includes('palm')) return 'lime';
  
  // xAI 模型
  if (lowerCaseType.includes('grok')) return 'orange';
  
  // Deepseek 模型
  if (lowerCaseType.includes('deepseek-coder')) return 'green';
  if (lowerCaseType.includes('deepseek')) return 'green';
  
  // Meta 模型
  if (lowerCaseType.includes('llama-3')) return 'gold';
  if (lowerCaseType.includes('llama-2')) return 'gold';
  if (lowerCaseType.includes('llama')) return 'gold';
  
  // 百度模型
  if (lowerCaseType.includes('ernie')) return 'red';
  if (lowerCaseType.includes('wenxin')) return 'red';
  
  // 国内其他模型
  if (lowerCaseType.includes('qwen')) return 'orange'; // 通义千问
  if (lowerCaseType.includes('spark')) return 'volcano'; // 讯飞星火
  if (lowerCaseType.includes('glm')) return 'geekblue'; // 智谱GLM
  if (lowerCaseType.includes('baichuan')) return 'lime'; // 百川
  if (lowerCaseType.includes('yi')) return 'purple'; // 01AI的Yi模型
  
  // 其他开源模型
  if (lowerCaseType.includes('mistral')) return 'cyan';
  if (lowerCaseType.includes('mixtral')) return 'cyan';
  if (lowerCaseType.includes('stable')) return 'volcano';
  if (lowerCaseType.includes('falcon')) return 'blue';
  
  return 'default';
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
  
  // 滚动到消息列表底部
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messageListRef?.current) {
      const container = messageListRef.current;
      console.log('滚动到底部', container.scrollHeight);
      
      // 强制滚动到最底部 - 使用更可靠的方法
      setTimeout(() => {
        // 第一次滚动尝试
        container.scrollTop = container.scrollHeight * 2; // 使用更大的值确保滚动到底部
        
        // 再次尝试滚动，确保到达底部
        setTimeout(() => {
          container.scrollTop = container.scrollHeight * 2;
        }, 50);
      }, 100);
    }
  };

  // 使用消息ID检测新消息
  const previousMessagesRef = useRef<{id: string|number, timestamp: number}[]>([]);
  
  useEffect(() => {
    // 如果正在加载历史消息，不执行滚动
    if (loadingMore) {
      return;
    }
    
    if (messages.length > 0) {
      const currentTime = Date.now();
      const lastMessage = messages[messages.length - 1];
      
      // 获取所有当前消息ID
      const currentMessageIds = new Set(messages.map(msg => msg.id));
      
      // 筛选出之前没有的新消息ID
      const newMessages = messages.filter(msg => 
        !previousMessagesRef.current.some(prevMsg => prevMsg.id === msg.id)
      );
      
      // 如果有新消息，并且是最后一条是新增的
      if (newMessages.length > 0 && newMessages.some(msg => msg.id === lastMessage.id)) {
        console.log('检测到底部新消息，滚动到底部', newMessages.length);
        scrollToBottom();
      }
      
      // 更新前一次的消息记录，带上时间戳
      previousMessagesRef.current = messages.map(msg => ({
        id: msg.id,
        timestamp: currentTime
      }));
    }
  }, [messages, loadingMore, activeSessionId]);
  
  // 首次加载时滚动到底部
  useEffect(() => {
    if (messages.length > 0 && !loadingMore && activeSessionId) {
      console.log('首次加载会话，滚动到底部');
      setTimeout(() => scrollToBottom(), 200);
    }
  }, [activeSessionId]);

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
                        {msg.isFreeReq ? (
                          <ModelTag color="purple">
                            <Tooltip title={intl.formatMessage({ id: 'chat.freeModel.tooltip' })}>
                              {intl.formatMessage({ id: 'chat.freeModel' })}
                            </Tooltip>
                          </ModelTag>
                        ) : (
                          msg.model && 
                          <ModelTag color={getModelTagColor(msg.model)}>
                            {msg.model}
                          </ModelTag>
                        )}
                        {msg.temporaryChat && (
                          <TemporaryTag>
                            <ClockCircleOutlined style={{ fontSize: '12px', marginRight: '4px' }} />
                            {intl.formatMessage({ id: 'chat.temporary' })}
                          </TemporaryTag>
                        )}
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
                      </div>
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
        {/* 底部额外空间 */}
        <div style={{ 
          height: '10px', 
          width: '100%', 
          flexShrink: 0, 
          marginBottom: '20px',
          minHeight: '10px'
        }}></div>
      </StyledMessageList>
    </>
  );
};

export default MessageList; 