import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef, useCallback } from 'react';
import { List, Typography, Button, Spin, Empty, Pagination, message } from 'antd';
import { MessageOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ChatSession, PaginationParams } from '../../types';
import axios from '../../../../api/axios';

const { Text, Paragraph } = Typography;

const SessionListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid var(--ant-color-border);
  width: 280px;
  background: var(--ant-color-bg-container);
`;

const SessionListHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--ant-color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SessionListTitle = styled(Text)`
  font-size: 16px;
  font-weight: 500;
`;

const SessionListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const SessionItem = styled(List.Item)<{ active: boolean }>`
  padding: 12px !important;
  margin: 8px 0;
  border-radius: 8px !important;
  background: ${({ active, theme }) => 
    active 
      ? 'var(--ant-color-primary-bg)' 
      : theme.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.04)' 
        : 'rgba(0, 0, 0, 0.02)'};
  position: relative;
  border: 1px solid ${({ active }) => 
    active 
      ? 'var(--ant-color-primary)' 
      : 'var(--ant-color-border)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ active, theme }) => 
      active 
        ? 'var(--ant-color-primary-bg)' 
        : theme.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.08)' 
          : 'rgba(0, 0, 0, 0.04)'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const SessionTitle = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LastMessage = styled(Paragraph)`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageCount = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--ant-color-primary);
  color: white;
  border-radius: 10px;
  padding: 0 6px;
  font-size: 12px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaginationContainer = styled.div`
  padding: 12px;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--ant-color-border);
`;

const NewSessionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

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
  const [pagination, setPagination] = useState<PaginationParams>({
    currentPage: 1,
    pageSize: 10
  });
  const [total, setTotal] = useState(0);

  // 暴露刷新方法给父组件
  useImperativeHandle(ref, () => ({
    refreshSessions: () => {
      fetchSessions();
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

  // 只在组件挂载时和projectId/分页信息变化时获取会话列表
  useEffect(() => {
    if (projectId) {
      fetchSessions();
    } else {
      setSessions([]);
    }
  }, [projectId, pagination.currentPage, pagination.pageSize]);

  // 使用useCallback包装fetchSessions函数，避免重复创建
  const fetchSessions = useCallback(async () => {
    const currentProjectId = projectIdRef.current;
    if (!currentProjectId) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/chat/sessions', {
        params: {
          projectId: currentProjectId,
          currentPage: paginationRef.current.currentPage,
          pageSize: paginationRef.current.pageSize
        }
      });
      
      if (response.data.success) {
        setSessions(response.data.data.data || []);
        setTotal(response.data.data.totalNum || 0);
      } else {
        message.error(response.data.message || '获取会话列表失败');
      }
    } catch (error) {
      console.error('获取会话列表错误:', error);
      message.error('获取会话列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      currentPage: page,
      pageSize: pageSize || pagination.pageSize
    });
  };

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
        <SessionListTitle>会话列表</SessionListTitle>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchSessions}
            disabled={!projectId || loading}
            size="small"
          />
          <NewSessionButton 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onNewSession}
            disabled={!projectId}
          >
            新会话
          </NewSessionButton>
        </div>
      </SessionListHeader>
      
      <SessionListContent>
        {loading ? (
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <Spin tip="加载中..." />
          </div>
        ) : sessions.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={projectId ? "暂无会话，点击新会话按钮开始" : "请先选择一个项目"}
            style={{ margin: '40px 0' }}
          />
        ) : (
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
              </SessionItem>
            )}
          />
        )}
      </SessionListContent>
      
      {total > pagination.pageSize && (
        <PaginationContainer>
          <Pagination
            simple
            current={pagination.currentPage}
            pageSize={pagination.pageSize}
            total={total}
            onChange={handlePageChange}
          />
        </PaginationContainer>
      )}
    </SessionListContainer>
  );
});

export default SessionList; 