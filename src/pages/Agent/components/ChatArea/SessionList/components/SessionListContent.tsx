import React, { forwardRef } from 'react';
import { List, Spin, Empty } from 'antd';
import { ChatSession } from '../../../../types';
import SessionCard from './SessionCard';
import { FormattedMessage } from 'react-intl';
import {
  SessionListContentContainer,
  LoadingContainer,
  LoadMoreText,
  NoMoreText,
} from '../styles';

interface SessionListContentProps {
  sessions: ChatSession[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  projectId: string | null;
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onLoadMore: () => void;
}

const SessionListContent = forwardRef<HTMLDivElement, SessionListContentProps>(({
  sessions,
  loading,
  loadingMore,
  hasMore,
  projectId,
  activeSessionId,
  onSessionSelect,
  onLoadMore,
}, ref) => {
  // 处理会话选择
  const handleSessionSelect = (sessionId: string) => {
    if (sessionId !== activeSessionId) {
      onSessionSelect(sessionId);
    }
  };

  return (
    <SessionListContentContainer ref={ref}>
      {loading ? (
        <LoadingContainer>
          <Spin tip={<FormattedMessage id="sessionList.loading" defaultMessage="加载中..." />} />
        </LoadingContainer>
      ) : sessions.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={
            projectId 
              ? <FormattedMessage id="sessionList.empty" defaultMessage="暂无会话，点击新会话按钮开始" />
              : <FormattedMessage id="sessionList.selectProject" defaultMessage="请先选择一个项目" />
          }
          style={{ margin: '40px 0' }}
        />
      ) : (
        <>
          <List
            dataSource={sessions}
            renderItem={(session) => (
              <SessionCard
                session={session}
                active={activeSessionId ? session.id === parseInt(activeSessionId, 10) : false}
                onClick={() => handleSessionSelect(session.id.toString())}
              />
            )}
          />
          {loadingMore && (
            <LoadingContainer>
              <Spin size="small" />
            </LoadingContainer>
          )}
          {!loadingMore && hasMore && sessions.length > 0 && (
            <LoadMoreText onClick={onLoadMore}>
              <FormattedMessage id="sessionList.loadMore" defaultMessage="加载更多" />
            </LoadMoreText>
          )}
          {!loadingMore && !hasMore && sessions.length > 0 && (
            <NoMoreText>
              <FormattedMessage id="sessionList.noMore" defaultMessage="已加载全部会话" />
            </NoMoreText>
          )}
        </>
      )}
    </SessionListContentContainer>
  );
});

export default SessionListContent; 