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
  GradientBackground
} from '../styles';

// Additional styled components
const CommunityContainer = styled.div`
  position: relative;
  margin-top: 2rem;
`;

const MarketplaceImage = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 25px 50px rgba(0, 0, 0, 0.5)' 
    : '0 25px 50px rgba(0, 0, 0, 0.15)'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const OverlayGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.mode === 'dark' 
    ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8))' 
    : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.8))'};
  border-radius: 24px;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 4rem 0;
  flex-wrap: wrap;
  gap: 2rem;
`;

const StatItem = styled(motion.div)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--ant-color-primary) 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--ant-color-text);
  max-width: 180px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(59, 130, 246, 0.15)' 
    : 'rgba(59, 130, 246, 0.1)'};
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--ant-color-text);
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: var(--ant-color-text-secondary);
  line-height: 1.6;
`;

const AICommunity = () => {
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
  
  // Stats data
  const stats = [
    {
      number: "10,000+",
      label: <FormattedMessage id="landing.community.stats.aiRoles" defaultMessage="AI 角色" />
    },
    {
      number: "5,000+",
      label: <FormattedMessage id="landing.community.stats.creators" defaultMessage="创作者" />
    },
    {
      number: "150+",
      label: <FormattedMessage id="landing.community.stats.countries" defaultMessage="国家和地区" />
    },
    {
      number: "1M+",
      label: <FormattedMessage id="landing.community.stats.users" defaultMessage="活跃用户" />
    }
  ];

  // Features data
  const features = [
    {
      icon: "💰",
      title: <FormattedMessage id="landing.community.features.monetize.title" defaultMessage="变现您的 AI 创作" />,
      description: <FormattedMessage 
        id="landing.community.features.monetize.description" 
        defaultMessage="将您精心训练的 AI 角色在全球市场出售，通过您的专业知识和创造力获得收入" 
      />
    },
    {
      icon: "🤝",
      title: <FormattedMessage id="landing.community.features.collaborate.title" defaultMessage="社区协作" />,
      description: <FormattedMessage 
        id="landing.community.features.collaborate.description" 
        defaultMessage="与其他创作者合作开发复杂的 AI 角色，共享资源和知识，共创更强大的 AI 体验" 
      />
    },
    {
      icon: "🔍",
      title: <FormattedMessage id="landing.community.features.discover.title" defaultMessage="发现专业 AI 角色" />,
      description: <FormattedMessage 
        id="landing.community.features.discover.description" 
        defaultMessage="浏览全球各行各业的专业 AI 角色，找到最适合您特定需求的定制 AI 助手" 
      />
    }
  ];

  return (
    <Section>
      <GradientBackground />
      <SectionContainer>
        <Row justify="center" style={{ textAlign: 'center' }}>
          <Col xs={24} md={16}>
            <SectionTitle>
              <FormattedMessage id="landing.community.title" defaultMessage="全球 AI 角色交易市场" />
            </SectionTitle>
            <SectionSubtitle style={{ margin: '0 auto' }}>
              <FormattedMessage 
                id="landing.community.subtitle" 
                defaultMessage="加入充满活力的 AI 创作者社区，分享、交易和发现各行各业的专业 AI 角色" 
              />
            </SectionSubtitle>
          </Col>
        </Row>
        
        <CommunityContainer>
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={12} as={motion.div}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <MarketplaceImage>
                <img 
                  src="https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="AI 角色市场"
                />
                <OverlayGradient />
              </MarketplaceImage>
            </Col>
            
            <Col xs={24} lg={12}>
              <FeatureList as={motion.div}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {features.map((feature, index) => (
                  <FeatureItem key={index} as={motion.div} variants={itemVariants}>
                    <FeatureIcon>{feature.icon}</FeatureIcon>
                    <FeatureContent>
                      <FeatureTitle>{feature.title}</FeatureTitle>
                      <FeatureDescription>{feature.description}</FeatureDescription>
                    </FeatureContent>
                  </FeatureItem>
                ))}
              </FeatureList>
              
              <Row justify="start" style={{ marginTop: '3rem' }}>
                <PrimaryButton 
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FormattedMessage id="landing.community.exploreButton" defaultMessage="探索 AI 角色市场" />
                </PrimaryButton>
              </Row>
            </Col>
          </Row>
          
          <StatsContainer as={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {stats.map((stat, index) => (
              <StatItem key={index} as={motion.div} variants={itemVariants}>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </StatsContainer>
        </CommunityContainer>
      </SectionContainer>
    </Section>
  );
};

export default AICommunity; 