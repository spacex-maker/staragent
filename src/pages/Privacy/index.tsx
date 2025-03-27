import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { DEFAULT_AVATAR } from '../../App';
import SimpleHeader from '../../components/headers/simple';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.mode === 'dark' 
    ? 'var(--ant-color-bg-container)' 
    : '#f5f7fa'};
  padding: 6rem 2rem 2rem;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 5rem 1rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : '#ffffff'};
  padding: 2rem;
  border-radius: 20px;
  box-shadow: ${props => props.theme.mode === 'dark'
    ? '0 4px 24px rgba(0, 0, 0, 0.2)'
    : '0 4px 24px rgba(0, 0, 0, 0.05)'};
    
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: var(--ant-color-text);
  margin-bottom: 2rem;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--ant-color-text);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--ant-color-primary);
`;

const Paragraph = styled.p`
  color: var(--ant-color-text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const List = styled.ul`
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  color: var(--ant-color-text-secondary);
  line-height: 1.8;
  margin-bottom: 0.5rem;
`;

const LastUpdated = styled.div`
  text-align: right;
  color: var(--ant-color-text-quaternary);
  font-size: 0.875rem;
  margin-top: 2rem;
`;

const ContactCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'var(--ant-color-primary-bg)'};
  border-radius: 12px;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ContactAvatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--ant-color-primary);
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: var(--ant-color-text);
  margin-bottom: 0.5rem;
`;

const ContactEmail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ant-color-primary);
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StyledLink = styled(Link)`
  color: var(--ant-color-primary);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }
`;

const RelatedLinks = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.06)'};
`;

const RelatedLinksTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: var(--ant-color-text);
  margin-bottom: 0.5rem;
`;

const RelatedLinksList = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrivacyPolicy: React.FC = () => {
  const intl = useIntl();
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'privacy.page.title' })}</title>
        <meta name="description" content="隐私政策 - AIMateX" />
      </Helmet>
      
      <SimpleHeader />
      
      <PageContainer>
        <ContentWrapper>
          <Title>
            <FormattedMessage id="privacy.title" />
          </Title>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.introduction.title" />
            </SectionTitle>
            <Paragraph>
              <FormattedMessage id="privacy.introduction.content" />
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.collection.title" />
            </SectionTitle>
            <Paragraph>
              <FormattedMessage id="privacy.collection.description" />
            </Paragraph>
            <List>
              <ListItem>
                <FormattedMessage id="privacy.collection.item1" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.collection.item2" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.collection.item3" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.collection.item4" />
              </ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.usage.title" />
            </SectionTitle>
            <Paragraph>
              <FormattedMessage id="privacy.usage.description" />
            </Paragraph>
            <List>
              <ListItem>
                <FormattedMessage id="privacy.usage.item1" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.usage.item2" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.usage.item3" />
              </ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.protection.title" />
            </SectionTitle>
            <Paragraph>
              <FormattedMessage id="privacy.protection.content" />
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.cookies.title" />
            </SectionTitle>
            <Paragraph>
              <FormattedMessage id="privacy.cookies.content" />
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.thirdParty.title" />
            </SectionTitle>
            <Paragraph>
              <FormattedMessage id="privacy.thirdParty.content" />
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.data.title" />
            </SectionTitle>
            <Paragraph>
              <FormattedMessage id="privacy.data.content" />
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.security.title" />
            </SectionTitle>
            <Paragraph>
              <FormattedMessage id="privacy.security.content" />
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.rights.title" />
            </SectionTitle>
            <List>
              <ListItem>
                <FormattedMessage id="privacy.rights.item1" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.rights.item2" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.rights.item3" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.rights.item4" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.rights.item5" />
              </ListItem>
              <ListItem>
                <FormattedMessage id="privacy.rights.item6" />
              </ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>
              <FormattedMessage id="privacy.contact.title" />
            </SectionTitle>
            <ContactCard>
              <ContactAvatar src={DEFAULT_AVATAR} alt="AIMateX Support" />
              <ContactInfo>
                <ContactTitle>AIMateX Support</ContactTitle>
                <ContactEmail>
                  <MailOutlined />
                  aimatex2024@gmail.com
                </ContactEmail>
              </ContactInfo>
            </ContactCard>
            <Paragraph>
              <FormattedMessage id="privacy.contact.content" />
            </Paragraph>
          </Section>

          <RelatedLinks>
            <RelatedLinksTitle>
              <FormattedMessage id="privacy.related.title" defaultMessage="相关链接" />
            </RelatedLinksTitle>
            <RelatedLinksList>
              <StyledLink to="/terms">
                <FormattedMessage id="privacy.related.terms" defaultMessage="服务条款" />
              </StyledLink>
            </RelatedLinksList>
          </RelatedLinks>

          <LastUpdated>
            {intl.formatMessage({ id: 'privacy.lastUpdated' }, { date: currentDate })}
          </LastUpdated>
        </ContentWrapper>
      </PageContainer>
    </>
  );
};

export default PrivacyPolicy; 