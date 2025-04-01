import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandMagicSparkles,
  faStore,
  faPlugCircleBolt,
  faUsersBetweenLines,
  faShieldHalved,
  faBrain,
  faDatabase,
  faIndustry,
  faCode
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { 
  Section, 
  SectionContainer, 
  SectionTitle, 
  SectionSubtitle,
  GradientBackground
} from '../styles';

// Styled Components
const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(15, 23, 42, 0.6)' 
    : 'rgba(255, 255, 255, 0.8)'};
  padding: 2.5rem 2rem;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--ant-color-primary),
      ${props => props.accentColor || '#4f46e5'}
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }

    .feature-icon {
      transform: scale(1.1);
      color: ${props => props.accentColor || 'var(--ant-color-primary)'};
    }
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.05)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: ${props => props.accentColor || 'var(--ant-color-primary)'};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(0, 0, 0, 0.08)'};
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0;
  color: var(--ant-color-text);
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ant-color-text-secondary);
  margin: 0;
`;

const Features = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Feature data with FontAwesome icons and accent colors
  const features = [
    {
      icon: faWandMagicSparkles,
      accentColor: '#10b981',
      title: <FormattedMessage id="landing.features.customization.title" defaultMessage="个性化 AI 角色定制" />,
      description: <FormattedMessage 
        id="landing.features.customization.description" 
        defaultMessage="支持 MBTI 性格类型定制，可设定年龄、性别等拟人化特征，打造独特个性的 AI 助手，让交互更自然真实" 
      />
    },
    {
      icon: faStore,
      accentColor: '#f59e0b',
      title: <FormattedMessage id="landing.features.marketplace.title" defaultMessage="AI 角色交易市场" />,
      description: <FormattedMessage 
        id="landing.features.marketplace.description" 
        defaultMessage="在全球 AI 角色市场中分享、购买或出售您训练的 AI 角色，让专业知识跨越边界" 
      />
    },
    {
      icon: faPlugCircleBolt,
      accentColor: '#6366f1',
      title: <FormattedMessage id="landing.features.integration.title" defaultMessage="多平台 AI 集成" />,
      description: <FormattedMessage 
        id="landing.features.integration.description" 
        defaultMessage="无缝整合 ChatGPT、Deepseek、Grok 等领先 AI 平台，在同一界面使用多种 AI 能力" 
      />
    },
    {
      icon: faUsersBetweenLines,
      accentColor: '#ec4899',
      title: <FormattedMessage id="landing.features.communication.title" defaultMessage="AI 角色协作沟通" />,
      description: <FormattedMessage 
        id="landing.features.communication.description" 
        defaultMessage="创建 AI 角色组，让不同专业领域的 AI 共同协作，解决复杂问题，共享上下文" 
      />
    },
    {
      icon: faShieldHalved,
      accentColor: '#8b5cf6',
      title: <FormattedMessage id="landing.features.privacy.title" defaultMessage="隐私与数据安全" />,
      description: <FormattedMessage 
        id="landing.features.privacy.description" 
        defaultMessage="您的对话和数据安全受到严格保护，提供端对端加密和数据隔离，保障您的隐私" 
      />
    },
    {
      icon: faBrain,
      accentColor: '#14b8a6',
      title: <FormattedMessage id="landing.features.training.title" defaultMessage="持续学习与优化" />,
      description: <FormattedMessage 
        id="landing.features.training.description" 
        defaultMessage="AI 角色通过与您的互动不断学习和改进，随着时间推移，更好地理解您的需求和偏好" 
      />
    },
    {
      icon: faDatabase,
      accentColor: '#0ea5e9',
      title: <FormattedMessage id="landing.features.vectordb.title" defaultMessage="向量数据库 + RAG 技术" />,
      description: <FormattedMessage 
        id="landing.features.vectordb.description" 
        defaultMessage="采用向量数据库 + RAG 技术，实现知识库智能检索增强，让 AI 具备可靠的长期记忆和精准的知识问答能力，支持文档、对话、知识的实时学习" 
      />
    },
    {
      icon: faIndustry,
      accentColor: '#d946ef',
      title: <FormattedMessage id="landing.features.industry.title" defaultMessage="全行业模板支持" />,
      description: <FormattedMessage 
        id="landing.features.industry.description" 
        defaultMessage="提供金融、医疗、法律、教育等全行业专业提示词模板，内置行业知识库和最佳实践，让 AI 快速适配您的专业领域" 
      />
    },
    {
      icon: faCode,
      accentColor: '#2dd4bf',
      title: <FormattedMessage id="landing.features.function.title" defaultMessage="Function Calling 能力" />,
      description: <FormattedMessage 
        id="landing.features.function.description" 
        defaultMessage="支持强大的函数调用能力，AI 可直接操作文件、发送邮件、控制设备、访问数据库、调用 API，让 AI 具备真正的执行力" 
      />
    }
  ];

  return (
    <Section>
      <GradientBackground />
      <SectionContainer>
        <Row justify="center" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Col xs={24} md={16}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <SectionTitle>
                <FormattedMessage id="landing.features.title" defaultMessage="强大功能，无限可能" />
              </SectionTitle>
              <SectionSubtitle style={{ margin: '0 auto' }}>
                <FormattedMessage 
                  id="landing.features.subtitle" 
                  defaultMessage="AI MateX 提供全方位的功能，让您轻松打造专属 AI 团队，全面提升工作和创作效率" 
                />
              </SectionSubtitle>
            </motion.div>
          </Col>
        </Row>
        
        <FeatureGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              as={motion.div}
              variants={itemVariants}
              accentColor={feature.accentColor}
            >
              <IconWrapper className="feature-icon" accentColor={feature.accentColor}>
                <FontAwesomeIcon 
                  icon={feature.icon} 
                  style={{ fontSize: '1.75rem' }}
                />
              </IconWrapper>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </SectionContainer>
    </Section>
  );
};

export default Features; 