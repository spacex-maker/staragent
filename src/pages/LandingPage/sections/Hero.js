import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { 
  HeroSection, 
  SectionContainer, 
  GradientBackground,
  PrimaryButton,
  SecondaryButton
} from '../styles';

// Styled Components
const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  padding: 4rem 0;

  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  background: linear-gradient(135deg, 
    var(--ant-color-primary) 0%,
    #4f46e5 50%,
    #ec4899 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradientFlow 8s ease infinite;

  @media (max-width: 768px) {
    font-size: 2.75rem;
  }

  @keyframes gradientFlow {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: var(--ant-color-text-secondary);
  margin-bottom: 2.5rem;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 3rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }
`;

const StatsGroup = styled(motion.div)`
  display: flex;
  gap: 3rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    gap: 2rem;
    flex-wrap: wrap;
  }
`;

const StatItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StatNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--ant-color-text);
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--ant-color-primary) 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.span`
  font-size: 1rem;
  color: var(--ant-color-text-secondary);
`;

const HeroImageContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    min-height: 400px;
  }
`;

const AIAgentGrid = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const AIAgentCard = styled(motion.div)`
  padding: 1.5rem;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(15, 23, 42, 0.75)' 
    : 'rgba(255, 255, 255, 0.85)'};
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
`;

const AIAgentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const AIAgentAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => props.bg || 'var(--ant-color-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  margin-right: 1rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%) }
    100% { transform: translateX(100%) }
  }
`;

const AIAgentInfo = styled.div`
  flex: 1;
`;

const AIAgentName = styled.h4`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ant-color-text);
`;

const AIAgentRole = styled.p`
  font-size: 0.875rem;
  color: var(--ant-color-text-secondary);
  margin: 0;
`;

const AIAgentBody = styled.div`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.5)' 
    : 'rgba(241, 245, 249, 0.7)'};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--ant-color-text);
  line-height: 1.5;
`;

const AIAgentSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const AIAgentSkill = styled.span`
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  background: ${props => props.bg || 'rgba(59, 130, 246, 0.1)'};
  color: ${props => props.color || 'var(--ant-color-primary)'};
  white-space: nowrap;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Hero = ({ onGetStarted, onExploreFeatures }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5
      }
    })
  };

  return (
    <HeroSection>
      <GradientBackground />
      <SectionContainer>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <HeroContent
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <HeroTitle variants={itemVariants}>
                <FormattedMessage
                  id="landing.hero.title"
                  defaultMessage="您的个人AI团队，重新定义协作未来"
                />
              </HeroTitle>
              <HeroSubtitle variants={itemVariants}>
                <FormattedMessage
                  id="landing.hero.subtitle"
                  defaultMessage="打造、训练与交易定制化AI角色，让各行各业的AI专家助力您的工作与创造"
                />
              </HeroSubtitle>
              <ButtonGroup variants={itemVariants}>
                <PrimaryButton 
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FormattedMessage
                    id="landing.hero.getStarted"
                    defaultMessage="免费开始使用"
                  />
                </PrimaryButton>
                <SecondaryButton 
                  onClick={onExploreFeatures}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FormattedMessage
                    id="landing.hero.exploreFeatures"
                    defaultMessage="探索功能"
                  />
                </SecondaryButton>
              </ButtonGroup>
              <StatsGroup variants={itemVariants}>
                <StatItem>
                  <StatNumber>100+</StatNumber>
                  <StatLabel>AI专家角色</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>50K+</StatNumber>
                  <StatLabel>活跃用户</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>99%</StatNumber>
                  <StatLabel>用户满意度</StatLabel>
                </StatItem>
              </StatsGroup>
            </HeroContent>
          </Col>
          
          <Col xs={24} lg={12}>
            <HeroImageContainer>
              <AIAgentGrid>
                {[
                  {
                    avatar: 'F',
                    name: '财务顾问',
                    role: '财务分析专家',
                    description: '我可以分析财务数据，提供投资建议，并帮助优化预算管理',
                    color: '#10b981',
                    skills: ['财务分析', '投资策略', '预算规划']
                  },
                  {
                    avatar: 'C',
                    name: '创意助手',
                    role: '创意与设计专家',
                    description: '我擅长创意写作、内容创作和设计概念，可以激发您的创意灵感',
                    color: '#f59e0b',
                    skills: ['内容创作', '创意写作', '设计思维']
                  },
                  {
                    avatar: 'T',
                    name: '技术专家',
                    role: '编程与开发专家',
                    description: '我可以提供编程帮助、技术问题解答和软件开发建议',
                    color: '#6366f1',
                    skills: ['编程开发', '技术支持', '系统设计']
                  },
                  {
                    avatar: 'R',
                    name: '研究助理',
                    role: '数据与分析专家',
                    description: '我擅长收集和分析数据，提供研究报告和市场趋势分析',
                    color: '#ec4899',
                    skills: ['数据分析', '市场调研', '趋势预测']
                  }
                ].map((agent, index) => (
                  <AIAgentCard
                    key={agent.name}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02 }}
                  >
                    <AIAgentHeader>
                      <AIAgentAvatar bg={agent.color}>{agent.avatar}</AIAgentAvatar>
                      <AIAgentInfo>
                        <AIAgentName>{agent.name}</AIAgentName>
                        <AIAgentRole>{agent.role}</AIAgentRole>
                      </AIAgentInfo>
                    </AIAgentHeader>
                    <AIAgentBody>{agent.description}</AIAgentBody>
                    <AIAgentSkills>
                      {agent.skills.map(skill => (
                        <AIAgentSkill
                          key={skill}
                          bg={`${agent.color}15`}
                          color={agent.color}
                        >
                          {skill}
                        </AIAgentSkill>
                      ))}
                    </AIAgentSkills>
                  </AIAgentCard>
                ))}
              </AIAgentGrid>
            </HeroImageContainer>
          </Col>
        </Row>
      </SectionContainer>
    </HeroSection>
  );
};

export default Hero; 