import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Card, Row, Col, Typography, Tabs } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const SettingsContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 64px;
`;

const SettingsCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const SettingsPage = () => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'settings.page.title', defaultMessage: '设置 - AI MateX' })}</title>
        <meta 
          name="description" 
          content={intl.formatMessage({ 
            id: 'settings.page.description', 
            defaultMessage: '管理您的账户设置和偏好' 
          })}
        />
      </Helmet>
      <SettingsContainer>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Title level={2}>
              {intl.formatMessage({ id: 'settings.title', defaultMessage: '设置' })}
            </Title>
          </Col>
          <Col span={24}>
            <SettingsCard>
              <Tabs
                defaultActiveKey="account"
                items={[
                  {
                    key: 'account',
                    label: intl.formatMessage({ id: 'settings.tabs.account', defaultMessage: '账户设置' }),
                    children: <div>账户设置内容将在此处显示</div>,
                  },
                  {
                    key: 'preferences',
                    label: intl.formatMessage({ id: 'settings.tabs.preferences', defaultMessage: '偏好设置' }),
                    children: <div>偏好设置内容将在此处显示</div>,
                  },
                  {
                    key: 'privacy',
                    label: intl.formatMessage({ id: 'settings.tabs.privacy', defaultMessage: '隐私与安全' }),
                    children: <div>隐私与安全设置内容将在此处显示</div>,
                  },
                ]}
              />
            </SettingsCard>
          </Col>
        </Row>
      </SettingsContainer>
    </>
  );
};

export default SettingsPage; 