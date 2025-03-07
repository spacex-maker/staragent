import { useMemo } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { FormattedMessage } from 'react-intl';
import { FileModel } from 'models/file/FileModel';
import { formatFileSize } from 'utils/format';
import FileItem from '../FileItem';
import FileActions from '../FileActions';
import FileSize from '../FileSize';
import { Grid } from 'antd';

interface FileHandlers {
  onFolderClick: (record: FileModel) => void;
  onPreview: (record: FileModel) => void;
  onDelete: (record: FileModel) => void;
  onDownload: (record: FileModel) => void;
}

interface UseColumnsProps {
  handlers: FileHandlers;
  deletingIds: React.Key[];
  currentParentId: number;
  setLoading: (loading: boolean) => void;
  setFiles: (files: FileModel[]) => void;
  setFilteredFiles: (files: FileModel[]) => void;
  setSearchText: (text: string) => void;
  setPagination: (pagination: any) => void;
  pagination: any;
}

export const useColumns = ({
  handlers,
  deletingIds,
}: UseColumnsProps) => {
  const screens = Grid.useBreakpoint();

  const columns: ColumnsType<FileModel> = useMemo(() => [
    {
      title: <FormattedMessage id="filelist.column.name" />,
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: screens.md ? '60%' : '50%',
      align: 'center',
      titleAlign: 'left',
      render: (_, record: FileModel) => (
        <FileItem
          file={record}
          onFolderClick={handlers.onFolderClick}
        />
      ),
    },
    {
      title: <FormattedMessage id="filelist.column.size" />,
      dataIndex: 'size',
      key: 'size',
      width: screens.md ? 100 : 90,
      align: 'center',
      render: (_, record: FileModel) => <FileSize file={record} />,
      sorter: (a: FileModel, b: FileModel) => {
        if (a.size == null) return -1;
        if (b.size == null) return 1;
        return Number(a.size) - Number(b.size);
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: <FormattedMessage id="filelist.column.updateTime" />,
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: screens.md ? 160 : 140,
      align: 'center',
    },
    {
      title: <FormattedMessage id="filelist.column.actions" />,
      key: 'actions',
      fixed: 'right',
      width: screens.md ? 90 : 80,
      align: 'center',
      render: (_, record: FileModel) => (
        <FileActions
          record={record}
          isDeleting={deletingIds.includes(record.id)}
          onDownload={handlers.onDownload}
          onDelete={handlers.onDelete}
          onPreview={handlers.onPreview}
        />
      ),
    },
  ], [handlers, deletingIds, screens]);

  return columns;
}; 