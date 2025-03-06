import React from 'react';
import { Space, Button } from 'antd';
import { 
  LockOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';

interface ActionButtonsProps {
  isUploading: boolean;
  selectedCount: number;
  onEncrypt: () => void;
  onClear: () => void;
  onMarkChunkUpload: () => void;
  onCancel: () => void;
  onStartUpload: () => void;
  canStartUpload: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isUploading,
  selectedCount,
  onEncrypt,
  onClear,
  onMarkChunkUpload,
  onCancel,
  onStartUpload,
  canStartUpload
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      gap: '8px'
    }}>
      <Space size="middle">
        <Button 
          icon={<LockOutlined />}
          onClick={onEncrypt} 
          disabled={isUploading || selectedCount === 0}
        >
          <FormattedMessage id="modal.fileUpload.encrypt" />
        </Button>
        <Button 
          onClick={onClear} 
          disabled={isUploading}
        >
          <FormattedMessage id="modal.fileUpload.clear" />
        </Button>
        <Button
          icon={<CloudUploadOutlined />}
          onClick={onMarkChunkUpload}
          disabled={isUploading || selectedCount === 0}
        >
          <FormattedMessage id="modal.fileUpload.markChunkUpload" defaultMessage="分片上传" />
        </Button>
      </Space>
      <Space size="middle">
        <Button 
          onClick={onCancel}
          disabled={isUploading}
        >
          <FormattedMessage id="modal.fileUpload.cancel" />
        </Button>
        <Button
          type="primary"
          onClick={onStartUpload}
          disabled={!canStartUpload}
        >
          <FormattedMessage id="modal.fileUpload.start" />
        </Button>
      </Space>
    </div>
  );
};

export default ActionButtons; 