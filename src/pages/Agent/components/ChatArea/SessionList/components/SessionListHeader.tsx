import React from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { SessionListHeaderContainer, SessionListTitle, TitleText, NewSessionButton } from '../styles';

const { Text } = Typography;

interface SessionListHeaderProps {
  projectId: string | null;
  loading: boolean;
  newSessionLoading: boolean;
  onRefresh: () => void;
  onNewSession: () => void;
}

const SessionListHeader: React.FC<SessionListHeaderProps> = ({
  projectId,
  loading,
  newSessionLoading,
  onRefresh,
  onNewSession,
}) => {
  return (
    <SessionListHeaderContainer>
      <SessionListTitle>
        <TitleText>会话列表</TitleText>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          disabled={!projectId || loading || newSessionLoading}
          size="small"
        />
      </SessionListTitle>
      <NewSessionButton 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={onNewSession}
        disabled={!projectId || newSessionLoading}
        loading={newSessionLoading}
      >
        新会话
      </NewSessionButton>
    </SessionListHeaderContainer>
  );
};

export default SessionListHeader; 