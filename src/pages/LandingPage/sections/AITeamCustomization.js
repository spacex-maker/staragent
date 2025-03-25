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
  PrimaryButton,
  AIProfileGrid,
  AIProfileCard,
  AIProfileImage,
  AIProfileContent,
  AIProfileTitle,
  AIProfileDescription,
  AIProfileStats,
  GradientBackground
} from '../styles';

// Icons
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      fill="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Additional styled components
const CustomizationContainer = styled.div`
  margin-top: 4rem;
`;

const CustomizationSteps = styled.div`
  margin-bottom: 4rem;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(59, 130, 246, 0.1)'};
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--ant-color-text);
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: var(--ant-color-text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const AITeamCustomization = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Sample profile data - in a real app, these would come from the backend
  const aiProfiles = [
    {
      id: 1,
      name: "商业分析师",
      description: "专注于市场研究、竞争分析和商业策略，帮助您做出明智的商业决策。",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      users: 1248
    },
    {
      id: 2,
      name: "内容创作专家",
      description: "擅长内容创作、文案撰写和品牌推广，为您的品牌注入创意活力。",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      users: 978
    },
    {
      id: 3,
      name: "教育导师",
      description: "专为学习和教学场景设计，提供个性化辅导、课程规划和知识拓展。",
      image: "https://images.unsplash.com/photo-1605711285791-0219e80e43a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      users: 723
    }
  ];

  return (
    <Section>
      <GradientBackground />
      <SectionContainer>
        <Row justify="center" style={{ textAlign: 'center' }}>
          <Col xs={24} md={16}>
            <SectionTitle>
              <FormattedMessage id="landing.customization.title" defaultMessage="定制个性化 AI 角色" />
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto' }}>
              <FormattedMessage 
                id="landing.customization.subtitle" 
                defaultMessage="轻松创建适合各种场景的 AI 角色，从专业领域知识到个性特点，全方位定制您的专属 AI 团队成员" 
              />
            </SectionSubtitle>
          </Col>
        </Row>

        <CustomizationContainer>
          <CustomizationSteps>
            <Row gutter={[48, 48]} as={motion.div}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Col xs={24} md={8} as={motion.div} variants={itemVariants}>
                <StepNumber>1</StepNumber>
                <StepTitle>
                  <FormattedMessage id="landing.customization.step1.title" defaultMessage="选择基础模型" />
                </StepTitle>
                <StepDescription>
                  <FormattedMessage 
                    id="landing.customization.step1.description" 
                    defaultMessage="从 ChatGPT、Deepseek、Grok 等多种领先 AI 模型中选择最适合您需求的基础模型" 
                  />
                </StepDescription>
              </Col>
              
              <Col xs={24} md={8} as={motion.div} variants={itemVariants}>
                <StepNumber>2</StepNumber>
                <StepTitle>
                  <FormattedMessage id="landing.customization.step2.title" defaultMessage="定义专业领域" />
                </StepTitle>
                <StepDescription>
                  <FormattedMessage 
                    id="landing.customization.step2.description" 
                    defaultMessage="为 AI 角色设置专业知识领域、个性特点和交流风格，打造专业的AI团队成员" 
                  />
                </StepDescription>
              </Col>
              
              <Col xs={24} md={8} as={motion.div} variants={itemVariants}>
                <StepNumber>3</StepNumber>
                <StepTitle>
                  <FormattedMessage id="landing.customization.step3.title" defaultMessage="训练与优化" />
                </StepTitle>
                <StepDescription>
                  <FormattedMessage 
                    id="landing.customization.step3.description" 
                    defaultMessage="通过提供示例对话和反馈训练您的 AI 角色，不断优化其性能和回应质量" 
                  />
                </StepDescription>
              </Col>
            </Row>
          </CustomizationSteps>

          <AIProfileGrid as={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {aiProfiles.map((profile, index) => (
              <AIProfileCard key={index} as={motion.div} variants={itemVariants}>
                <AIProfileImage>
                  <img src={profile.image} alt={profile.name} />
                </AIProfileImage>
                <AIProfileContent>
                  <AIProfileTitle>{profile.name}</AIProfileTitle>
                  <AIProfileDescription>{profile.description}</AIProfileDescription>
                  <AIProfileStats>
                    <span>
                      <StarIcon /> {profile.rating}
                    </span>
                    <span>
                      <UsersIcon /> {profile.users} 用户
                    </span>
                  </AIProfileStats>
                </AIProfileContent>
              </AIProfileCard>
            ))}
          </AIProfileGrid>

          <Row justify="center" style={{ marginTop: '3rem' }}>
            <PrimaryButton 
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FormattedMessage id="landing.customization.createButton" defaultMessage="创建您的 AI 角色" />
            </PrimaryButton>
          </Row>
        </CustomizationContainer>
      </SectionContainer>
    </Section>
  );
};

export default AITeamCustomization; 