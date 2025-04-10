import React from 'react';
import { Modal, Typography, Descriptions, Tag, Avatar } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AIAgent } from '../../types';

const { Title, Paragraph } = Typography;

const ModalContent = styled.div`
  margin: -24px -24px -24px -24px;
  overflow: hidden;
  position: relative;
`;

const HeaderBackground = styled.div<{ bgImg?: string }>`
  height: 320px;
  background-image: ${props => props.bgImg ? `url(${props.bgImg})` : 'linear-gradient(135deg, var(--ant-color-primary), #2563eb)'};
  background-size: cover;
  background-position: center;
  position: relative;
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
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: -50px;
  margin-bottom: 20px;
`;

const StyledAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
  border: 4px solid var(--ant-color-bg-container);
  background: var(--ant-color-bg-container);
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  .anticon {
    font-size: 50px;
  }
`;

const ContentSection = styled.div`
  padding: 0 24px 24px;
  background: var(--ant-color-bg-container);
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
  margin-top: 12px;
`;

const StyledTag = styled(Tag)`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  margin: 0;
`;

const ModelTag = styled(Tag)`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  background: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
  border-color: var(--ant-color-primary-border);
`;

const PromptSection = styled.div`
  margin: 24px 0;
  padding: 20px;
  background: var(--ant-color-bg-container-disabled);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    font-weight: 500;
    color: var(--ant-color-text-secondary);
  }
  
  .ant-descriptions-row {
    margin-bottom: 8px;
  }
`;

const StatusTag = styled(Tag)<{ $isActive: boolean }>`
  border-radius: 20px;
  padding: 2px 12px;
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
        
        <ContentSection>
          <AvatarContainer>
            <StyledAvatar
              src={agent.avatarUrl}
              icon={!agent.avatarUrl && <RobotOutlined />}
            />
          </AvatarContainer>
          
          <HeaderSection>
            <AgentName level={3}>{agent.name}</AgentName>
            <ModelTag>{agent.modelType}</ModelTag>
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
              <StatusTag $isActive={agent.status === 'active'}>
                {agent.status === 'active' ? '启用' : '禁用'}
              </StatusTag>
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
        </ContentSection>
      </ModalContent>
    </Modal>
  );
};

export default AIAgentDetailModal; 