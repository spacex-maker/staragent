import React from 'react';
import { Modal, Typography, Descriptions, Tag, Avatar } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AIAgent } from '../../types';

const { Title, Paragraph } = Typography;

const StyledAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
  border: 2px solid var(--ant-color-primary);
  background: var(--ant-color-bg-container);
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  .anticon {
    font-size: 40px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  text-align: center;
`;

const AgentName = styled(Title)`
  margin: 0 0 8px 0 !important;
`;

const RoleTagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
`;

const StyledTag = styled(Tag)`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
`;

const PromptSection = styled.div`
  margin: 24px 0;
  padding: 16px;
  background: var(--ant-color-bg-container-disabled);
  border-radius: 8px;
`;

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    font-weight: 500;
    color: var(--ant-color-text-secondary);
  }
`;

interface AIAgentDetailModalProps {
  visible: boolean;
  agent: AIAgent;
  onCancel: () => void;
}

const AIAgentDetailModal: React.FC<AIAgentDetailModalProps> = ({
  visible,
  agent,
  onCancel
}) => {
  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <HeaderSection>
        <StyledAvatar
          src={agent.avatarUrl}
          icon={!agent.avatarUrl && <RobotOutlined />}
        />
        <AgentName level={3}>{agent.name}</AgentName>
        <Tag color="blue">{agent.modelType}</Tag>
        <RoleTagsContainer>
          {agent.roles.map((role, index) => (
            <StyledTag key={index} color="processing">{role}</StyledTag>
          ))}
        </RoleTagsContainer>
      </HeaderSection>

      <StyledDescriptions column={2}>
        <Descriptions.Item label="温度" span={1}>
          {agent.temperature}
        </Descriptions.Item>
        <Descriptions.Item label="最大Token数" span={1}>
          {agent.maxTokens}
        </Descriptions.Item>
        <Descriptions.Item label="状态" span={1}>
          <Tag color={agent.status === 'active' ? 'success' : 'default'}>
            {agent.status === 'active' ? '启用' : '禁用'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间" span={1}>
          {agent.createTime}
        </Descriptions.Item>
      </StyledDescriptions>

      <PromptSection>
        <Title level={5} style={{ marginBottom: 16 }}>预设提示词</Title>
        <Paragraph style={{ 
          whiteSpace: 'pre-wrap',
          margin: 0,
          color: 'var(--ant-color-text-secondary)'
        }}>
          {agent.prompt}
        </Paragraph>
      </PromptSection>
    </Modal>
  );
};

export default AIAgentDetailModal; 