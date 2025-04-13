import React from 'react';
import { Modal, Typography, Tag, Avatar, Row, Col, Space, Divider } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AIAgent } from '../../types';
import CommentSection from './CommentSection';

const { Title, Paragraph } = Typography;

const ModalContent = styled.div`
  margin: -24px -24px -24px -24px;
  overflow: hidden;
  position: relative;
`;

const HeaderContainer = styled.div`
  position: relative;
  height: 300px;
`;

const HeaderBackground = styled.div<{ bgImg?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-image: ${props => props.bgImg ? `url(${props.bgImg})` : 'linear-gradient(135deg, var(--ant-color-primary), #2563eb)'};
  background-size: cover;
  background-position: center;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, 
      rgba(0, 0, 0, 0.2) 0%, 
      rgba(0, 0, 0, 0.3) 70%,
      rgba(0, 0, 0, 0.5) 100%);
    z-index: 1;
  }
  
  /* 主背景图层 - 呼吸效果 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => props.bgImg ? `url(${props.bgImg})` : 'linear-gradient(135deg, var(--ant-color-primary), #2563eb)'};
    background-size: cover;
    background-position: center;
    z-index: -1;
    animation: breathe 15s ease-in-out infinite alternate;
    
    @keyframes breathe {
      0% {
        opacity: 0.8;
        transform: scale(1);
      }
      100% {
        opacity: 1;
        transform: scale(1.08);
      }
    }
  }
  
  /* 浮动光效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, 
      rgba(0, 0, 0, 0.2) 0%, 
      rgba(0, 0, 0, 0.3) 70%,
      rgba(0, 0, 0, 0.5) 100%);
    z-index: 1;
  }
  
  /* 光效元素1 */
  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 50px;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      rgba(255, 255, 255, 0) 100%);
    top: 20%;
    left: -25%;
    transform: rotate(-20deg);
    animation: shimmer1 8s linear infinite;
    z-index: 2;
    
    @keyframes shimmer1 {
      0% {
        top: -10%;
        left: -50%;
        opacity: 0;
      }
      10% {
        opacity: 0.15;
      }
      60% {
        opacity: 0.15;
      }
      100% {
        top: 110%;
        left: 100%;
        opacity: 0;
      }
    }
  }
  
  /* 光效元素2 */
  &::after {
    content: '';
    position: absolute;
    width: 150%;
    height: 40px;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.05) 50%, 
      rgba(255, 255, 255, 0) 100%);
    top: 60%;
    right: -25%;
    transform: rotate(15deg);
    animation: shimmer2 12s linear infinite;
    animation-delay: 4s;
    z-index: 2;
    
    @keyframes shimmer2 {
      0% {
        top: 110%;
        right: -50%;
        opacity: 0;
      }
      10% {
        opacity: 0.1;
      }
      60% {
        opacity: 0.1;
      }
      100% {
        top: 0%;
        right: 100%;
        opacity: 0;
      }
    }
  }
`;

// 添加光效组件
const LightEffects = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
`;

const LightBeam1 = styled.div`
  position: absolute;
  width: 150%;
  height: 50px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0) 0%, 
    rgba(255, 255, 255, 0.12) 50%, 
    rgba(255, 255, 255, 0) 100%);
  top: 20%;
  left: -25%;
  transform: rotate(-20deg);
  animation: beam1 10s linear infinite;
  
  @keyframes beam1 {
    0% {
      top: -10%;
      left: -50%;
      opacity: 0;
    }
    10% {
      opacity: 0.15;
    }
    60% {
      opacity: 0.15;
    }
    100% {
      top: 110%;
      left: 100%;
      opacity: 0;
    }
  }
`;

const LightBeam2 = styled.div`
  position: absolute;
  width: 150%;
  height: 40px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0) 0%, 
    rgba(255, 255, 255, 0.08) 50%, 
    rgba(255, 255, 255, 0) 100%);
  top: 60%;
  right: -25%;
  transform: rotate(15deg);
  animation: beam2 15s linear infinite;
  animation-delay: 5s;
  
  @keyframes beam2 {
    0% {
      top: 110%;
      right: -50%;
      opacity: 0;
    }
    10% {
      opacity: 0.1;
    }
    60% {
      opacity: 0.1;
    }
    100% {
      top: 0%;
      right: 100%;
      opacity: 0;
    }
  }
`;

const LightBeam3 = styled.div`
  position: absolute;
  width: 120%;
  height: 30px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0) 0%, 
    rgba(255, 255, 255, 0.06) 50%, 
    rgba(255, 255, 255, 0) 100%);
  top: 40%;
  left: -20%;
  transform: rotate(15deg);
  animation: beam3 12s linear infinite;
  animation-delay: 2s;
  
  @keyframes beam3 {
    0% {
      top: -5%;
      left: -20%;
      opacity: 0;
    }
    20% {
      opacity: 0.08;
    }
    70% {
      opacity: 0.08;
    }
    100% {
      top: 80%;
      left: 120%;
      opacity: 0;
    }
  }
`;

