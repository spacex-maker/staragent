import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Spin, Empty, message, Tag, List, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { 
  CloudServerOutlined, 
  GlobalOutlined,
  AliyunOutlined,
  GoogleOutlined,
  AmazonOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { getActiveCloudProviders, getCloudProviderRegions } from 'services/storageService';

const { Title, Text } = Typography;

const Container = styled.div`
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  background: ${props => props.theme.mode === 'dark' ? '#141414' : '#f0f2f5'};
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#fff'};
  border-radius: 12px;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
    : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${props => props.theme.mode === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)'};
    transform: translateY(-2px);
  }

  .ant-card-head {
    border-bottom: 1px solid ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)'};
    padding: 16px 24px;
  }

  .ant-card-body {
    padding: 24px;
  }
`;

const ProviderCard = styled(Card)`
  height: 100%;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#fff'};
  border: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1677ff;
    transform: translateY(-2px);
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const ProviderLogo = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f0f2f5'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  overflow: hidden;

  .anticon {
    font-size: 32px;
    color: #1677ff;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 12px;
  }
`;

const ProviderName = styled(Title)`
  margin: 0 0 8px 0 !important;
  font-size: 18px !important;
`;

const ProviderInfo = styled(Text)`
  display: block;
  margin-bottom: 4px;
  color: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.45)'
    : 'rgba(0, 0, 0, 0.45)'};
`;

const WebsiteLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #1677ff;
  margin-top: 12px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const RegionCard = styled(Card)`
  margin-top: 24px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#fff'};
  border-radius: 12px;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
    : '0 2px 8px rgba(0, 0, 0, 0.05)'};

  .ant-card-head {
    border-bottom: 1px solid ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)'};
    padding: 16px 24px;
  }

  .ant-card-body {
    padding: 24px;
  }
`;

const StyledList = styled(List)`
  .ant-list-items {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .ant-list-item {
    margin: 0 !important;
    padding: 24px;
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : '#fff'};
    border: 1px solid ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)'};
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      background: ${props => props.theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.02)'};
      box-shadow: ${props => props.theme.mode === 'dark'
        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
        : '0 4px 12px rgba(0, 0, 0, 0.05)'};
    }
  }
`;

const RegionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.06)'};

  .anticon {
    color: #1677ff;
    font-size: 18px;
  }
`;

const RegionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: -4px;
`;

const RegionTag = styled(Tag)`
  display: inline-flex;
  align-items: center;
  margin: 4px;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(22, 119, 255, 0.15)' : 'rgba(22, 119, 255, 0.1)'};
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(22, 119, 255, 0.3)' : 'rgba(22, 119, 255, 0.2)'};
  color: ${props => props.theme.mode === 'dark' ? '#1677ff' : '#1677ff'};
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.theme.mode === 'dark' ? 'rgba(22, 119, 255, 0.2)' : 'rgba(22, 119, 255, 0.15)'};
    border-color: ${props => props.theme.mode === 'dark' ? 'rgba(22, 119, 255, 0.4)' : 'rgba(22, 119, 255, 0.3)'};
  }
`;

const RegionCode = styled.span`
  font-size: 0.85em;
  color: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.65)'
    : 'rgba(0, 0, 0, 0.65)'};
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(0, 0, 0, 0.15)'};
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
`;

const SelectedProviderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const getProviderIcon = (providerName: string) => {
  const icons: Record<string, string> = {
    'Alibaba Cloud': 'https://img.alicdn.com/tfs/TB1_ZXuNcfpK1RjSZFOXXa6nFXa-32-32.ico',
    'Tencent Cloud': 'https://cloud.tencent.com/favicon.ico',
    'Huawei Cloud': 'https://www.huaweicloud.com/favicon.ico',
    'Baidu AI Cloud': 'https://bce.bdstatic.com/img/favicon.ico',
    'AWS': 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico',
    'Google Cloud': 'https://www.gstatic.com/devrel-devsite/prod/v45f61267e22826169cf5d5f452882f7812c8cfb5f8b103a48c0d88727908b295/cloud/images/favicons/onecloud/favicon.ico',
    'Microsoft Azure': 'https://azure.microsoft.com/favicon.ico',
  };

  return icons[providerName] || null;
};

