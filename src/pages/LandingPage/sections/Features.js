import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';
import { 
  Section, 
  SectionContainer, 
  SectionTitle, 
  SectionSubtitle,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  GradientBackground
} from '../styles';

// Feature icons (using emoji for simplicity, could be replaced with proper SVG icons)
const FeatureIcons = {
  Customization: () => <span style={{ fontSize: '32px' }}>⚙️</span>,
  Marketplace: () => <span style={{ fontSize: '32px' }}>🛒</span>,
  Integration: () => <span style={{ fontSize: '32px' }}>🔄</span>,
  Communication: () => <span style={{ fontSize: '32px' }}>💬</span>,
  Privacy: () => <span style={{ fontSize: '32px' }}>🔒</span>,
  Training: () => <span style={{ fontSize: '32px' }}>🧠</span>
};

const Features = () => {
  // Animation variants
  const containerVariants = {
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Feature data
  const features = [
    {
      icon: 'Customization',
      title: <FormattedMessage id="landing.features.customization.title" defaultMessage="个性化 AI 角色定制" />,
      description: <FormattedMessage 
        id="landing.features.customization.description" 
        defaultMessage="根据您的需求定制独特的 AI 角色，从专业知识到个性特点，打造真正属于您的 AI 助手" 
      />
    },
    {
      icon: 'Marketplace',
      title: <FormattedMessage id="landing.features.marketplace.title" defaultMessage="AI 角色交易市场" />,
      description: <FormattedMessage 
        id="landing.features.marketplace.description" 
        defaultMessage="在全球 AI 角色市场中分享、购买或出售您训练的 AI 角色，让专业知识跨越边界" 
      />
    },
    {
      icon: 'Integration',
      title: <FormattedMessage id="landing.features.integration.title" defaultMessage="多平台 AI 集成" />,
      description: <FormattedMessage 
        id="landing.features.integration.description" 
        defaultMessage="无缝整合 ChatGPT、Deepseek、Grok 等领先 AI 平台，在同一界面使用多种 AI 能力" 
      />
    },
    {
      icon: 'Communication',
      title: <FormattedMessage id="landing.features.communication.title" defaultMessage="AI 角色协作沟通" />,
      description: <FormattedMessage 
        id="landing.features.communication.description" 
        defaultMessage="创建 AI 角色组，让不同专业领域的 AI 共同协作，解决复杂问题，共享上下文" 
      />
    },
    {
      icon: 'Privacy',
      title: <FormattedMessage id="landing.features.privacy.title" defaultMessage="隐私与数据安全" />,
      description: <FormattedMessage 
        id="landing.features.privacy.description" 
        defaultMessage="您的对话和数据安全受到严格保护，提供端对端加密和数据隔离，保障您的隐私" 
      />
    },
    {
      icon: 'Training',
      title: <FormattedMessage id="landing.features.training.title" defaultMessage="持续学习与优化" />,
      description: <FormattedMessage 
        id="landing.features.training.description" 
        defaultMessage="AI 角色通过与您的互动不断学习和改进，随着时间推移，更好地理解您的需求和偏好" 
      />
    }
  ];

  return (
    <Section>
      <GradientBackground />
      <SectionContainer>
        <Row justify="center" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Col xs={24} md={16}>
            <SectionTitle>
              <FormattedMessage id="landing.features.title" defaultMessage="强大功能，无限可能" />
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto' }}>
              <FormattedMessage 
                id="landing.features.subtitle" 
                defaultMessage="AI MateX 提供全方位的功能，让您轻松打造专属 AI 团队，全面提升工作和创作效率" 
              />
            </SectionSubtitle>
          </Col>
        </Row>
        
        <FeatureGrid as={motion.div}
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
            >
              <FeatureIcon>
                {FeatureIcons[feature.icon]()}
              </FeatureIcon>
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