const FloatingParticle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.2);
  animation: float 15s ease-in-out infinite;
  animation-delay: ${() => Math.random() * 15}s;
  left: ${() => Math.random() * 100}%;
  top: ${() => Math.random() * 100}%;
  opacity: ${() => Math.random() * 0.3 + 0.1};
  
  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
    }
    25% {
      transform: translateY(-20px) translateX(10px);
    }
    50% {
      transform: translateY(10px) translateX(20px);
    }
    75% {
      transform: translateY(20px) translateX(-10px);
    }
    100% {
      transform: translateY(0) translateX(0);
    }
  }
`;

const Particles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const AvatarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 40px;
  z-index: 10;
  transform: translateY(50%);
`;

const StyledAvatar = styled(Avatar)`
  width: 90px;
  height: 90px;
  border: 5px solid var(--ant-color-bg-container);
  background: var(--ant-color-bg-container);
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  
  .anticon {
    font-size: 45px;
  }
`;

const ContentSection = styled.div`
  padding: 0 24px 24px;
  background: var(--ant-color-bg-container);
  overflow-y: auto;
  position: relative;
  z-index: 1;
  padding-top: 35px;
  border-radius: 0 0 20px 20px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--ant-color-border);
    border-radius: 2px;
  }
`;

const InfoHeader = styled.div`
  display: flex;
  margin-left: 120px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const NameSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 14px;
`;

const AgentName = styled(Title)`
  margin: 0 0 2px 0 !important;
  text-align: left;
  font-size: 20px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const ModelTag = styled(Tag)`
  padding: 2px 8px;
  border-radius: 16px;
  font-size: 13px;
  background: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
  border-color: var(--ant-color-primary-border);
`;

const StyledTag = styled(Tag)`
  padding: 2px 8px;
  border-radius: 16px;
  font-size: 13px;
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 24px;
  margin: 16px 0;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
`;

const InfoLabel = styled.span`
  color: var(--ant-color-text-secondary);
  margin-right: 8px;
  font-weight: 500;
  min-width: 70px;
`;

const InfoValue = styled.span`
  color: var(--ant-color-text);
`;

const PromptSection = styled.div`
  margin: 12px 0;
  padding: 16px;
  background: var(--ant-color-bg-container-disabled);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
`;

const PromptContent = styled.div`
  max-height: 200px;
  overflow-y: auto;
  position: relative;
  padding-right: 6px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--ant-color-border);
    border-radius: 2px;
  }
`;

const StatusTag = styled(Tag)<{ $isActive: boolean }>`
  border-radius: 16px;
  padding: 1px 8px;
  font-weight: 500;
  background: ${props => props.$isActive ? 'rgba(82, 196, 26, 0.1)' : 'rgba(0, 0, 0, 0.04)'};
  color: ${props => props.$isActive ? '#52c41a' : 'rgba(0, 0, 0, 0.45)'};
  border-color: ${props => props.$isActive ? '#52c41a' : 'rgba(0, 0, 0, 0.15)'};
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
      bodyStyle={{ padding: 0 }}
    >
      <ModalContent>
        <HeaderContainer>
          <HeaderBackground bgImg={agent.bgImg}>
            <LightEffects>
              <LightBeam1 />
              <LightBeam2 />
              <LightBeam3 />
              <Particles>
                {[...Array(8)].map((_, i) => (
                  <FloatingParticle key={i} />
                ))}
              </Particles>
            </LightEffects>
          </HeaderBackground>
          
          <AvatarContainer>
            <StyledAvatar
              src={agent.avatarUrl}
              icon={!agent.avatarUrl && <RobotOutlined />}
            />
          </AvatarContainer>
        </HeaderContainer>
        
        <ContentSection>
          <InfoHeader>
            <NameSection>
              <AgentName level={4}>{agent.name}</AgentName>
              <TagsContainer>
                <ModelTag>{agent.modelType}</ModelTag>
                {agent.roles.map((role, index) => (
                  <StyledTag key={index} color="processing">{role}</StyledTag>
                ))}
              </TagsContainer>
            </NameSection>
          </InfoHeader>
          
          <Divider style={{ margin: '-2px 0 12px 0' }} />
          
          <InfoGrid>
            <InfoItem>
              <InfoLabel>温度:</InfoLabel>
              <InfoValue>{agent.temperature}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>状态:</InfoLabel>
              <InfoValue>
                <StatusTag $isActive={agent.status === 'active'}>
                  {agent.status === 'active' ? '启用' : '禁用'}
                </StatusTag>
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>最大Token:</InfoLabel>
              <InfoValue>{agent.maxTokens}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>创建时间:</InfoLabel>
              <InfoValue>{agent.createTime}</InfoValue>
            </InfoItem>
          </InfoGrid>

          <PromptSection>
            <Title level={5} style={{ marginBottom: 8, fontSize: 14 }}>预设提示词</Title>
            <PromptContent>
              <Paragraph style={{ 
                whiteSpace: 'pre-wrap',
                margin: 0,
                color: 'var(--ant-color-text-secondary)',
                fontSize: 13
              }}>
                {agent.prompt}
              </Paragraph>
            </PromptContent>
          </PromptSection>

          <CommentSection agentId={agent.id} />
        </ContentSection>
      </ModalContent>
    </Modal>
  );
};

export default AIAgentDetailModal; 