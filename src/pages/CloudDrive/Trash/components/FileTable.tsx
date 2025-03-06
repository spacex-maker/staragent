import React from 'react';
import { Table, Space, Button } from 'antd';
import { UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import type { ColumnsType } from 'antd/es/table';
import { formatFileSize } from 'utils/format';
import FileItem from '../../AllFiles/components/FileItem';
import { TableWrapper } from './styles';
import type { FileModel } from 'models/file/FileModel';

interface FileTableProps {
  loading: boolean;
  files: FileModel[];
  selectedRowKeys: React.Key[];
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
  onSelectChange: (selectedRowKeys: React.Key[]) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onRestore: (file: FileModel) => void;
  onDelete: (file: FileModel) => void;
}

const FileTable: React.FC<FileTableProps> = ({
  loading,
  files,
  selectedRowKeys,
  pagination,
  onSelectChange,
  onPageChange,
  onRestore,
  onDelete
}) => {
  const columns: ColumnsType<FileModel> = [
    {
      title: <FormattedMessage id="filelist.column.name" />,
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '50%',
      render: (_, record: FileModel) => (
        <FileItem file={record} />
      ),
    },
    {
      title: <FormattedMessage id="filelist.column.size" />,
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: <FormattedMessage id="filelist.column.actions" />,
      key: 'actions',
      width: 120,
      render: (_, record: FileModel) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<UndoOutlined />}
            size="small"
            onClick={() => onRestore(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <TableWrapper>
      <Table<FileModel>
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        columns={columns}
        dataSource={files}
        rowKey="id"
        loading={loading}
        rowClassName={(record) => record.isDirectory ? 'folder-row' : ''}
        locale={{
          emptyText: '回收站为空'
        }}
        pagination={{
          current: pagination.currentPage,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: onPageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 项`
        }}
      />
    </TableWrapper>
  );
};

export default FileTable; 