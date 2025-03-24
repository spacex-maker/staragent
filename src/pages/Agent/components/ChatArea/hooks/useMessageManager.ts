import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import axios from '../../../../../api/axios';
import { Message, FrontendMessage } from '../../../types';

const PAGE_SIZE = 20;

export const useMessageManager = (messages: Message[], activeSessionId: string | null) => {
  const [sessionMessages, setSessionMessages] = useState<(Message | FrontendMessage)[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  // 获取会话消息
  const fetchSessionMessages = useCallback(async (sessionId: string, loadMore: boolean = false) => {
    if (!sessionId) return;
    
    if (loadMore) {
      console.log('开始加载更多历史消息');
      setLoadingMore(true);
    } else {
      console.log('开始加载会话消息');
      setLoading(true);
      setMessagesLoaded(false); // 重置加载完成状态
      setHasMore(true); // 每次初始加载时重置hasMore状态
    }

    try {
      // 使用函数式更新来获取最新状态，避免依赖
      let minId = null;
      
      if (loadMore) {
        // 获取当前会话消息的最小ID
        // 创建一个Promise，确保在获取到minId后再继续
        const getMinIdPromise = new Promise<number | null>((resolve) => {
          setSessionMessages(prev => {
            if (prev && prev.length > 0) {
              try {
                // 确保所有消息都有id属性
                const validMessages = prev.filter(msg => typeof msg.id === 'number');
                if (validMessages.length > 0) {
                  const ids = validMessages.map(msg => msg.id as number);
                  minId = Math.min(...ids);
                  console.log('当前消息最小ID:', minId, '来自', validMessages.length, '条有效消息');
                } else {
                  console.log('没有找到有效的消息ID');
                }
              } catch (err) {
                console.error('计算最小ID时出错:', err);
              }
            } else {
              console.log('当前没有消息，无法获取最小ID');
            }
            resolve(minId);
            return prev;
          });
        });
        
        // 等待获取minId
        await getMinIdPromise;
      }

      console.log('发送API请求获取消息历史:', {
        sessionId,
        loadMore,
        beforeId: minId,
        pageSize: PAGE_SIZE
      });
      
      const response = await axios.get('/chat/history', {
        params: {
          sessionId,
          pageSize: PAGE_SIZE,
          beforeId: minId
        }
      });
      
      if (response.data.success) {
        const newMessages = response.data.data || [];
        console.log(`获取到${newMessages.length}条历史消息`);
        
        // 根据获取的消息数量判断是否还有更多
        const moreAvailable = newMessages.length === PAGE_SIZE;
        console.log(`是否有更多消息: ${moreAvailable ? '是' : '否'} (${newMessages.length}/${PAGE_SIZE})`);
        setHasMore(moreAvailable);
        
        if (loadMore) {
          setSessionMessages(prev => {
            console.log('合并新消息到现有消息列表', '现有消息:', prev.length, '新消息:', newMessages.length);
            // 确保不重复添加消息
            const existingIds = new Set(prev.map(msg => msg.id));
            const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
            console.log('过滤后的唯一新消息:', uniqueNewMessages.length);
            
            return [...uniqueNewMessages, ...prev];
          });
        } else {
          setSessionMessages(newMessages);
          setMessagesLoaded(true); // 设置消息加载完成
        }
      } else {
        message.error(response.data.message || '获取会话消息失败');
        setHasMore(false); // 请求失败时设置hasMore为false
      }
    } catch (error) {
      console.error('获取会话消息错误:', error);
      message.error('获取会话消息失败，请稍后重试');
    } finally {
      if (loadMore) {
        console.log('加载更多消息完成');
        setLoadingMore(false);
      } else {
        setLoading(false);
        if (!loadMore) {
          setMessagesLoaded(true); // 确保加载状态结束时也标记为已加载
        }
      }
    }
  }, []); // 不依赖sessionMessages，避免无限循环

  // 处理加载更多消息
  const handleLoadMore = useCallback(() => {
    console.log('=== useMessageManager.handleLoadMore被调用! ===');
    console.log('状态信息：', {
      activeSessionId,
      loadingMore,
      hasMore,
      messagesCount: sessionMessages.length
    });
    
    if (!activeSessionId) {
      console.error('无法加载更多历史消息: 没有活动会话ID');
      return;
    }
    
    if (loadingMore) {
      console.warn('无法加载更多历史消息: 当前已经在加载中');
      return;
    }
    
    // 如果hasMore为false，在这里强制设置为true（仅用于调试）
    if (!hasMore) {
      console.warn('hasMore=false，尝试强制设置为true并继续加载');
      setHasMore(true);
    }
    
    console.log('准备加载更多历史消息，会话ID:', activeSessionId);
    try {
      // 强制将loadingMore设为true，防止重复触发
      setLoadingMore(true);
      setTimeout(() => {
        console.log('发起历史消息请求');
        fetchSessionMessages(activeSessionId, true)
          .catch(error => {
            console.error('加载历史消息请求失败:', error);
            setLoadingMore(false);
          });
      }, 100); // 短暂延迟，确保状态已更新
    } catch (error) {
      console.error('加载更多消息出错:', error);
      // 确保发生错误时重置加载状态
      setLoadingMore(false);
    }
  }, [activeSessionId, loadingMore, hasMore, fetchSessionMessages, sessionMessages.length]);

  // 强制重置hasMore状态
  const forceResetHasMore = useCallback(() => {
    console.log('强制重置useMessageManager中的hasMore状态为true');
    setHasMore(true);
  }, []);

  // 更新会话消息
  const updateSessionMessages = useCallback((
    updater: (prev: (Message | FrontendMessage)[]) => (Message | FrontendMessage)[]
  ) => {
    setSessionMessages(updater);
  }, []);

  // 清空会话消息
  const clearSessionMessages = useCallback(() => {
    setSessionMessages([]);
    setHasMore(true); // 重置hasMore为true，以便可以加载历史消息
    setMessagesLoaded(false);
  }, []);

  // 监听会话切换，自动加载消息
  useEffect(() => {
    let mounted = true;

    if (activeSessionId) {
      console.log('会话切换，加载消息:', activeSessionId);
      // 新会话默认假设有更多消息可加载
      setHasMore(true);
      fetchSessionMessages(activeSessionId, false);
    } else {
      clearSessionMessages();
    }

    return () => {
      mounted = false;
    };
  }, [activeSessionId, fetchSessionMessages, clearSessionMessages]);

  // 监听消息更新
  useEffect(() => {
    if (!messages || !activeSessionId) return;

    const currentSessionMessages = messages.filter(msg => msg.sessionId === activeSessionId);
    
    if (currentSessionMessages.length > 0) {
      setSessionMessages(prev => {
        const withoutTemp = prev.filter(msg => !('sending' in msg && msg.sending));
        const updatedMessages = [...withoutTemp];
        
        let hasChanges = false;
        
        currentSessionMessages.forEach(msg => {
          if (!withoutTemp.some(m => m.id === msg.id)) {
            updatedMessages.push(msg);
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          const sortedMessages = updatedMessages.sort((a, b) => 
            new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
          );
          return sortedMessages;
        }
        
        return prev;
      });
    }
  }, [messages, activeSessionId]); // 使用函数式更新，不需要依赖sessionMessages

  return {
    sessionMessages,
    loading,
    loadingMore,
    hasMore,
    messagesLoaded,
    handleLoadMore,
    updateSessionMessages,
    clearSessionMessages,
    fetchSessionMessages,
    forceResetHasMore
  };
}; 