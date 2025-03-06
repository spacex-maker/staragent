import React from 'react';
import { Space, Progress, Typography, theme } from 'antd';
import { formatFileSize, formatSpeed, formatTime } from '../../../utils/format';
import { TotalProgressText } from './styles';

const { Text } = Typography;

interface UploadProgressProps {
  progress: number;
  speed: number;
  remainingTime: number;
  uploadedSize: number;
  totalSize: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  speed,
  remainingTime,
  uploadedSize,
  totalSize
}) => {
  const { token } = theme.useToken();

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Space>
          <Text>总进度</Text>
          <Text style={{ color: token.colorPrimary }}>{progress}%</Text>
        </Space>
        <Space>
          <Text type="secondary">速度：{formatSpeed(speed)}</Text>
          <Text type="secondary">剩余时间：{formatTime(remainingTime)}</Text>
        </Space>
      </div>
      <Progress 
        percent={progress} 
        status={progress === 100 ? 'success' : 'active'} 
        strokeColor={{
          '0%': token.colorPrimary,
          '100%': token.colorSuccess,
        }}
      />
      <TotalProgressText>
        已上传：<span className="uploaded">{formatFileSize(uploadedSize)}</span>
        <span className="total"> / {formatFileSize(totalSize)}</span>
      </TotalProgressText>
    </div>
  );
};

export default UploadProgress; 