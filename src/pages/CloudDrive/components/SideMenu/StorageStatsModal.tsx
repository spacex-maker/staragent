import React, { useEffect, useState } from 'react';
import { Modal, Typography, Progress, Spin, Row, Col, Tabs, Menu, Card, Tag, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { 
  getStorageStats,
  getActiveCloudProviders,
  getCloudProviderRegions,
  getUserStorageNodes
} from 'services/storageService';
import type { CloudProvider } from 'services/storageService';
import { formatFileSize } from 'utils/format';
import {
  FileImageOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
  CloudOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface StorageStatsModalProps {
  open: boolean;
  onClose: () => void;
}

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
`;

const TabContent = styled.div`
  display: flex;
  height: 600px;
`;

const ProviderIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: text-bottom;
`;

const ProviderMenu = styled(Menu)`
  width: 240px;
  height: 100%;
  border-right: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  
  .ant-menu-item {
    display: flex;
    align-items: center;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const StatsCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  margin-bottom: 16px;
`;

const RegionCard = styled(Card)`
  margin-bottom: 16px;
  cursor: default;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#fff'};
  border-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#d9d9d9'};
  
  &.active {
    border-color: ${props => props.theme.mode === 'dark' ? '#177ddc' : '#1890ff'};
    
    .ant-card-head {
      background: ${props => props.theme.mode === 'dark' ? 'rgba(23, 125, 220, 0.1)' : '#e6f7ff'};
      border-bottom-color: ${props => props.theme.mode === 'dark' ? '#177ddc' : '#1890ff'};
    }

    .ant-card-body {
      background: ${props => props.theme.mode === 'dark' ? 'rgba(23, 125, 220, 0.04)' : 'transparent'};
    }
  }

  .storage-info {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  }

  .storage-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .ant-card-head {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'transparent'};
    border-bottom-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f0f0f0'};
  }

  .ant-card-head-title {
    color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  }

  .ant-progress-bg {
    background: ${props => props.theme.mode === 'dark' ? '#177ddc' : '#1890ff'};
  }

  .ant-progress-text {
    color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  }

  &:hover {
    border-color: ${props => props.theme.mode === 'dark' ? '#177ddc' : '#1890ff'};
  }
`;

const TypeIcon = styled.div<{ color: string }>`
  font-size: 24px;
  color: ${props => props.color};
  margin-right: 12px;
`;

const TypeRow = styled(Row)`
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const TypeInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressWrapper = styled.div`
  margin-top: 8px;
`;

const RegionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const getTypeIcon = (fileType: string) => {
  switch (fileType) {
    case 'IMAGE':
      return <FileImageOutlined />;
    case 'VIDEO':
      return <VideoCameraOutlined />;
    case 'AUDIO':
      return <AudioOutlined />;
    case 'DOCUMENT':
      return <FileTextOutlined />;
    case 'ARCHIVE':
      return <FileZipOutlined />;
    default:
      return <FileUnknownOutlined />;
  }
};

const getTypeColor = (fileType: string) => {
  switch (fileType) {
    case 'IMAGE':
      return '#52c41a';
    case 'VIDEO':
      return '#1890ff';
    case 'AUDIO':
      return '#722ed1';
    case 'DOCUMENT':
      return '#fa8c16';
    case 'ARCHIVE':
      return '#eb2f96';
    default:
      return '#8c8c8c';
  }
};

const StorageStatsModal: React.FC<StorageStatsModalProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [userNodes, setUserNodes] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      fetchStats();
      fetchProviders();
      fetchUserNodes();
    }
  }, [open]);

  useEffect(() => {
    if (selectedProvider) {
      fetchRegions(selectedProvider);
    }
  }, [selectedProvider]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await getStorageStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('获取存储统计信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await getActiveCloudProviders();
      if (response.success && response.data) {
        const providersData = response.data as CloudProvider[];
        setProviders(providersData);
        // 查找默认的服务提供商
        const defaultProvider = providersData.find(provider => provider.isDefault);
        // 如果找到默认提供商则选中它，否则选中第一个
        setSelectedProvider(defaultProvider ? defaultProvider.id : providersData[0]?.id);
      }
    } catch (error) {
      console.error('获取云服务提供商失败:', error);
    }
  };

  const fetchRegions = async (providerId: number) => {
    setLoadingRegions(true);
    try {
      const response = await getCloudProviderRegions(providerId);
      if (response.success && response.data) {
        setRegions(response.data);
      }
    } catch (error) {
      console.error('获取地域信息失败:', error);
    } finally {
      setLoadingRegions(false);
    }
  };

  const fetchUserNodes = async () => {
    try {
      const response = await getUserStorageNodes();
      if (response.success && response.data) {
        setUserNodes(response.data);
      }
    } catch (error) {
      console.error('获取用户存储节点失败:', error);
    }
  };

  const isRegionActive = (regionCode: string) => {
    return userNodes.some(node => node.nodeRegion === regionCode);
  };

  const renderOverviewTab = () => (
    <>
      <StatsCard>
        <Title level={5}>
          <FormattedMessage id="sideMenu.storageStats.overview" defaultMessage="总览" />
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Text type="secondary">
              <FormattedMessage id="sideMenu.storageStats.totalFiles" defaultMessage="文件总数" />
            </Text>
            <br />
            <Text strong>{stats.totalFiles} 个</Text>
          </Col>
          <Col span={12}>
            <Text type="secondary">
              <FormattedMessage id="sideMenu.storageStats.totalSize" defaultMessage="总容量" />
            </Text>
            <br />
            <Text strong>{formatFileSize(stats.totalSize)}</Text>
          </Col>
        </Row>
      </StatsCard>

      <StatsCard>
        <Title level={5}>
          <FormattedMessage id="sideMenu.storageStats.fileTypes" defaultMessage="文件类型分布" />
        </Title>
        {stats.fileTypeStats.map((type: any) => (
          <TypeRow key={type.fileType} align="middle">
            <Col span={24}>
              <TypeInfo>
                <TypeIcon color={getTypeColor(type.fileType)}>
                  {getTypeIcon(type.fileType)}
                </TypeIcon>
                <div style={{ flex: 1 }}>
                  <Row justify="space-between">
                    <Col>
                      <Text strong>{type.typeDescription}</Text>
                    </Col>
                    <Col>
                      <Text type="secondary">
                        {type.fileCount} 个文件 ({formatFileSize(type.storageSize)})
                      </Text>
                    </Col>
                  </Row>
                  <ProgressWrapper>
                    <Progress
                      percent={Number(type.sizePercentage.toFixed(1))}
                      strokeColor={getTypeColor(type.fileType)}
                      showInfo={false}
                      size="small"
                    />
                  </ProgressWrapper>
                </div>
              </TypeInfo>
            </Col>
          </TypeRow>
        ))}
      </StatsCard>
    </>
  );

  const renderProvidersTab = () => {
    // 对服务提供商列表进行排序，默认的放在最前面
    const sortedProviders = [...providers].sort((a, b) => {
      if (a.isDefault === b.isDefault) return 0;
      return a.isDefault ? -1 : 1;
    });

    // 对地域列表进行排序，用户开通的默认地域放在最前面
    const sortedRegions = [...regions].sort((a, b) => {
      const nodeA = userNodes.find(node => node.nodeRegion === a.regionCode);
      const nodeB = userNodes.find(node => node.nodeRegion === b.regionCode);
      
      // 首先按是否开通排序
      const isActiveA = Boolean(nodeA);
      const isActiveB = Boolean(nodeB);
      if (isActiveA !== isActiveB) return isActiveB ? 1 : -1;
      
      // 如果都开通了，按是否默认排序
      if (isActiveA && isActiveB) {
        if (nodeA.isDefault !== nodeB.isDefault) {
          return nodeA.isDefault ? -1 : 1;
        }
      }
      
      // 其他情况保持原有顺序
      return 0;
    });

    return (
      <TabContent>
        <ProviderMenu
          selectedKeys={selectedProvider ? [selectedProvider.toString()] : []}
          items={sortedProviders.map(provider => ({
            key: provider.id.toString(),
            icon: provider.iconImg ? (
              <ProviderIcon src={provider.iconImg} alt={provider.providerName} />
            ) : (
              <CloudOutlined />
            ),
            label: (
              <span>
                {provider.providerName}
                {provider.isDefault && (
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    <FormattedMessage id="common.default" defaultMessage="默认" />
                  </Tag>
                )}
              </span>
            ),
          }))}
          onClick={({ key }) => setSelectedProvider(Number(key))}
        />
        <ContentArea>
          {loadingRegions ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <RegionGrid>
              {sortedRegions.map(region => {
                const active = isRegionActive(region.regionCode);
                const nodeInfo = userNodes.find(node => node.nodeRegion === region.regionCode);
                
                return (
                  <RegionCard
                    key={region.regionCode}
                    className={active ? 'active' : ''}
                    size="small"
                    title={
                      <Tooltip title={region.regionCode}>
                        <span>
                          {region.regionName}
                          {active && (
                            <CheckCircleFilled
                              style={{
                                color: '#52c41a',
                                marginLeft: 8,
                              }}
                            />
                          )}
                          {nodeInfo?.isDefault && (
                            <Tag color="gold" style={{ marginLeft: 8 }}>
                              <FormattedMessage id="common.default" defaultMessage="默认" />
                            </Tag>
                          )}
                        </span>
                      </Tooltip>
                    }
                  >
                    <Text type="secondary">
                      <FormattedMessage id="common.regionCode" defaultMessage="地域代码" />: {region.regionCode}
                    </Text>
                    
                    {active && nodeInfo && (
                      <div className="storage-info">
                        <div className="storage-item">
                          <Text type="secondary">
                            <FormattedMessage id="common.nodeType" defaultMessage="节点类型" />
                          </Text>
                          <Tag color={nodeInfo.nodeType === 'STANDARD' ? 'blue' : 'purple'}>
                            {nodeInfo.nodeType}
                          </Tag>
                        </div>
                        
                        <div className="storage-item">
                          <Text type="secondary">
                            <FormattedMessage id="common.storageUsed" defaultMessage="已用空间" />
                          </Text>
                          <Text>{formatFileSize(nodeInfo.storageUsed)}</Text>
                        </div>
                        
                        <div className="storage-item">
                          <Text type="secondary">
                            <FormattedMessage id="common.storageAvailable" defaultMessage="可用空间" />
                          </Text>
                          <Text>{formatFileSize(nodeInfo.storageAvailable)}</Text>
                        </div>
                        
                        <div className="storage-item">
                          <Text type="secondary">
                            <FormattedMessage id="common.storageLimit" defaultMessage="总容量" />
                          </Text>
                          <Text>{formatFileSize(nodeInfo.storageLimit)}</Text>
                        </div>
                        
                        <Progress
                          percent={Number(nodeInfo.usagePercentage.toFixed(1))}
                          size="small"
                          status={nodeInfo.usagePercentage >= 90 ? 'exception' : 'normal'}
                          format={percent => (
                            <Tooltip title={
                              <FormattedMessage 
                                id="common.storageUsageDetail" 
                                defaultMessage="已用 {used} / 总容量 {total}"
                                values={{
                                  used: formatFileSize(nodeInfo.storageUsed),
                                  total: formatFileSize(nodeInfo.storageLimit)
                                }}
                              />
                            }>
                              {`${percent}%`}
                            </Tooltip>
                          )}
                        />
                        
                        {nodeInfo.isDefault && (
                          <div style={{ marginTop: 8 }}>
                            <Tag color="gold">
                              <FormattedMessage id="common.defaultNode" defaultMessage="默认节点" />
                            </Tag>
                          </div>
                        )}
                      </div>
                    )}
                  </RegionCard>
                );
              })}
            </RegionGrid>
          )}
        </ContentArea>
      </TabContent>
    );
  };

  return (
    <StyledModal
      title={<FormattedMessage id="sideMenu.storageStats.title" defaultMessage="存储空间统计" />}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={<FormattedMessage id="sideMenu.storageStats.overview" defaultMessage="总览" />}
          key="overview"
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
            </div>
          ) : stats ? (
            renderOverviewTab()
          ) : null}
        </TabPane>
        <TabPane
          tab={<FormattedMessage id="sideMenu.storageStats.providers" defaultMessage="服务提供商" />}
          key="providers"
        >
          {renderProvidersTab()}
        </TabPane>
      </Tabs>
    </StyledModal>
  );
};

export default StorageStatsModal; 