import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaintBrush,
  faCode,
  faServer,
  faFlask,
  faRobot,
  faMicrochip,
  faGears,
  faCodeBranch
} from '@fortawesome/free-solid-svg-icons';
import { 
  Section, 
  SectionContainer, 
  SectionTitle, 
  SectionSubtitle,
  GradientBackground
} from '../styles';

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 5rem 0 4rem;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 4rem;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    margin-top: 3rem;
  }
`;

const RoleCard = styled(motion.div)`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(15, 23, 42, 0.6)' 
    : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    
    &::before {
      transform: translateX(0);
      opacity: 0.1;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--ant-color-primary), ${props => props.accentColor || '#4f46e5'});
    transform: translateX(-100%);
    opacity: 0;
    transition: all 0.3s ease;
  }
`;

const RoleIcon = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto 2rem;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(59, 130, 246, 0.15)' 
    : 'rgba(59, 130, 246, 0.1)'};
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ant-color-primary);
  font-size: 28px;
  transition: all 0.3s ease;
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
    transition: 0.5s;
  }

  ${RoleCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    color: ${props => props.accentColor || 'var(--ant-color-primary)'};
    
    &::after {
      left: 100%;
    }
  }
`;

const RoleTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--ant-color-text);
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
`;

const RoleDescription = styled.p`
  font-size: 1rem;
  color: var(--ant-color-text-secondary);
  line-height: 1.6;
  text-align: center;
`;

const Highlight = styled.div`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(15, 23, 42, 0.6)' 
    : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 20px;
  padding: 3.5rem;
  margin-top: 4rem;
  border: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.1),
      rgba(147, 51, 234, 0.1)
    );
    opacity: 0.5;
    z-index: -1;
  }
  
  h3 {
    font-size: 1.75rem;
    color: var(--ant-color-text);
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: center;
    
    svg {
      margin-right: 0.5rem;
      color: var(--ant-color-primary);
    }
  }
  
  p {
    font-size: 1.125rem;
    color: var(--ant-color-text-secondary);
    line-height: 1.7;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
`;

const AITeamShowcase = () => {
  const roles = [
    {
      icon: faPaintBrush,
      accentColor: '#10b981',
      title: <FormattedMessage id="landing.showcase.role.design" defaultMessage="UI/UX Design" />,
      description: <FormattedMessage 
        id="landing.showcase.role.design.desc" 
        defaultMessage="Collaborating with AI for innovative interface design, ensuring optimal user experience and visual appeal" 
      />
    },
    {
      icon: faCode,
      accentColor: '#3b82f6',
      title: <FormattedMessage id="landing.showcase.role.frontend" defaultMessage="Frontend Development" />,
      description: <FormattedMessage 
        id="landing.showcase.role.frontend.desc" 
        defaultMessage="Leveraging AI pair programming to build responsive and performant React applications" 
      />
    },
    {
      icon: faServer,
      accentColor: '#8b5cf6',
      title: <FormattedMessage id="landing.showcase.role.backend" defaultMessage="Backend Development" />,
      description: <FormattedMessage 
        id="landing.showcase.role.backend.desc" 
        defaultMessage="Creating robust server architecture with AI assistance for scalability and security" 
      />
    },
    {
      icon: faFlask,
      accentColor: '#ec4899',
      title: <FormattedMessage id="landing.showcase.role.testing" defaultMessage="Testing & DevOps" />,
      description: <FormattedMessage 
        id="landing.showcase.role.testing.desc" 
        defaultMessage="Implementing comprehensive testing and deployment strategies with AI-powered automation" 
      />
    }
  ];

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Section>
      <GradientBackground />
      <SectionContainer>
        <Row justify="center" style={{ textAlign: 'center' }}>
          <Col xs={24} md={16}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <SectionTitle>
                <FormattedMessage 
                  id="landing.showcase.title" 
                  defaultMessage="One Developer, Infinite Possibilities" 
                />
              </SectionTitle>
              <SectionSubtitle style={{ margin: '0 auto' }}>
                <FormattedMessage 
                  id="landing.showcase.subtitle" 
                  defaultMessage="Witness how Anakkix, powered by an AI team, built AIMateX from concept to production" 
                />
              </SectionSubtitle>
            </motion.div>
          </Col>
        </Row>
        
        <TeamGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {roles.map((role, index) => (
            <RoleCard
              key={index}
              variants={itemVariants}
              accentColor={role.accentColor}
            >
              <RoleIcon accentColor={role.accentColor}>
                <FontAwesomeIcon icon={role.icon} />
              </RoleIcon>
              <RoleTitle>{role.title}</RoleTitle>
              <RoleDescription>{role.description}</RoleDescription>
            </RoleCard>
          ))}
        </TeamGrid>

        <Highlight>
          <h3>
            <FontAwesomeIcon icon={faRobot} />
            <FormattedMessage 
              id="landing.showcase.highlight.title" 
              defaultMessage="The Power of Human-AI Collaboration" 
            />
          </h3>
          <p>
            <FormattedMessage 
              id="landing.showcase.highlight.description" 
              defaultMessage="AIMateX demonstrates the future of software development - where one visionary developer, armed with a team of specialized AI agents, can bring ambitious projects to life. This revolutionary approach combines human creativity with AI efficiency to deliver exceptional results." 
            />
          </p>
        </Highlight>
      </SectionContainer>
    </Section>
  );
};

export default AITeamShowcase; 