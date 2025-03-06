import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import instance from 'api/axios';
import { FileProvider } from 'contexts/FileContext';
import type { FileModel } from 'models/file/FileModel';
import ToolBar from './components/ToolBar';
import FileTable from './components/FileTable';

const { Content } = Layout;

interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
}

const Trash = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileModel[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    total: 0
  });

  // 统一的API调用处理函数
  const handleApiCall = async (apiCall: () => Promise<any>, successMessage?: string) => {
    try {
      setLoading(true);
      const response = await apiCall();
      
      if (response.data?.success) {
        successMessage && message.success(successMessage);
        return response.data;
      }
      throw new Error(response.data?.message);
    } catch (error: any) {
      message.error(error.message || '操作失败');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 加载文件列表
  const loadRecycledFiles = async (searchName?: string, page: number = 1, pageSize: number = 10) => {
    const result = await handleApiCall(
      () => instance.post('/productx/file-storage/list-recycled', {
        currentPage: page,
        pageSize,
        ...(searchName && { name: searchName })
      })
    );

    if (result) {
      const { data, total } = result.data;
      setFiles(Array.isArray(data) ? data : []);
      setPagination(prev => ({ ...prev, total: total || 0 }));
    }
  };

  useEffect(() => {
    loadRecycledFiles(searchText, pagination.currentPage, pagination.pageSize);
  }, [pagination.currentPage, pagination.pageSize]);

  // 统一的文件操作处理函数
  const handleFileOperation = async (
    fileIds: React.Key[],
    operation: 'restore' | 'delete',
    isBatch: boolean = false
  ) => {
    if (isBatch && fileIds.length === 0) {
      message.warning(`请选择要${operation === 'restore' ? '还原' : '删除'}的文件`);
      return;
    }

    const result = await handleApiCall(
      () => instance.post(`/productx/file-storage/${operation}`, fileIds),
      `${isBatch ? '批量' : ''}${operation === 'restore' ? '恢复' : '永久删除'}成功`
    );

    if (result) {
      isBatch && setSelectedRowKeys([]);
      loadRecycledFiles(searchText, pagination.currentPage, pagination.pageSize);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    loadRecycledFiles(value, 1, pagination.pageSize);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, currentPage: page, pageSize }));
  };

  return (
    <FileProvider initialParentId={0}>
      <Content style={{ padding: '24px' }}>
        <ToolBar
          loading={loading}
          searchText={searchText}
          selectedCount={selectedRowKeys.length}
          onSearch={handleSearch}
          onRefresh={() => loadRecycledFiles(searchText)}
          onBatchRestore={() => handleFileOperation(selectedRowKeys, 'restore', true)}
          onBatchDelete={() => handleFileOperation(selectedRowKeys, 'delete', true)}
        />

        <FileTable
          loading={loading}
          files={files}
          selectedRowKeys={selectedRowKeys}
          pagination={pagination}
          onSelectChange={setSelectedRowKeys}
          onPageChange={handlePageChange}
          onRestore={(file) => handleFileOperation([file.id], 'restore')}
          onDelete={(file) => handleFileOperation([file.id], 'delete')}
        />
      </Content>
    </FileProvider>
  );
};

export default Trash; 