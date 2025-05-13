import React, { useState } from 'react';
import { List, Typography, Tag, Button, Avatar, Space, Tooltip } from 'antd';
import { RobotOutlined, UserAddOutlined, EyeOutlined, TeamOutlined, ManOutlined, WomanOutlined, QuestionOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { AIAgent } from '../../types';
import AIAgentDetailModal from './AIAgentDetailModal';

interface ThemeProps {
  theme: {
    mode: 'light' | 'dark';
  };
}

const { Text } = Typography;

const AgentItem = styled(List.Item)<ThemeProps & { $bgImg?: string }>`
  padding: 14px !important;
  margin: 12px 0;
  border-radius: 20px !important;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  position: relative;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  transition: all 0.3s ease;
  overflow: visible !important;
  transform: scale(1);
  transform-origin: center;
  z-index: 1;
  
  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
    box-shadow: 0 4px 12px ${({ theme }) => theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.12)'};
    transform: scale(1.02);
    z-index: 2;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    bottom: 0;
    background-image: ${props => props.$bgImg ? `url(${props.$bgImg})` : 'none'};
    background-size: cover;
    background-position: right center;
    opacity: 0.35;
    z-index: 0;
    transition: all 0.3s ease;
    mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0));
    -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0));
    border-radius: 0 20px 20px 0;
  }
  
  &:hover::before {
    opacity: ${props => props.$bgImg ? '0.9' : '0'};
    width: 55%;
    mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0));
    -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0));
  }
`;

const AgentContent = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  padding: 14px;
  z-index: 1;
`;

const LeftSection = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  align-items: center;
  min-width: 0;
  max-width: 65%;
`;

const AgentIcon = styled.div`
  font-size: 28px;
  color: var(--ant-color-primary);
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AgentAvatar = styled(Avatar)`
  width: 70px;
  height: 70px;
  border: 3px solid var(--ant-color-primary);
  background: var(--ant-color-bg-container);
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .anticon {
    font-size: 36px;
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
  font-size: 18px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 500;
  width: 100%;
  overflow: hidden;
`;

const NameText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
`;

const GenderTag = styled.div<{ gender: boolean | null | undefined }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  border-radius: 20px;
  width: 24px;
  height: 24px;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
  background-color: ${props => 
    props.gender === true ? '#4096ff' : 
    props.gender === false ? '#ff7875' : 
    '#bfbfbf'
  };
`;

const AgentDetails = styled.div`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 6px;
  line-height: 1.5;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 8px;
  min-width: 35%;
`;

const ButtonGroup = styled(Space)`
  margin-bottom: 20px;
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

const FemaleRecruitButton = styled(ActionButton)`
  background-color: #ff7875;
  border-color: #ff7875;
  
  &:hover,
  &:focus {
    background-color: #ff9c99;
    border-color: #ff9c99;
  }
  
  &:active {
    background-color: #f5222d;
    border-color: #f5222d;
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

const RecruitCountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ant-color-text-secondary);
  font-size: 12px;
  margin-top: 8px;
  
  .anticon {
    font-size: 14px;
  }
  
  &:hover {
    color: var(--ant-color-primary);
  }
`;

interface MarketAIAgentItemProps {
  agent: AIAgent;
  onRecruit: (agent: AIAgent) => void;
  loading?: boolean;
}

const MarketAIAgentItem: React.FC<MarketAIAgentItemProps> = ({ agent, onRecruit, loading = false }) => {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const intl = useIntl();
  
  // 判断是否为女性AI助手
  const isFemale = agent.gender === false;

  const getGenderIcon = (gender: boolean | null | undefined) => {
    if (gender === true) return <ManOutlined />;
    if (gender === false) return <WomanOutlined />;
    return <QuestionOutlined />;
  };

  const getGenderTooltip = (gender: boolean | null | undefined) => {
    if (gender === true) return intl.formatMessage({ id: 'aiAgentModal.form.gender.male', defaultMessage: '男' });
    if (gender === false) return intl.formatMessage({ id: 'aiAgentModal.form.gender.female', defaultMessage: '女' });
    return intl.formatMessage({ id: 'aiAgentModal.form.gender.unknown', defaultMessage: '未知' });
  };

  return (
    <>
      <AgentItem $bgImg={agent.bgImg}>
        <AgentContent>
          <LeftSection>
            <AgentIcon>
              <AgentAvatar 
                src={agent.avatarUrl}
                icon={!agent.avatarUrl && <RobotOutlined />}
              />
            </AgentIcon>
            <AgentInfo>
              <AgentName strong>
                <NameText>{agent.name}</NameText>
                {agent.gender !== null && (
                  <GenderTag 
                    gender={agent.gender}
                    title={getGenderTooltip(agent.gender)}
                  >
                    {getGenderIcon(agent.gender)}
                  </GenderTag>
                )}
              </AgentName>
              <AgentDetails>
                <div>温度: {agent.temperature}</div>
                <div>最大Token: {agent.maxTokens}</div>
                <div style={{ 
                  marginTop: 6,
                  fontSize: '12px',
                  color: 'var(--ant-color-text-secondary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: '1.6'
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
                <FormattedMessage id="aiAgent.market.button.details" />
              </ActionButton>
              {isFemale ? (
                <FemaleRecruitButton
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => onRecruit(agent)}
                  loading={loading}
                >
                  <FormattedMessage id="aiAgent.market.button.recruit" />
                </FemaleRecruitButton>
              ) : (
                <ActionButton
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => onRecruit(agent)}
                  loading={loading}
                >
                  <FormattedMessage id="aiAgent.market.button.recruit" />
                </ActionButton>
              )}
            </ButtonGroup>
            <TagsWrapper>
              {agent.roles.map((role, index) => (
                <RoleTag key={index}>{role}</RoleTag>
              ))}
              <ModelTag color="blue">{agent.modelType}</ModelTag>
              <Tooltip title={intl.formatMessage({ id: 'aiAgent.market.recruitCount.tooltip' })}>
                <RecruitCountBadge>
                  <TeamOutlined />
                  <FormattedMessage 
                    id="aiAgent.market.recruitCount" 
                    values={{ count: agent.copyTimes || 0 }}
                  />
                </RecruitCountBadge>
              </Tooltip>
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