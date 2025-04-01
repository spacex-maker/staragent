import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { 
  Section, 
  SectionContainer, 
  SectionTitle, 
  SectionSubtitle,
  IntegrationCard,
  GradientBackground
} from '../styles';

// Additional styled components
const IntegrationContainer = styled.div`
  margin-top: 4rem;
`;

const IntegrationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const IntegrationDescription = styled.div`
  margin-top: 3rem;
`;

const HighlightText = styled.span`
  color: var(--ant-color-primary);
  font-weight: 600;
`;

const ChatInterface = styled(motion.div)`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
    : '0 20px 40px rgba(0, 0, 0, 0.1)'};
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  overflow: hidden;
  width: 100%;
  height: 500px;
  position: relative;
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(15, 23, 42, 0.8)' 
    : 'rgba(241, 245, 249, 0.8)'};
  border-bottom: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TeamName = styled.div`
  font-weight: 600;
  color: var(--ant-color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    font-size: 0.875rem;
    color: var(--ant-color-text-secondary);
  }
`;

const ChatBody = styled.div`
  padding: 1.5rem;
  height: calc(100% - 130px);
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AgentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${props => props.bg || 'var(--ant-color-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-right: 0.75rem;
`;

const AgentName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--ant-color-text);
  
  span {
    font-weight: normal;
    color: var(--ant-color-text-secondary);
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
`;

const MessageContent = styled.div`
  background: ${props => props.isUser 
    ? (props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)') 
    : (props.theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.7)')};
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  color: var(--ant-color-text);
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.isUser ? 'auto' : '0'};
`;

const ChatFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(15, 23, 42, 0.8)' 
    : 'rgba(241, 245, 249, 0.8)'};
`;

const ChatInput = styled.div`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.5)' 
    : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 20px;
  padding: 0.75rem 1rem;
  color: var(--ant-color-text-secondary);
  font-size: 0.875rem;
  cursor: text;
`;

const PlatformIntegration = () => {
  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Platforms data - in a real app, these would be API-driven
  const platforms = [
    {
      id: 1,
      name: "ChatGPT",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
    },
    {
      id: 2,
      name: "DeepSeek",
      logo: "https://cdn.deepseek.com/platform/favicon.png"
    },
    {
      id: 3,
      name: "Grok",
      logo: "https://via.placeholder.com/150?text=Grok"
    },
    {
      id: 4,
      name: "Claude",
      logo: "https://via.placeholder.com/150?text=Claude"
    },
    {
      id: 5,
      name: "Gemini",
      logo: "https://via.placeholder.com/150?text=Gemini"
    }
  ];

  // Chat messages
  const messages = [
    {
      id: 1,
      agent: { name: "用户", initial: "U", model: null, color: "#3b82f6" },
      content: "我需要分析这篇市场研究报告并提出策略建议，同时创建一个漂亮的演示文稿。",
      isUser: true
    },
    {
      id: 2,
      agent: { name: "数据分析师", initial: "D", model: "DeepSeek", color: "#0ea5e9" },
      content: "我会深入分析报告中的数据趋势和市场洞察，为您提供详细的数据分析和预测模型。",
      isUser: false
    },
    {
      id: 3,
      agent: { name: "战略顾问", initial: "S", model: "ChatGPT", color: "#10b981" },
      content: "根据数据分析，我会制定战略建议，包括市场定位、竞争分析和增长策略。",
      isUser: false
    },
    {
      id: 4,
      agent: { name: "创意总监", initial: "C", model: "Grok", color: "#f59e0b" },
      content: "我将设计引人注目的演示文稿，利用视觉元素和创意布局突出您的关键观点和策略建议。",
      isUser: false
    }
  ];

  return (
    <Section>
      <GradientBackground />
      <SectionContainer>
        <Row justify="center" style={{ textAlign: 'center' }}>
          <Col xs={24} md={16}>
            <SectionTitle>
              <FormattedMessage id="landing.integration.title" defaultMessage="多平台智能集成" />
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto' }}>
              <FormattedMessage 
                id="landing.integration.subtitle" 
                defaultMessage="无缝整合多种领先 AI 平台，在统一界面中同时利用各平台的独特优势，实现智能协作" 
              />
            </SectionSubtitle>
          </Col>
        </Row>
        
        <IntegrationContainer>
          <IntegrationGrid as={motion.div}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {platforms.map((platform, index) => (
              <IntegrationCard 
                key={index} 
                as={motion.div}
                variants={itemVariants}
              >
                <img src={platform.logo} alt={platform.name} />
              </IntegrationCard>
            ))}
          </IntegrationGrid>
          
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <IntegrationDescription>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                  <FormattedMessage 
                    id="landing.integration.aiTeams.title" 
                    defaultMessage="创建多模型 AI 团队，共享上下文" 
                  />
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--ant-color-text-secondary)', marginBottom: '1.5rem' }}>
                  <FormattedMessage 
                    id="landing.integration.aiTeams.description1" 
                    defaultMessage="AI MateX 突破单一模型的限制，让您同时使用" 
                  /> <HighlightText>ChatGPT、DeepSeek、Grok</HighlightText>
                  <FormattedMessage 
                    id="landing.integration.aiTeams.description2" 
                    defaultMessage="等多种 AI 模型，创建具有不同专长的 AI 团队，共同解决复杂问题。" 
                  />
                </p>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--ant-color-text-secondary)' }}>
                  <FormattedMessage 
                    id="landing.integration.aiTeams.description3" 
                    defaultMessage="每个 AI 角色都可以访问共享的对话上下文，实现真正的多模型协作，充分发挥各 AI 平台的独特优势。" 
                  />
                </p>
              </IntegrationDescription>
            </Col>
            
            <Col xs={24} lg={12}>
              <ChatInterface
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ChatHeader>
                  <TeamName>
                    <span>AI团队:</span> 业务战略团队 
                  </TeamName>
                </ChatHeader>
                
                <ChatBody>
                  {messages.map((message) => (
                    <Message key={message.id}>
                      {!message.isUser && (
                        <MessageHeader>
                          <AgentAvatar bg={message.agent.color}>{message.agent.initial}</AgentAvatar>
                          <AgentName>
                            {message.agent.name}
                            {message.agent.model && <span>({message.agent.model})</span>}
                          </AgentName>
                        </MessageHeader>
                      )}
                      <MessageContent isUser={message.isUser} theme={{}}>
                        {message.content}
                      </MessageContent>
                    </Message>
                  ))}
                </ChatBody>
                
                <ChatFooter>
                  <ChatInput>输入您的消息...</ChatInput>
                </ChatFooter>
              </ChatInterface>
            </Col>
          </Row>
        </IntegrationContainer>
      </SectionContainer>
    </Section>
  );
};

export default PlatformIntegration; 