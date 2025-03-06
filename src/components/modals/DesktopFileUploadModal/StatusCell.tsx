import React from 'react';
import { Space, Typography } from 'antd';
import { getStatusIcon, getStatusText } from '../../../utils/uploadStatus';

const { Text } = Typography;

interface StatusCellProps {
  status: string;
  isDuplicate?: boolean;
}

const StatusCell: React.FC<StatusCellProps> = ({ status, isDuplicate }) => {
  return (
    <Space>
      {getStatusIcon(status)}
      <Text type={
        status === 'success' ? 'success' :
        status === 'error' ? 'danger' :
        'secondary'
      }>
        {getStatusText(status, isDuplicate || false)}
      </Text>
    </Space>
  );
};

export default StatusCell; 