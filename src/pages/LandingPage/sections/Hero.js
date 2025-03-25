import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';
import { 
  HeroSection, 
  SectionContainer, 
  GradientBackground,
  PrimaryButton,
  SecondaryButton,
  FloatingElement
} from '../styles';
import styled from 'styled-components';

// Additional styled components specific to Hero
const HeroContent = styled.div`
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--ant-color-primary) 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: var(--ant-color-text-secondary);
  margin-bottom: 2.5rem;
  max-width: 600px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }
`;

const HeroImage = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    min-height: 400px;
  }
`;

const AITeamGraphic = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
`;

const AIAgentCard = styled(motion.div)`
  position: absolute;
  padding: 1.25rem;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(15, 23, 42, 0.75)' 
    : 'rgba(255, 255, 255, 0.85)'};
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  width: ${props => props.width || '200px'};
  z-index: ${props => props.zIndex || 1};
  transform: ${props => props.transform || 'none'};

  @media (max-width: 768px) {
    width: ${props => props.mobileWidth || props.width || '150px'};
    transform: scale(0.85) ${props => props.transform || 'none'};
  }
`;

const AIAgentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const AIAgentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.bg || 'var(--ant-color-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  margin-right: 0.75rem;
`;

const AIAgentName = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--ant-color-text);
`;

const AIAgentRole = styled.p`
  font-size: 0.75rem;
  color: var(--ant-color-text-secondary);
  margin: 0;
`;

const AIAgentBody = styled.div`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.5)' 
    : 'rgba(241, 245, 249, 0.7)'};
  border-radius: 10px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--ant-color-text);
`;

const AIAgentSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const AIAgentSkill = styled.span`
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  background: ${props => props.bg || 'rgba(59, 130, 246, 0.1)'};
  color: ${props => props.color || 'var(--ant-color-primary)'};
  white-space: nowrap;
`;

