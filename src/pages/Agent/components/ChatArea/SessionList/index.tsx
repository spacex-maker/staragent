import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef, useCallback } from 'react';
import { message } from 'antd';
import { ChatSession, PaginationParams } from '../../../types';
import axios from '../../../../../api/axios';
import { SessionListContainer } from './styles';
import SessionListHeader from './components/SessionListHeader';
import SessionListContent from './components/SessionListContent';

// 导出组件接口，用于父组件调用刷新方法
export interface SessionListRef {
  refreshSessions: () => void;
}

interface SessionListProps {
  projectId: string | null;
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => Promise<void>;
}

const SessionList = forwardRef<SessionListRef, SessionListProps>(({
  projectId,
  activeSessionId,
  onSessionSelect,
  onNewSession
}, ref) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newSessionLoading, setNewSessionLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    currentPage: 1,
    pageSize: 10
  });
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sessionListRef = useRef<HTMLDivElement>(null);

  // 使用useRef保存projectId和sessions长度，避免频繁触发useEffect
  const projectIdRef = useRef(projectId);
  const sessionsLengthRef = useRef(0);

  // 使用useCallback包装fetchSessions函数，避免重复创建
  const fetchSessions = useCallback(async (page: number) => {
    const currentProjectId = projectIdRef.current;
    
    if (!currentProjectId) return;
    
    const isFirstPage = page === 1;
    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await axios.get('/chat/sessions', {
        params: {
          projectId: currentProjectId,
          currentPage: page,
          pageSize: pagination.pageSize
        }
      });
      
      if (response.data.success) {
        const newSessions = response.data.data.data || [];
        const totalCount = response.data.data.totalNum || 0;
        
        setTotal(totalCount);
        
        if (isFirstPage) {
          setSessions(newSessions);
          sessionsLengthRef.current = newSessions.length;
          // 如果有会话且没有激活的会话，自动选中第一个
          if (newSessions.length > 0 && !activeSessionId) {
            console.log('自动选中第一个会话:', newSessions[0]);
            onSessionSelect(newSessions[0].id.toString());
          }
        } else {
          setSessions(prev => {
            const updatedSessions = [...prev, ...newSessions];
            sessionsLengthRef.current = updatedSessions.length;
            return updatedSessions;
          });
        }
        
        const currentSessionCount = sessionsLengthRef.current;
        setHasMore(currentSessionCount < totalCount);
      } else {
        message.error(response.data.message || '获取会话列表失败');
      }
    } catch (error) {
      console.error('获取会话列表错误:', error);
      message.error('获取会话列表失败，请稍后重试');
      throw error;
    } finally {
      if (isFirstPage) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [pagination.pageSize]); // 只依赖 pageSize

  // 重置状态并刷新
  const resetAndRefresh = useCallback(async () => {
    setHasMore(true);
    setSessions([]);
    setLoadingMore(false);
    sessionsLengthRef.current = 0;
    setPagination({
      currentPage: 1,
      pageSize: 10
    });
    
    await fetchSessions(1);
  }, [fetchSessions]);

  // 加载更多会话
  const loadMoreSessions = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    const nextPage = pagination.currentPage + 1;
    setPagination(prev => ({
      ...prev,
      currentPage: nextPage
    }));
    fetchSessions(nextPage);
  }, [loadingMore, hasMore, pagination.currentPage, fetchSessions]);

  // 当projectId变化时，更新ref值并重置会话列表
  useEffect(() => {
    console.log('SessionList - projectId changed:', projectId);
    projectIdRef.current = projectId;
    
    if (projectId) {
      console.log('SessionList - fetching sessions for project:', projectId);
      resetAndRefresh().catch(error => {
        console.error('初始化会话列表失败:', error);
      });
    } else {
      setSessions([]);
      setHasMore(false);
    }
  }, [projectId, resetAndRefresh]);

  // 处理新建会话
  const handleNewSession = async () => {
    if (newSessionLoading || loading) return;
    
    try {
      setNewSessionLoading(true);
      await onNewSession();
      // 等待会话列表刷新完成
      await resetAndRefresh();
    } catch (error) {
      console.error('创建新会话失败:', error);
      message.error('创建新会话失败，请稍后重试');
    } finally {
      setNewSessionLoading(false);
    }
  };

  // 暴露刷新方法给父组件
  useImperativeHandle(ref, () => ({
    refreshSessions: () => {
      resetAndRefresh().catch(error => {
        console.error('刷新会话列表失败:', error);
      });
    }
  }), [resetAndRefresh]);

  // 监听滚动事件，实现无限滚动
  useEffect(() => {
    const handleScroll = () => {
      if (sessionListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = sessionListRef.current;
        if (scrollHeight - scrollTop - clientHeight < 100) {
          loadMoreSessions();
        }
      }
    };
    
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const debouncedHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(handleScroll, 200);
    };
    
    const currentRef = sessionListRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', debouncedHandleScroll);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', debouncedHandleScroll);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, loadingMore, hasMore, loadMoreSessions]);

  return (
    <SessionListContainer>
      <SessionListHeader
        projectId={projectId}
        loading={loading}
        newSessionLoading={newSessionLoading}
        onRefresh={resetAndRefresh}
        onNewSession={handleNewSession}
      />
      <SessionListContent
        ref={sessionListRef}
        sessions={sessions}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        projectId={projectId}
        activeSessionId={activeSessionId}
        onSessionSelect={onSessionSelect}
        onLoadMore={loadMoreSessions}
      />
    </SessionListContainer>
  );
});

export default SessionList; 