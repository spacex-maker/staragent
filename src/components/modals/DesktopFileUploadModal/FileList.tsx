import React from 'react';
import { Table, Space, Tooltip, Typography, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { AlignType } from 'rc-table/lib/interface';
import { DeleteOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import FileNameCell from './FileNameCell';
import StatusCell from './StatusCell';

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
  taskId?: string;
  errorMessage?: string;
}

interface FileListProps {
  files: UploadFile[];
  selectedRowKeys: React.Key[];
  onSelectionChange: (selectedRowKeys: React.Key[], selectedRows: UploadFile[]) => void;
  onRemoveFile: (fileName: string) => void;
  onPauseUpload: (taskId: string) => void;
  onResumeUpload: (taskId: string) => void;
  isUploading: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  selectedRowKeys,
  onSelectionChange,
  onRemoveFile,
  onPauseUpload,
  onResumeUpload,
  isUploading
}) => {
  const { token } = theme.useToken();

  const columns: ColumnsType<UploadFile> = [
    {
      title: <FormattedMessage id="modal.fileUpload.table.filename" />,
      dataIndex: 'name',
      key: 'name',
      align: 'left' as AlignType,
      width: '70%',
      ellipsis: true,
      render: (text: string, record: UploadFile) => (
        <FileNameCell record={record} />
      ),
    },
    {
      title: <FormattedMessage id="modal.fileUpload.table.status" />,
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center' as AlignType,
      render: (_: any, record: UploadFile) => (
        <StatusCell status={record.status} isDuplicate={record.isDuplicate} />
      ),
    },
    {
      title: <FormattedMessage id="modal.fileUpload.table.actions" />,
      key: 'actions',
      width: 100,
      align: 'center' as AlignType,
      fixed: 'right' as const,
      render: (_: any, record: UploadFile) => {
        if (record.status === 'pending') {
          return (
            <Space>
              <Tooltip title="移除">
                <DeleteOutlined
                  style={{ color: '#ff4d4f', cursor: 'pointer' }}
                  onClick={() => onRemoveFile(record.file.name)}
                />
              </Tooltip>
            </Space>
          );
        }
        if (record.status === 'uploading') {
          return (
            <Space>
              <Tooltip title="暂停">
                <PauseCircleOutlined
                  style={{ color: token.colorPrimary, cursor: 'pointer' }}
                  onClick={() => record.taskId && onPauseUpload(record.taskId)}
                />
              </Tooltip>
            </Space>
          );
        }
        if (record.status === 'paused') {
          return (
            <Space>
              <Tooltip title="继续">
                <PlayCircleOutlined
                  style={{ color: token.colorSuccess, cursor: 'pointer' }}
                  onClick={() => record.taskId && onResumeUpload(record.taskId)}
                />
              </Tooltip>
            </Space>
          );
        }
        if (record.status === 'error') {
          return (
            <Tooltip title={record.errorMessage || '上传失败'}>
              <Text type="danger">失败</Text>
            </Tooltip>
          );
        }
        return null;
      },
    },
  ];

  const rowSelection: TableRowSelection<UploadFile> = {
    selectedRowKeys,
    onChange: onSelectionChange,
    getCheckboxProps: (record: UploadFile) => ({
      disabled: record.status !== 'pending',
    }),
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={files.map(file => ({
        ...file,
        key: file.file.name,
      }))}
      pagination={false}
      size="small"
      scroll={{ y: 350, x: 'max-content' }}
      locale={{
        emptyText: '没有选择文件'
      }}
      style={{ 
        width: '100%',
        overflowX: 'auto'
      }}
    />
  );
};

export default FileList; 