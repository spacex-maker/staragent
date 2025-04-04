import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

// Components
import SEO from '../../components/SEO';
import SimpleHeader from '../../components/headers/simple';
import Hero from './sections/Hero';
import Features from './sections/Features';
import AICommunity from './sections/AICommunity';
import AITeamCustomization from './sections/AITeamCustomization';
import PlatformIntegration from './sections/PlatformIntegration';
import Testimonials from './sections/Testimonials';
import CallToAction from './sections/CallToAction';
import Footer from './sections/Footer';
import AITeamShowcase from './sections/AITeamShowcase';

// Styles
import { 
  LandingContainer,
  MainContent,
  ScrollProgress,
  ScrollProgressIndicator
} from './styles';

// Global styles for the landing page
const LandingPageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
`;

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--ant-color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: ${props => (props.visible ? 'translateY(0)' : 'translateY(30px)')};
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  z-index: 100;
  
  &:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const LandingPage = ({ onLanguageChange, currentLocale }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const intl = useIntl();
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Track scroll progress for animation
  React.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = (currentScroll / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle CTAs
  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleExploreFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <LandingPageContainer>
      <SEO 
        title="您的个人 AI 团队平台"
        description="AI MateX 是一个全新的 AI 团队平台，让您创建、定制和交易个性化 AI 角色。整合 ChatGPT、Deepseek、Grok 等先进模型，打造属于您的 AI 团队。"
        keywords="AI团队,人工智能,AI助手,ChatGPT,Deepseek,Grok,AI定制,AI交易,AI平台,AI协作,AI训练,AI开发"
        image="/images/ai-team-og-image.jpg"
        url="https://aimatex.com"
        type="website"
        locale={currentLocale}
      />

      {/* Scroll Progress Indicator */}
      <ScrollProgress>
        <ScrollProgressIndicator style={{ width: `${scrollProgress}%` }} />
      </ScrollProgress>

      {/* Header */}
      <SimpleHeader />

      {/* Main Content */}
      <MainContent>
        {/* Hero Section */}
        <Hero 
          onGetStarted={handleGetStarted}
          onExploreFeatures={handleExploreFeatures}
        />

        {/* Features Section */}
        <div id="features-section">
          <Features />
        </div>

        {/* AI Team Customization */}
        <AITeamCustomization />

        {/* AI Community & Marketplace */}
        <AICommunity />

        {/* Platform Integration */}
        <PlatformIntegration />

        {/* Testimonials */}
        <Testimonials />

        {/* Call to Action */}
        <CallToAction onGetStarted={handleGetStarted} />

        <AITeamShowcase />
      </MainContent>

      {/* Footer */}
      <Footer onLanguageChange={onLanguageChange} currentLocale={currentLocale} />

      <ScrollToTopButton 
        visible={showScrollButton} 
        onClick={scrollToTop}
        aria-label={intl.formatMessage({ id: 'landing.scrollToTop', defaultMessage: '回到顶部' })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </ScrollToTopButton>
    </LandingPageContainer>
  );
};

export default LandingPage; 