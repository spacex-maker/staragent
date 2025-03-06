import React from 'react';
import { Space, Progress, Tooltip, Typography, theme } from 'antd';
import { LockOutlined, WarningFilled, CloudUploadOutlined } from '@ant-design/icons';
import { getFileIcon } from '../../../utils/fileIcon';
import { formatFileSize, formatSpeed } from '../../../utils/format';
import { FileName, FileSize, ProgressText, DuplicateTag, ChunkUploadTag } from './styles';

const { Text } = Typography;

interface UploadFile {
  file: File;
  name: string;
  fileSize: number;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'paused' | 'creating' | 'skipped';
  progress?: number;
  speed?: number;
  isDuplicate?: boolean;
  isEncrypted?: boolean;
  useChunkUpload?: boolean;
}

interface FileNameCellProps {
  record: UploadFile;
}

const FileNameCell: React.FC<FileNameCellProps> = ({ record }) => {
  const { token } = theme.useToken();
  const { 
    name,
    file,
    fileSize,
    status,
    progress,
    speed,
    isDuplicate,
    isEncrypted,
    useChunkUpload 
  } = record;

  return (
    <FileName>
      <div className="file-header">
        {getFileIcon(file?.name || name)}
        <Tooltip title={file?.name || name}>
          <Text className="name" ellipsis>{name}</Text>
        </Tooltip>
        {isDuplicate && (
          <DuplicateTag>
            <WarningFilled />
            重复文件
          </DuplicateTag>
        )}
        {isEncrypted && (
          <DuplicateTag style={{ color: token.colorSuccess }}>
            <LockOutlined />
            已加密
          </DuplicateTag>
        )}
        {useChunkUpload && (
          <ChunkUploadTag>
            <CloudUploadOutlined />
            分片上传
          </ChunkUploadTag>
        )}
      </div>
      <div className="file-info">
        {(status === 'uploading' || status === 'creating') ? (
          <Space direction="vertical" size={1} style={{ flex: 1 }}>
            <Progress 
              percent={progress || 0} 
              size="small" 
              status={'active'}
              style={{ margin: 0, lineHeight: 1 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ProgressText>
                <span className="uploaded">{formatFileSize(fileSize * (progress || 0) / 100)}</span>
                <span className="total"> / {formatFileSize(fileSize)}</span>
              </ProgressText>
              {speed && speed > 0 && (
                <span className="speed" style={{ fontSize: '12px', color: 'var(--ant-color-text-secondary)' }}>
                  {formatSpeed(speed)}
                </span>
              )}
            </div>
          </Space>
        ) : (
          <FileSize>{formatFileSize(fileSize)}</FileSize>
        )}
      </div>
    </FileName>
  );
};

export default FileNameCell; 