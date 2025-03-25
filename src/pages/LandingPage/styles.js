import styled, { keyframes } from 'styled-components';
import { Button } from 'antd';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Landing Page Container
export const LandingContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--ant-color-bg-container);
`;

// Main Content
export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 64px;  // Height of the header
  animation: ${fadeIn} 0.5s ease-in-out;
`;

// Sections
export const Section = styled.section`
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

export const HeroSection = styled(Section)`
  padding: 8rem 0 6rem;
  background-color: var(--background-color);
  
  @media (max-width: 768px) {
    padding: 6rem 0 4rem;
  }
`;

export const FeaturesSection = styled(Section)`
  background-color: var(--background-color-secondary);
`;

export const CustomizationSection = styled(Section)`
  background-color: var(--background-color);
`;

export const CommunitySection = styled(Section)`
  background-color: var(--background-color-secondary);
`;

export const IntegrationSection = styled(Section)`
  background-color: var(--background-color);
`;

export const TestimonialsSection = styled(Section)`
  background-color: var(--background-color-secondary);
`;

export const CTASection = styled(Section)`
  background-color: var(--background-color);
  padding: 8rem 0;
  
  @media (max-width: 768px) {
    padding: 5rem 0;
  }
`;

// Containers
export const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

// Headings
export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }
`;

// Hero Specific
export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

// CTA Specific
export const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

export const CTASubtitle = styled.p`
  font-size: 1.3rem;
  color: var(--text-secondary);
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

// Buttons
export const PrimaryButton = styled(Button)`
  height: 48px;
  padding: 0 2rem;
  font-size: 1rem;
  font-weight: 500;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  color: white;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
  }
`;

export const SecondaryButton = styled(Button)`
  height: 48px;
  padding: 0 2rem;
  font-size: 1rem;
  font-weight: 500;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: var(--ant-color-primary);
  border-radius: 6px;
  
  &:hover {
    background: rgba(59, 130, 246, 0.15);
    border-color: var(--ant-color-primary);
    color: var(--ant-color-primary);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Card styling
export const Card = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

// Gradient backgrounds
export const GradientBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.gradient || 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'};
  z-index: 0;
`;

// CSS Variables Helper
export const getCSSVariables = (isDarkMode) => `
  :root {
    --background-color: ${isDarkMode ? '#111827' : '#ffffff'};
    --background-color-secondary: ${isDarkMode ? '#1f2937' : '#f9fafb'};
    --card-background: ${isDarkMode ? '#1f2937' : '#ffffff'};
    --text-color: ${isDarkMode ? '#f9fafb' : '#111827'};
    --text-secondary: ${isDarkMode ? '#9ca3af' : '#4b5563'};
    --border-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

// Cards
export const FeatureCard = styled.div`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.5)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
    : '0 20px 40px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.mode === 'dark' 
      ? '0 30px 60px rgba(0, 0, 0, 0.4)' 
      : '0 30px 60px rgba(0, 0, 0, 0.1)'};
  }
`;

// Floating Elements
export const FloatingElement = styled.div`
  animation: ${floatAnimation} 3s ease-in-out infinite;
`;

// AI Card Element
export const AICard = styled.div`
  position: relative;
  background: ${props => props.theme.mode === 'dark' 
    ? 'linear-gradient(135deg, #2a2a72 0%, #009ffd 100%)' 
    : 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)'};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      rgba(255, 255, 255, 0) 100%);
    background-size: 200% 100%;
    animation: ${shimmerAnimation} 2s infinite;
    z-index: 1;
  }
`;

// Scroll Progress
export const ScrollProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  z-index: 1001;
`;

export const ScrollProgressIndicator = styled.div`
  height: 100%;
  background: var(--ant-color-primary);
  width: 0%;
  transition: width 0.1s ease-out;
`;

// Testimonial styles
export const TestimonialCard = styled.div`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.5)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
    : '0 10px 30px rgba(0, 0, 0, 0.05)'};
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  margin: 1rem;
`;

// Platform Integration
export const IntegrationCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.3)' 
    : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 8px 20px rgba(0, 0, 0, 0.2)' 
    : '0 8px 20px rgba(0, 0, 0, 0.05)'};
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.03)'};
  height: 100px;
  margin: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.theme.mode === 'dark' 
      ? '0 15px 30px rgba(0, 0, 0, 0.3)' 
      : '0 15px 30px rgba(0, 0, 0, 0.1)'};
  }
  
  img {
    max-height: 60px;
    max-width: 140px;
    filter: ${props => props.theme.mode === 'dark' 
      ? 'brightness(0.9) contrast(1.1)' 
      : 'none'};
  }
`;

// AI Profiles Section
export const AIProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

export const AIProfileCard = styled.div`
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.5)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(12px);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 15px 30px rgba(0, 0, 0, 0.3)' 
    : '0 15px 30px rgba(0, 0, 0, 0.08)'};
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.mode === 'dark' 
      ? '0 25px 50px rgba(0, 0, 0, 0.4)' 
      : '0 25px 50px rgba(0, 0, 0, 0.12)'};
  }
`;

export const AIProfileImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

export const AIProfileContent = styled.div`
  padding: 1.5rem;
`;

export const AIProfileTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--ant-color-text);
`;

export const AIProfileDescription = styled.p`
  font-size: 1rem;
  color: var(--ant-color-text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

export const AIProfileStats = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  padding-top: 1rem;
  margin-top: 1rem;
  
  span {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: var(--ant-color-text-secondary);
    
    svg {
      margin-right: 0.5rem;
    }
  }
`;

// Features Sections
export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(59, 130, 246, 0.15)' 
    : 'rgba(59, 130, 246, 0.1)'};
  color: var(--ant-color-primary);
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--ant-color-text);
`;

export const FeatureDescription = styled.p`
  font-size: 1rem;
  color: var(--ant-color-text-secondary);
  line-height: 1.6;
`; 