import React, { useEffect, useState } from 'react';
import { Modal, Typography, Progress, Spin, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { getStorageStats } from 'services/storageService';
import { formatFileSize } from 'utils/format';
import {
  FileImageOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface StorageStatsModalProps {
  open: boolean;
  onClose: () => void;
}

const StatsCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  margin-bottom: 16px;
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (open) {
      fetchStats();
    }
  }, [open]);

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

  return (
    <Modal
      title={<FormattedMessage id="sideMenu.storageStats.title" defaultMessage="存储空间统计" />}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : stats ? (
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
      ) : null}
    </Modal>
  );
};

export default StorageStatsModal; 