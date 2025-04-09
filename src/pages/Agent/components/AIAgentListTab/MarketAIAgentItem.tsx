import React, { useState } from 'react';
import { List, Typography, Tag, Button, Avatar, Space } from 'antd';
import { RobotOutlined, UserAddOutlined, EyeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AIAgent } from '../../types';
import AIAgentDetailModal from './AIAgentDetailModal';

interface ThemeProps {
  theme: {
    mode: 'light' | 'dark';
  };
}

const { Text } = Typography;

const AgentItem = styled(List.Item)<ThemeProps>`
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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AgentAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  border: 2px solid var(--ant-color-primary);
  background: var(--ant-color-bg-container);
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .anticon {
    font-size: 20px;
  }

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
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

const ButtonGroup = styled(Space)`
  margin-bottom: 16px;
`;

const ActionButton = styled(Button)`
  border-radius: 20px;
  height: 32px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  .anticon {
    font-size: 16px;
  }
  
  &:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const RoleTag = styled(Tag)<ThemeProps>`
  margin: 0;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff'};
  color: #3b82f6;
  border-color: ${({ theme }) => theme.mode === 'dark' ? '#2563eb' : '#93c5fd'};
`;

const ModelTag = styled(Tag)`
  margin: 0;
`;

interface MarketAIAgentItemProps {
  agent: AIAgent;
  onRecruit: (agent: AIAgent) => void;
}

const MarketAIAgentItem: React.FC<MarketAIAgentItemProps> = ({ agent, onRecruit }) => {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  return (
    <>
      <AgentItem>
        <AgentContent>
          <LeftSection>
            <AgentIcon>
              <AgentAvatar 
                src={agent.avatarUrl}
                icon={!agent.avatarUrl && <RobotOutlined />}
              />
            </AgentIcon>
            <AgentInfo>
              <AgentName strong>{agent.name}</AgentName>
              <AgentDetails>
                <div>温度: {agent.temperature}</div>
                <div>最大Token: {agent.maxTokens}</div>
                <div style={{ 
                  marginTop: 4,
                  fontSize: '12px',
                  color: 'var(--ant-color-text-secondary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {agent.prompt}
                </div>
              </AgentDetails>
            </AgentInfo>
          </LeftSection>

          <RightSection>
            <ButtonGroup>
              <ActionButton
                type="default"
                icon={<EyeOutlined />}
                onClick={() => setIsDetailModalVisible(true)}
              >
                详情
              </ActionButton>
              <ActionButton
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => onRecruit(agent)}
              >
                招募
              </ActionButton>
            </ButtonGroup>
            <TagsWrapper>
              {agent.roles.map((role, index) => (
                <RoleTag key={index}>{role}</RoleTag>
              ))}
              <ModelTag color="blue">{agent.modelType}</ModelTag>
            </TagsWrapper>
          </RightSection>
        </AgentContent>
      </AgentItem>

      <AIAgentDetailModal
        visible={isDetailModalVisible}
        agent={agent}
        onCancel={() => setIsDetailModalVisible(false)}
      />
    </>
  );
};

export default MarketAIAgentItem; 