const CloudProviders: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [regionsLoading, setRegionsLoading] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await getActiveCloudProviders();
        if (response.success && response.data) {
          setProviders(response.data);
        } else {
          message.error(response.message);
        }
      } catch (error) {
        message.error('获取云厂商信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleProviderClick = async (provider: any) => {
    if (selectedProvider?.id === provider.id) {
      setSelectedProvider(null);
      setRegions([]);
      return;
    }

    setSelectedProvider(provider);
    setRegionsLoading(true);
    try {
      const response = await getCloudProviderRegions(provider.id);
      if (response.success && response.data) {
        const groupedRegions = response.data.reduce((acc: any, region: any) => {
          if (!acc[region.countryCode]) {
            acc[region.countryCode] = [];
          }
          acc[region.countryCode].push(region);
          return acc;
        }, {});
        setRegions(Object.entries(groupedRegions));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('获取地域信息失败');
    } finally {
      setRegionsLoading(false);
    }
  };

  const renderProviderLogo = (provider: any) => {
    const iconUrl = getProviderIcon(provider.providerName);
    
    if (iconUrl) {
      return (
        <ProviderLogo>
          <img src={iconUrl} alt={provider.providerName} />
        </ProviderLogo>
      );
    }

    // 如果没有找到对应的图标，使用默认的云图标
    return (
      <ProviderLogo>
        <CloudServerOutlined />
      </ProviderLogo>
    );
  };

  const renderRegions = () => {
    if (!selectedProvider) return null;

    return (
      <RegionCard>
        <SelectedProviderInfo>
          {renderProviderLogo(selectedProvider)}
          <Title level={4} style={{ margin: 0 }}>
            {selectedProvider.providerName} - <FormattedMessage id="cloudProviders.availableRegions" defaultMessage="可用地域" />
          </Title>
        </SelectedProviderInfo>
        {regionsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <StyledList
            dataSource={regions}
            renderItem={item => {
              const [countryCode, regionList] = item as [string, any[]];
              return (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <RegionHeader>
                      <EnvironmentOutlined />
                      <Title level={5} style={{ margin: 0 }}>
                        {countryCode}
                      </Title>
                      <Text type="secondary" style={{ marginLeft: 'auto' }}>
                        {regionList.length} <FormattedMessage id="cloudProviders.regions" defaultMessage="个地域" />
                      </Text>
                    </RegionHeader>
                    <RegionList>
                      {regionList.map((region: any) => (
                        <Tooltip 
                          key={region.regionCode} 
                          title={
                            <div style={{ textAlign: 'center' }}>
                              <div>{region.regionName}</div>
                              <small style={{ opacity: 0.8 }}>{region.regionCode}</small>
                            </div>
                          }
                        >
                          <RegionTag>
                            {region.regionName}
                            <RegionCode>{region.regionCode}</RegionCode>
                          </RegionTag>
                        </Tooltip>
                      ))}
                    </RegionList>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </RegionCard>
    );
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </Container>
    );
  }

  return (
    <Container>
      <StyledCard>
        <Title level={4}>
          <CloudServerOutlined style={{ marginRight: 8, color: '#1677ff' }} />
          <FormattedMessage id="cloudProviders.title" defaultMessage="支持的云厂商" />
        </Title>
        <Text type="secondary">
          <FormattedMessage 
            id="cloudProviders.description" 
            defaultMessage="我们目前支持以下云服务提供商，为您提供稳定可靠的云存储服务" 
          />
        </Text>
      </StyledCard>

      {providers.length > 0 ? (
        <>
          <Row gutter={[24, 24]}>
            {providers.map(provider => (
              <Col xs={24} sm={12} md={8} lg={6} key={provider.id}>
                <ProviderCard 
                  onClick={() => handleProviderClick(provider)} 
                  style={{ 
                    cursor: 'pointer',
                    borderColor: selectedProvider?.id === provider.id ? '#1677ff' : undefined
                  }}
                >
                  {renderProviderLogo(provider)}
                  <ProviderName level={5}>{provider.providerName}</ProviderName>
                  <ProviderInfo>
                    <FormattedMessage id="cloudProviders.country" defaultMessage="国家/地区" />: {provider.countryCode}
                  </ProviderInfo>
                  <ProviderInfo>
                    <FormattedMessage id="cloudProviders.type" defaultMessage="服务类型" />: {provider.serviceType}
                  </ProviderInfo>
                  <WebsiteLink 
                    href={provider.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GlobalOutlined />
                    <FormattedMessage id="cloudProviders.website" defaultMessage="访问官网" />
                  </WebsiteLink>
                </ProviderCard>
              </Col>
            ))}
          </Row>
          {renderRegions()}
        </>
      ) : (
        <StyledCard>
          <Empty
            description={
              <FormattedMessage 
                id="cloudProviders.empty" 
                defaultMessage="暂无可用的云服务提供商" 
              />
            }
          />
        </StyledCard>
      )}
    </Container>
  );
};

export default CloudProviders; 