const CentralElement = styled(motion.div)`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle at center, var(--ant-color-primary), #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px var(--ant-color-primary-2);
  z-index: 0;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const CentralText = styled.div`
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  text-align: center;
`;

const ConnectionLine = styled(motion.div)`
  position: absolute;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  z-index: 0;
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

  return (
    <HeroSection>
      <GradientBackground />
      <SectionContainer>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={12}>
            <HeroContent as={motion.div} 
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
                <PrimaryButton onClick={onGetStarted}>
                  <FormattedMessage
                    id="landing.hero.getStarted"
                    defaultMessage="免费开始使用"
                  />
                </PrimaryButton>
                <SecondaryButton onClick={onExploreFeatures}>
                  <FormattedMessage
                    id="landing.hero.exploreFeatures"
                    defaultMessage="探索功能"
                  />
                </SecondaryButton>
              </ButtonGroup>
            </HeroContent>
          </Col>
          
          <Col xs={24} md={12}>
            <HeroImage
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <AITeamGraphic>
                {/* Central Hub Element */}
                <CentralElement
                  animate={{ 
                    boxShadow: ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 40px rgba(59, 130, 246, 0.8)', '0 0 20px rgba(59, 130, 246, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CentralText>AI MateX</CentralText>
                </CentralElement>
                
                {/* Finance AI Agent */}
                <AIAgentCard
                  as={FloatingElement}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  width="220px"
                  mobileWidth="180px"
                  transform="translateX(-180px) translateY(-150px)"
                  zIndex={2}
                >
                  <AIAgentHeader>
                    <AIAgentAvatar bg="#10b981">F</AIAgentAvatar>
                    <div>
                      <AIAgentName>财务顾问</AIAgentName>
                      <AIAgentRole>财务分析专家</AIAgentRole>
                    </div>
                  </AIAgentHeader>
                  <AIAgentBody>
                    我可以分析财务数据，提供投资建议，并帮助优化预算管理
                  </AIAgentBody>
                  <AIAgentSkills>
                    <AIAgentSkill bg="rgba(16, 185, 129, 0.1)" color="#10b981">
                      财务分析
                    </AIAgentSkill>
                    <AIAgentSkill bg="rgba(16, 185, 129, 0.1)" color="#10b981">
                      投资策略
                    </AIAgentSkill>
                    <AIAgentSkill bg="rgba(16, 185, 129, 0.1)" color="#10b981">
                      预算规划
                    </AIAgentSkill>
                  </AIAgentSkills>
                </AIAgentCard>
                
                {/* Creative AI Agent */}
                <AIAgentCard
                  as={FloatingElement}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  width="220px"
                  mobileWidth="180px"
                  transform="translateX(180px) translateY(-100px)"
                  zIndex={2}
                >
                  <AIAgentHeader>
                    <AIAgentAvatar bg="#f59e0b">C</AIAgentAvatar>
                    <div>
                      <AIAgentName>创意助手</AIAgentName>
                      <AIAgentRole>创意与设计专家</AIAgentRole>
                    </div>
                  </AIAgentHeader>
                  <AIAgentBody>
                    我擅长创意写作、内容创作和设计概念，可以激发您的创意灵感
                  </AIAgentBody>
                  <AIAgentSkills>
                    <AIAgentSkill bg="rgba(245, 158, 11, 0.1)" color="#f59e0b">
                      内容创作
                    </AIAgentSkill>
                    <AIAgentSkill bg="rgba(245, 158, 11, 0.1)" color="#f59e0b">
                      创意写作
                    </AIAgentSkill>
                    <AIAgentSkill bg="rgba(245, 158, 11, 0.1)" color="#f59e0b">
                      设计思维
                    </AIAgentSkill>
                  </AIAgentSkills>
                </AIAgentCard>
                
                {/* Tech AI Agent */}
                <AIAgentCard
                  as={FloatingElement}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  width="220px"
                  mobileWidth="180px"
                  transform="translateX(-150px) translateY(100px)"
                  zIndex={2}
                >
                  <AIAgentHeader>
                    <AIAgentAvatar bg="#6366f1">T</AIAgentAvatar>
                    <div>
                      <AIAgentName>技术专家</AIAgentName>
                      <AIAgentRole>编程与开发专家</AIAgentRole>
                    </div>
                  </AIAgentHeader>
                  <AIAgentBody>
                    我可以提供编程帮助、技术问题解答和软件开发建议
                  </AIAgentBody>
                  <AIAgentSkills>
                    <AIAgentSkill bg="rgba(99, 102, 241, 0.1)" color="#6366f1">
                      编程开发
                    </AIAgentSkill>
                    <AIAgentSkill bg="rgba(99, 102, 241, 0.1)" color="#6366f1">
                      技术支持
                    </AIAgentSkill>
                    <AIAgentSkill bg="rgba(99, 102, 241, 0.1)" color="#6366f1">
                      系统设计
                    </AIAgentSkill>
                  </AIAgentSkills>
                </AIAgentCard>
                
                {/* Research AI Agent */}
                <AIAgentCard
                  as={FloatingElement}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  width="220px"
                  mobileWidth="180px"
                  transform="translateX(150px) translateY(150px)"
                  zIndex={2}
                >
                  <AIAgentHeader>
                    <AIAgentAvatar bg="#ec4899">R</AIAgentAvatar>
                    <div>
                      <AIAgentName>研究助理</AIAgentName>
                      <AIAgentRole>数据与分析专家</AIAgentRole>
                    </div>
                  </AIAgentHeader>
                  <AIAgentBody>
                    我擅长收集和分析数据，提供研究报告和市场趋势分析
                  </AIAgentBody>
                  <AIAgentSkills>
                    <AIAgentSkill bg="rgba(236, 72, 153, 0.1)" color="#ec4899">
                      数据分析
                    </AIAgentSkill>
                    <AIAgentSkill bg="rgba(236, 72, 153, 0.1)" color="#ec4899">
                      市场调研
                    </AIAgentSkill>
                    <AIAgentSkill bg="rgba(236, 72, 153, 0.1)" color="#ec4899">
                      趋势预测
                    </AIAgentSkill>
                  </AIAgentSkills>
                </AIAgentCard>
              </AITeamGraphic>
            </HeroImage>
          </Col>
        </Row>
      </SectionContainer>
    </HeroSection>
  );
};

export default Hero; 