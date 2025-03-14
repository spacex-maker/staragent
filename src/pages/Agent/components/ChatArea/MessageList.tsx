import React from 'react';
import { List, Avatar, Typography } from 'antd';
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

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
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
              <Text strong>{item.type === 'user' ? '用户' : 'AI助手'}</Text>
            }
            description={
              <Text>{item.content}</Text>
            }
          />
        </MessageItem>
      )}
    />
  );
};

export default MessageList; 