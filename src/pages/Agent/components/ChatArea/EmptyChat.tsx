import React from 'react';
import { Typography, Button } from 'antd';
import styled from 'styled-components';
import { ProjectAgent } from '../../types';
import { FormattedMessage, useIntl } from 'react-intl';

const { Text } = Typography;

// 空消息列表容器样式
const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--ant-color-text-secondary);
  padding: 24px 16px;
  text-align: center;
  background: var(--ant-color-bg-container);
  border-radius: 20px;
  border: 1px dashed var(--ant-color-border);
`;

// 空消息列表标题样式
const EmptyTitle = styled(Text)`
  font-size: 16px;
  margin-bottom: 8px;
  color: var(--ant-color-text);
  font-weight: 500;
`;

// 空消息列表描述样式
const EmptyDescription = styled(Text)`
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 16px;
`;

// 空消息列表操作按钮样式
const EmptyAction = styled(Button)`
  margin-top: 8px;
`;

interface EmptyChatProps {
  projectAgents?: ProjectAgent[];           // 项目中的AI助手列表
  onNavigateToAgents?: () => void;          // 导航到AI助手页面的回调
}

const EmptyChat: React.FC<EmptyChatProps> = ({
  projectAgents = [],
  onNavigateToAgents
}) => {
  const intl = useIntl();
  
  return (
    <EmptyContainer>
      <EmptyTitle>
        {projectAgents && projectAgents.length > 0 ? (
          <FormattedMessage 
            id="emptyChat.withAgents.title" 
            defaultMessage="开始一个新的对话" 
          />
        ) : (
          <FormattedMessage 
            id="emptyChat.noAgents.title" 
            defaultMessage="项目尚未添加AI助手" 
          />
        )}
      </EmptyTitle>
      <EmptyDescription>
        {projectAgents && projectAgents.length > 0 ? (
          <FormattedMessage 
            id="emptyChat.withAgents.description" 
            defaultMessage="在下方输入框中输入您的问题，AI助手将为您提供专业解答！" 
          />
        ) : (
          <FormattedMessage 
            id="emptyChat.noAgents.description" 
            defaultMessage="请先添加AI助手到项目中，您可以选择创建新助手或从现有助手中选择" 
          />
        )}
      </EmptyDescription>
      {(!projectAgents || projectAgents.length === 0) && onNavigateToAgents && (
        <EmptyAction type="primary" onClick={onNavigateToAgents}>
          <FormattedMessage 
            id="emptyChat.noAgents.action" 
            defaultMessage="前往添加AI助手" 
          />
        </EmptyAction>
      )}
    </EmptyContainer>
  );
};

export default EmptyChat; 