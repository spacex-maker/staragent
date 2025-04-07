import React from 'react';
import { Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FooterSection = styled.footer`
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 4rem 0 2rem;
  position: relative;
  overflow: hidden;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const FooterDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 300px;
`;

const FooterLinksTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
`;

const FooterLinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 0.8rem;
`;

const FooterLink = styled(motion.a)`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: var(--ant-color-primary);
  }
`;

const FooterRouterLink = styled(motion(Link))`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: var(--ant-color-primary);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialLink = styled(motion.a)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ant-color-primary);
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--ant-color-primary);
    color: white;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const Footer = ({ onLanguageChange, currentLocale }) => {
  return (
    <FooterSection>
      <FooterContainer>
        <Row gutter={[48, 48]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <Logo>AI MateX</Logo>
            <FooterDescription>
              <FormattedMessage 
                id="footer.description" 
                defaultMessage="专业的 AI 团队平台，为您打造高效定制的 AI 协作体验" 
              />
            </FooterDescription>
            <SocialLinks>
              <SocialLink 
                href="https://twitter.com" 
                target="_blank"
                whileHover={{ y: -3 }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59l-.047-.02z" />
                </svg>
              </SocialLink>
              <SocialLink 
                href="https://facebook.com" 
                target="_blank"
                whileHover={{ y: -3 }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </SocialLink>
              <SocialLink 
                href="https://linkedin.com" 
                target="_blank"
                whileHover={{ y: -3 }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialLink>
              <SocialLink 
                href="https://github.com" 
                target="_blank"
                whileHover={{ y: -3 }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </SocialLink>
            </SocialLinks>
          </Col>
          
          <Col xs={12} sm={8} md={5} lg={5}>
            <FooterLinksTitle>
              <FormattedMessage id="footer.company" defaultMessage="公司" />
            </FooterLinksTitle>
            <FooterLinksList>
              <FooterLinkItem>
                <FooterLink href="#" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.about" defaultMessage="关于我们" />
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterRouterLink to="/careers" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.careers" defaultMessage="招贤纳士" />
                </FooterRouterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.blog" defaultMessage="博客" />
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.press" defaultMessage="媒体报道" />
                </FooterLink>
              </FooterLinkItem>
            </FooterLinksList>
          </Col>
          
          <Col xs={12} sm={8} md={5} lg={5}>
            <FooterLinksTitle>
              <FormattedMessage id="footer.resources" defaultMessage="资源" />
            </FooterLinksTitle>
            <FooterLinksList>
              <FooterLinkItem>
                <FooterLink href="#" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.docs" defaultMessage="文档" />
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.community" defaultMessage="社区" />
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.tutorials" defaultMessage="教程" />
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.webinars" defaultMessage="网络研讨会" />
                </FooterLink>
              </FooterLinkItem>
            </FooterLinksList>
          </Col>
          
          <Col xs={12} sm={8} md={6} lg={6}>
            <FooterLinksTitle>
              <FormattedMessage id="footer.legal" defaultMessage="法律" />
            </FooterLinksTitle>
            <FooterLinksList>
              <FooterLinkItem>
                <FooterRouterLink to="/terms" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.terms" defaultMessage="服务条款" />
                </FooterRouterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterRouterLink to="/privacy" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.privacy" defaultMessage="隐私政策" />
                </FooterRouterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.security" defaultMessage="安全" />
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#" whileHover={{ x: 3 }}>
                  <FormattedMessage id="footer.compliance" defaultMessage="合规" />
                </FooterLink>
              </FooterLinkItem>
            </FooterLinksList>
          </Col>
        </Row>
        
        <Copyright>
          <FormattedMessage 
            id="footer.copyright" 
            defaultMessage="© {year} AI MateX. 版权所有。" 
            values={{ year: new Date().getFullYear() }}
          />
        </Copyright>
      </FooterContainer>
    </FooterSection>
  );
};

export default Footer; 