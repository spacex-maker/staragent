import React, { useRef, useEffect, useState } from 'react';
import { Space, Progress, Tooltip, Typography, theme } from 'antd';
import { LockOutlined, WarningFilled, CloudUploadOutlined } from '@ant-design/icons';
import { getFileIcon } from '../../../utils/fileIcon';
import { formatFileSize, formatSpeed, getDynamicEllipsisFileName } from '../../../utils/format';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayName, setDisplayName] = useState(record.name);
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

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      const containerWidth = entries[0].contentRect.width;
      // 计算实际可用宽度：
      // - 文件图标宽度 (24px)
      // - 图标右边距 (8px)
      // - 标签容器预留宽度 (根据实际标签数量动态计算)
      // - 安全边距 (16px)
      const tagCount = [isDuplicate, isEncrypted, useChunkUpload].filter(Boolean).length;
      const tagsWidth = tagCount > 0 ? (tagCount * 85) : 0; // 每个标签约85px宽
      const availableWidth = Math.max(200, containerWidth - 48 - tagsWidth);
      
      if (!name) return;
      
      const truncatedName = getDynamicEllipsisFileName(name, availableWidth, {
        font: containerRef.current ? window.getComputedStyle(containerRef.current).font : 
              '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        minFrontChars: 12,    // 增加最小保留前缀字符数
        minEndChars: 8,      // 增加最小保留后缀字符数
        ellipsisWidth: 16,   // 调整省略号宽度
        keepExt: true
      });
      
      setDisplayName(truncatedName);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [name, isDuplicate, isEncrypted, useChunkUpload]); // 添加依赖项

  return (
    <FileName>
      <div className="file-header" ref={containerRef}>
        {getFileIcon(file?.name || name)}
        <Tooltip title={file?.name || name} placement="topLeft">
          <Text
            className="name"
            style={{ margin: '0 8px' }}
          >
            {displayName}
          </Text>
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