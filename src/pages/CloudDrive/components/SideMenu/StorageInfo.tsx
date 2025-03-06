import React, { useEffect, useState } from 'react';
import { Progress, Typography, Tooltip } from 'antd';
import type { ProgressProps } from 'antd';
import { CloudOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getStorageInfo } from 'services/storageService';
import { FormattedMessage } from 'react-intl';
import StorageStatsModal from './StorageStatsModal';

const { Text } = Typography;

const StorageContainer = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.06)'};
`;

const StorageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
  
  .anticon {
    font-size: 16px;
    color: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.85)'
      : 'rgba(0, 0, 0, 0.85)'};
  }
`;

const StorageTitle = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  flex: 1;
`;

const InfoIcon = styled(InfoCircleOutlined)`
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.95)'
      : 'rgba(0, 0, 0, 0.95)'};
  }
`;

const StorageDetails = styled.div`
  margin-top: 8px;
  
  .storage-text {
    font-size: 12px;
    color: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.45)'
      : 'rgba(0, 0, 0, 0.45)'};
  }
`;

const formatStorage = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const StorageInfo: React.FC = () => {
  const [storageData, setStorageData] = useState<{
    used: number;
    total: number;
    percentage: number;
  }>({
    used: 0,
    total: 0,
    percentage: 0
  });

  const [loading, setLoading] = useState(true);
  const [statsModalVisible, setStatsModalVisible] = useState(false);

  useEffect(() => {
    const fetchStorageInfo = async () => {
      try {
        const response = await getStorageInfo();
        if (response.success && response.data) {
          setStorageData({
            used: response.data.storageUsed,
            total: response.data.storageLimit,
            percentage: response.data.usagePercentage
          });
        }
      } catch (error) {
        console.error('获取存储信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStorageInfo();
  }, []);

  const getProgressStatus = (percentage: number): "success" | "normal" | "exception" => {
    if (percentage >= 90) return 'exception';
    if (percentage >= 70) return 'normal';
    return 'success';
  };

  const getStrokeColor = (percentage: number): string => {
    if (percentage >= 90) return '#ff4d4f';
    if (percentage >= 70) return '#faad14';
    return '#52c41a';
  };

  return (
    <StorageContainer>
      <StorageHeader>
        <CloudOutlined />
        <StorageTitle>
          <FormattedMessage id="sideMenu.storageInfo.title" defaultMessage="存储空间" />
        </StorageTitle>
        <InfoIcon onClick={() => setStatsModalVisible(true)} />
      </StorageHeader>
      
      <Tooltip title={`${formatStorage(storageData.used)} / ${formatStorage(storageData.total)}`}>
        <Progress
          percent={storageData.percentage}
          size="small"
          status={getProgressStatus(storageData.percentage)}
          showInfo={false}
          strokeColor={getStrokeColor(storageData.percentage)}
        />
      </Tooltip>
      
      <StorageDetails>
        <div className="storage-text">
          <FormattedMessage
            id="sideMenu.storageInfo.usage"
            defaultMessage="已使用 {used} / 共 {total}"
            values={{
              used: formatStorage(storageData.used),
              total: formatStorage(storageData.total)
            }}
          />
        </div>
      </StorageDetails>

      <StorageStatsModal
        open={statsModalVisible}
        onClose={() => setStatsModalVisible(false)}
      />
    </StorageContainer>
  );
};

export default StorageInfo; 