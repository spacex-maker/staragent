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

const BrandLogo = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'},
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.5s;
  }
  
  &:hover::before {
    transform: translateX(100%);
  }

  img {
    max-width: 70%;
    max-height: 70%;
    object-fit: contain;
    filter: ${props => props.theme.mode === 'dark' ? 'brightness(0.9)' : 'none'};
  }
`;

const PlatformIntegration = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const brandVariants = {
    hidden: { 
      y: 50,
      opacity: 0,
      rotateX: 45
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.8
      }
    },
    hover: {
      scale: 1.05,
      rotateY: [-1, 1],
      transition: {
        rotateY: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2
        }
      }
    }
  };

  // Platforms data - in a real app, these would be API-driven
  const platforms = [
    {
      id: 1,
      name: "ChatGPT",
      logo: "https://aimatex.com/ChatGPT-Logo.svg"
    },
    {
      id: 2,
      name: "DeepSeek",
      logo: "https://aimatex.com/DeepSeek_logo.svg"
    },
    {
      id: 3,
      name: "Grok",
      logo: "https://aimatex.com/grok.svg.png"
    },
    {
      id: 4,
      name: "Claude",
      logo: "https://aimatex.com/Claude_AI_logo.svg.png"
    },
    {
      id: 5,
      name: "Gemini",
      logo: "https://aimatex.com/Gemini_language_model_logo.png"
    }
  ];

  // Chat messages
  const messages = [
    {
      id: 1,
      agent: { 
        name: <FormattedMessage id="landing.integration.agent.user" />, 
        initial: "U", 
        model: null, 
        color: "#3b82f6" 
      },
      content: <FormattedMessage id="landing.integration.message.user" />,
      isUser: true
    },
    {
      id: 2,
      agent: { 
        name: <FormattedMessage id="landing.integration.agent.analyst" />, 
        initial: "D", 
        model: "DeepSeek", 
        color: "#0ea5e9" 
      },
      content: <FormattedMessage id="landing.integration.message.analyst" />,
      isUser: false
    },
    {
      id: 3,
      agent: { 
        name: <FormattedMessage id="landing.integration.agent.strategist" />, 
        initial: "S", 
        model: "ChatGPT", 
        color: "#10b981" 
      },
      content: <FormattedMessage id="landing.integration.message.strategist" />,
      isUser: false
    },
    {
      id: 4,
      agent: { 
        name: <FormattedMessage id="landing.integration.agent.creative" />, 
        initial: "C", 
        model: "Grok", 
        color: "#f59e0b" 
      },
      content: <FormattedMessage id="landing.integration.message.creative" />,
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
              <FormattedMessage id="landing.integration.title" />
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto' }}>
              <FormattedMessage id="landing.integration.subtitle" />
            </SectionSubtitle>
          </Col>
        </Row>
        
        <IntegrationContainer>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <IntegrationGrid>
              {platforms.map((platform, index) => (
                <BrandLogo
                  key={platform.id}
                  variants={brandVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  custom={index}
                >
                  <motion.img
                    src={platform.logo}
                    alt={platform.name}
                    draggable={false}
                  />
                </BrandLogo>
              ))}
            </IntegrationGrid>
          </motion.div>
          
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <IntegrationDescription>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                  <FormattedMessage id="landing.integration.aiTeams.title" />
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--ant-color-text-secondary)', marginBottom: '1.5rem' }}>
                  <FormattedMessage id="landing.integration.aiTeams.description1" />
                  <HighlightText>ChatGPT、DeepSeek、Grok</HighlightText>
                  <FormattedMessage id="landing.integration.aiTeams.description2" />
                </p>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--ant-color-text-secondary)' }}>
                  <FormattedMessage id="landing.integration.aiTeams.description3" />
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
                    <span><FormattedMessage id="landing.integration.chat.teamName" /></span>
                    <FormattedMessage id="landing.integration.chat.teamType" />
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
                  <ChatInput>
                    <FormattedMessage id="landing.integration.chat.input" />
                  </ChatInput>
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