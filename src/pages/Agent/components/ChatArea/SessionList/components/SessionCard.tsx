import React from 'react';
import { Typography, Tooltip } from 'antd';
import styled from 'styled-components';
import { List } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FormattedMessage, useIntl } from 'react-intl';

const { Text, Paragraph } = Typography;

interface SessionCardProps {
  session: {
    id: number;
    title: string;
    lastMessage: string | null;
    messageCount: number;
    createTime: string;
  };
  active: boolean;
  onClick: () => void;
}

// Styled Components
const SessionItem = styled(List.Item)<{ active: boolean }>`
  padding: 12px !important;
  margin: 8px 0;
  border-radius: 8px !important;
  background: ${({ active, theme }) => 
    active 
      ? theme.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.15)'
        : 'rgba(59, 130, 246, 0.08)'
      : theme.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.04)' 
        : 'rgba(0, 0, 0, 0.02)'};
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ active, theme }) => 
      active 
        ? theme.mode === 'dark'
          ? 'rgba(59, 130, 246, 0.2)'
          : 'rgba(59, 130, 246, 0.12)'
        : theme.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.08)' 
          : 'rgba(0, 0, 0, 0.04)'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const SessionTitle = styled(Text)`  font-weight: 500;
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
  color: var(--ant-color-white);
  border-radius: 10px;
  padding: 0 6px;
  font-size: 12px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeText = styled(Text)`
  font-size: 10px;
  color: var(--ant-color-text-quaternary);
  position: absolute;
  bottom: 4px;
  right: 12px;
`;

const SessionCard: React.FC<SessionCardProps> = ({ session, active, onClick }) => {
  const intl = useIntl();
  
  // 格式化最后一条消息
  const formatLastMessage = (message: string | null) => {
    if (!message) return intl.formatMessage({ id: 'sessionCard.noMessage' });
    
    // 如果消息包含图片链接，替换为[图片]
    if (message.includes('![') && message.includes('](')) {
      return intl.formatMessage({ id: 'sessionCard.image' });
    }
    
    // 如果消息包含LaTeX公式，替换为[数学公式]
    if (message.includes('\\[') || message.includes('\\]') || message.includes('$')) {
      return intl.formatMessage({ id: 'sessionCard.formula' });
    }
    
    return message;
  };

  // 格式化相对时间（用于tooltip）
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <SessionItem active={active} onClick={onClick}>
      <div style={{ width: '100%' }}>
        <SessionTitle>{session.title}</SessionTitle>
        <LastMessage>
          {formatLastMessage(session.lastMessage)}
        </LastMessage>
      </div>
      {session.messageCount > 0 && (
        <MessageCount>{session.messageCount}</MessageCount>
      )}
      <Tooltip title={formatRelativeTime(session.createTime)}>
        <TimeText>{session.createTime}</TimeText>
      </Tooltip>
    </SessionItem>
  );
};

export default SessionCard; 
