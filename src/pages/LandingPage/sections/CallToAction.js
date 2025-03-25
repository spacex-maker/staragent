import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { 
  Section,
  CTASection, 
  SectionContainer, 
  CTATitle, 
  CTASubtitle,
  PrimaryButton,
  SecondaryButton
} from '../styles';

// Additional styled components
const CTAContainer = styled.div`
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 3rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 3rem auto 0;
    gap: 1rem;
  }
`;

const GradientCircle = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '300px'};
  height: ${props => props.size || '300px'};
  border-radius: 50%;
  background: radial-gradient(circle, ${props => props.color || 'var(--ant-color-primary)'} 0%, transparent 70%);
  opacity: ${props => props.opacity || 0.1};
  z-index: -1;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  transform: translate(${props => props.translateX || '0'}, ${props => props.translateY || '0'});
`;

const StarShape = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  background: ${props => props.color || 'var(--ant-color-primary)'};
  border-radius: 50%;
  z-index: -1;
  opacity: 0.3;
  box-shadow: 0 0 20px ${props => props.color || 'var(--ant-color-primary)'};
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
`;

const CallToAction = ({ onGetStarted }) => {
  return (
    <CTASection>
      <SectionContainer>
        <CTAContainer>
          <CTATitle>
            <FormattedMessage 
              id="landing.cta.title" 
              defaultMessage="开启您的 AI 团队之旅" 
            />
          </CTATitle>
          <CTASubtitle>
            <FormattedMessage 
              id="landing.cta.subtitle" 
              defaultMessage="现在加入 AI MateX，开始创建、定制和管理您的专属 AI 团队，体验全新的工作与创作方式" 
            />
          </CTASubtitle>
          <ButtonGroup>
            <PrimaryButton 
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
            >
              <FormattedMessage id="landing.cta.getStarted" defaultMessage="免费开始使用" />
            </PrimaryButton>
            <SecondaryButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FormattedMessage id="landing.cta.learnMore" defaultMessage="了解更多" />
            </SecondaryButton>
          </ButtonGroup>
        </CTAContainer>
      </SectionContainer>
      
      {/* Decorative elements */}
      <GradientCircle 
        color="#3b82f6" 
        size="400px" 
        opacity={0.08} 
        top="10%" 
        left="10%" 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.12, 0.08]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <GradientCircle 
        color="#8b5cf6" 
        size="300px" 
        opacity={0.05} 
        bottom="10%" 
        right="10%" 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      <StarShape 
        color="#3b82f6" 
        top="20%" 
        right="30%" 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <StarShape 
        color="#8b5cf6" 
        top="70%" 
        left="20%" 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1.5
        }}
      />
      <StarShape 
        color="#ec4899" 
        bottom="20%" 
        right="25%" 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.8
        }}
      />
    </CTASection>
  );
};

export default CallToAction; 