import React from 'react';
import { List, Typography, Tag, Button, message, Modal } from 'antd';
import { RobotOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AIAgent } from '../../types';
import axios from '../../../../api/axios';

const { Text } = Typography;

const AgentItem = styled(List.Item)`
  padding: 8px !important;
  margin: 8px 0;
  border-radius: 8px !important;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  position: relative;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
    box-shadow: 0 2px 8px ${({ theme }) => theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.32)' : 'rgba(0, 0, 0, 0.08)'};
  }
`;

const AgentContent = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  padding: 4px;
`;

const LeftSection = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
`;

const AgentIcon = styled.div`
  font-size: 24px;
  color: var(--ant-color-primary);
  flex-shrink: 0;
`;

const AgentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AgentName = styled(Text)`
  font-size: 16px;
  display: block;
  margin-bottom: 8px;
`;

const AgentDetails = styled.div`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 4px;
  line-height: 1.4;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: all 0.2s ease-in-out;
  
  ${AgentItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled(Button)`
  padding: 4px 8px;
  height: 28px;
  
  &:hover {
    background: var(--ant-color-primary-bg);
    color: var(--ant-color-primary);
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const RoleTag = styled(Tag)`
  margin: 0;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff'};
  color: #3b82f6;
  border-color: ${({ theme }) => theme.mode === 'dark' ? '#2563eb' : '#93c5fd'};
`;

const ModelTag = styled(Tag)`
  margin: 0;
`;

interface AIAgentItemProps {
  agent: AIAgent;
  onEdit: (agent: AIAgent) => void;
  onDelete?: (agentId: string) => void;
}

const AIAgentItem: React.FC<AIAgentItemProps> = ({ agent, onEdit, onDelete }) => {
  const handleDelete = async () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${agent.name} 吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.delete(`/productx/sa-ai-agent/${agent.id}`);
          if (response.data.success) {
            message.success('删除成功');
            onDelete?.(agent.id.toString());
          } else {
            message.error(response.data.message || '删除失败');
          }
        } catch (error) {
          console.error('删除AI员工失败:', error);
          message.error('删除失败，请稍后重试');
        }
      },
    });
  };

  return (
    <AgentItem>
      <AgentContent>
        <LeftSection>
          <AgentIcon>
            <RobotOutlined />
          </AgentIcon>
          <AgentInfo>
            <AgentName strong>{agent.name}</AgentName>
            <AgentDetails>
              <div>温度: {agent.temperature}</div>
              <div>最大Token: {agent.maxTokens}</div>
            </AgentDetails>
          </AgentInfo>
        </LeftSection>

        <RightSection>
          <ActionButtons>
            <ActionButton
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(agent);
              }}
            />
            <ActionButton
              type="text"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            />
          </ActionButtons>
          <TagsWrapper>
            <RoleTag>{agent.role}</RoleTag>
            <ModelTag color="blue">{agent.modelType}</ModelTag>
          </TagsWrapper>
        </RightSection>
      </AgentContent>
    </AgentItem>
  );
};

export default AIAgentItem;