import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef, useCallback } from 'react';
import { List, Typography, Button, Spin, Empty, message } from 'antd';
import { MessageOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { ChatSession, PaginationParams } from '../../../types';
import axios from '../../../../../api/axios';
import {
  SessionListContainer,
  SessionListHeader,
  SessionListTitle,
  TitleText,
  SessionListContent,
  SessionItem,
  SessionTitle,
  LastMessage,
  MessageCount,
  TimeText,
  LoadingContainer,
  LoadMoreText,
  NoMoreText,
  NewSessionButton
} from './styles';

// 导出组件接口，用于父组件调用刷新方法
export interface SessionListRef {
  refreshSessions: () => void;
}

interface SessionListProps {
  projectId: string | null;
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
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
  const [pagination, setPagination] = useState<PaginationParams>({
    currentPage: 1,
    pageSize: 10
  });
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sessionListRef = useRef<HTMLDivElement>(null);

  // 暴露刷新方法给父组件
  useImperativeHandle(ref, () => ({
    refreshSessions: () => {
      // 重置分页，重新加载第一页
      setPagination({
        currentPage: 1,
        pageSize: 10
      });
      setHasMore(true);
      setSessions([]); // 清空当前会话列表
      setTimeout(() => {
        // 延迟执行fetchSessions，确保pagination更新后再调用
        fetchSessions(true);
      }, 0);
    }
  }));

  // 使用useRef保存projectId和分页信息，避免频繁触发useEffect
  const projectIdRef = useRef(projectId);
  const paginationRef = useRef(pagination);

  // 当projectId或分页信息变化时，更新ref值
  useEffect(() => {
    projectIdRef.current = projectId;
  }, [projectId]);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  // 只在组件挂载时和projectId变化时获取会话列表
  useEffect(() => {
    if (projectId) {
      // 重置分页并清空会话列表
      setPagination({
        currentPage: 1,
        pageSize: 10
      });
      setHasMore(true);
      setSessions([]);
      fetchSessions(true);
    } else {
      setSessions([]);
      setHasMore(false);
    }
  }, [projectId]);

  // 监听滚动事件，实现无限滚动
  useEffect(() => {
    const handleScroll = () => {
      if (!sessionListRef.current || loading || loadingMore || !hasMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = sessionListRef.current;
      // 当滚动到距离底部100px以内时，加载更多
      if (scrollHeight - scrollTop - clientHeight < 100) {
        loadMoreSessions();
      }
    };
    
    // 添加防抖功能，避免频繁触发加载
    let timeoutId: NodeJS.Timeout | null = null;
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
  }, [loading, loadingMore, hasMore]);

  // 加载更多会话
  const loadMoreSessions = () => {
    if (loadingMore || !hasMore) return;
    
    // 增加页码
    setPagination(prev => ({
      ...prev,
      currentPage: prev.currentPage + 1
    }));
    
    // 加载更多
    fetchSessions(false);
  };

  // 使用useCallback包装fetchSessions函数，避免重复创建
  const fetchSessions = useCallback(async (isRefresh: boolean = false) => {
    const currentProjectId = projectIdRef.current;
    const currentPagination = paginationRef.current;
    
    if (!currentProjectId) return;
    
    if (isRefresh) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await axios.get('/chat/sessions', {
        params: {
          projectId: currentProjectId,
          currentPage: currentPagination.currentPage,
          pageSize: currentPagination.pageSize
        }
      });
      
      if (response.data.success) {
        const newSessions = response.data.data.data || [];
        const totalCount = response.data.data.totalNum || 0;
        
        setTotal(totalCount);
        
        // 如果是刷新，直接替换会话列表
        // 如果是加载更多，追加到现有会话列表
        if (isRefresh) {
          setSessions(newSessions);
        } else {
          setSessions(prev => [...prev, ...newSessions]);
        }
        
        // 判断是否还有更多数据
        const currentSessionCount = isRefresh ? newSessions.length : sessions.length + newSessions.length;
        const hasMoreSessions = currentSessionCount < totalCount;
        setHasMore(hasMoreSessions);
        
        // 如果没有更多数据，显示一个提示
        if (!hasMoreSessions && newSessions.length > 0) {
          console.log('已加载全部会话');
        }
      } else {
        message.error(response.data.message || '获取会话列表失败');
      }
    } catch (error) {
      console.error('获取会话列表错误:', error);
      message.error('获取会话列表失败，请稍后重试');
    } finally {
      if (isRefresh) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, []);

  // 处理会话选择
  const handleSessionSelect = (sessionId: string) => {
    // 只有当选择的会话与当前活动会话不同时，才触发选择事件
    if (sessionId !== activeSessionId) {
      onSessionSelect(sessionId);
    }
  };

  return (
    <SessionListContainer>
      <SessionListHeader>
        <SessionListTitle>
          <TitleText>会话列表</TitleText>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              // 完全重置分页状态
              setPagination({
                currentPage: 1,
                pageSize: 10
              });
              setHasMore(true);
              setSessions([]); // 清空当前会话列表
              setLoadingMore(false); // 重置加载更多状态
              // 使用setTimeout确保状态更新后再调用fetchSessions
              setTimeout(() => {
                fetchSessions(true);
              }, 0);
            }}
            disabled={!projectId || loading}
            size="small"
          />
        </SessionListTitle>
        <NewSessionButton 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onNewSession}
          disabled={!projectId}
        >
          新会话
        </NewSessionButton>
      </SessionListHeader>
      
      <SessionListContent ref={sessionListRef}>
        {loading ? (
          <LoadingContainer>
            <Spin tip="加载中..." />
          </LoadingContainer>
        ) : sessions.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={projectId ? "暂无会话，点击新会话按钮开始" : "请先选择一个项目"}
            style={{ margin: '40px 0' }}
          />
        ) : (
          <>
            <List
              dataSource={sessions}
              renderItem={(session) => (
                <SessionItem
                  active={session.id === activeSessionId}
                  onClick={() => handleSessionSelect(session.id)}
                >
                  <div style={{ width: '100%' }}>
                    <SessionTitle>{session.title}</SessionTitle>
                    <LastMessage ellipsis={{ rows: 2 }}>
                      {session.lastMessage}
                    </LastMessage>
                  </div>
                  {session.messageCount > 0 && (
                    <MessageCount>{session.messageCount}</MessageCount>
                  )}
                  <TimeText>{session.createTime}</TimeText>
                </SessionItem>
              )}
            />
            {loadingMore && (
              <LoadingContainer>
                <Spin size="small" />
              </LoadingContainer>
            )}
            {!loadingMore && hasMore && sessions.length > 0 && (
              <LoadMoreText onClick={loadMoreSessions}>
                加载更多
              </LoadMoreText>
            )}
            {!loadingMore && !hasMore && sessions.length > 0 && (
              <NoMoreText>
                已加载全部会话
              </NoMoreText>
            )}
          </>
        )}
      </SessionListContent>
    </SessionListContainer>
  );
});

export default SessionList; 