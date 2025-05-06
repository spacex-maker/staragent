import React from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { SessionListHeaderContainer, SessionListTitle, TitleText, NewSessionButton } from '../styles';
import { FormattedMessage } from 'react-intl';

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
        <TitleText>
          <FormattedMessage id="sessionList.title" defaultMessage="会话列表" />
        </TitleText>
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
        <FormattedMessage id="sessionList.newSession" defaultMessage="新会话" />
      </NewSessionButton>
    </SessionListHeaderContainer>
  );
};

export default SessionListHeader; 