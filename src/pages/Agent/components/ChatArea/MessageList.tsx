import React from 'react';
import { List, Avatar, Typography, Spin, Tag } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Message } from '../../types';

const { Text } = Typography;

const StyledMessageList = styled(List<Message>)`
  flex: 1;
  padding: 0 24px;
  width: 100%;
`;

const MessageItem = styled(List.Item)`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  background: var(--ant-color-bg-container);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

const AgentTag = styled(Tag)`
  margin-left: 8px;
  font-size: 12px;
`;

const MessageTitle = styled.div`
  display: flex;
  align-items: center;
`;

const SystemTag = styled(AgentTag)`
  background-color: var(--ant-color-warning);
  color: #fff;
`;

const SystemMessageContent = styled(Text)`
  color: var(--ant-color-warning-text);
  background-color: var(--ant-color-warning-bg);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
`;

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading = false }) => {
  if (loading) {
    return (
      <LoadingContainer>
        <Spin tip="加载消息中..." />
      </LoadingContainer>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        color: 'var(--ant-color-text-secondary)',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <div style={{ fontSize: '16px', marginBottom: '8px' }}>
          开始一个新的对话
        </div>
        <div style={{ fontSize: '14px' }}>
          在下方输入框中输入您的问题
        </div>
      </div>
    );
  }

  return (
    <StyledMessageList
      dataSource={messages}
      renderItem={(item) => (
        <MessageItem>
          <List.Item.Meta
            avatar={
              <Avatar icon={item.type === 'user' ? <UserOutlined /> : <RobotOutlined />} />
            }
            title={
              <MessageTitle>
                <Text strong>{item.type === 'user' ? '用户' : 'AI助手'}</Text>
                {item.type === 'assistant' && item.agentName && (
                  item.agentName === '系统' ? 
                    <SystemTag>{item.agentName}</SystemTag> : 
                    <AgentTag color="blue">{item.agentName}</AgentTag>
                )}
              </MessageTitle>
            }
            description={
              item.type === 'assistant' && item.agentName === '系统' ? 
                <SystemMessageContent>{item.content}</SystemMessageContent> : 
                <Text>{item.content}</Text>
            }
          />
        </MessageItem>
      )}
    />
  );
};

export default MessageList; 