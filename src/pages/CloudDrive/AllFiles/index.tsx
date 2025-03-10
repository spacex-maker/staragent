import React, { useState, useEffect } from 'react';
import { Layout, Upload, Space, Grid } from 'antd';
import {
  FolderOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  ReloadOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import FileList from './components/FileList';
import PathHistory from '../components/PathHistory';
import { fetchRootDirectory, loadFiles } from 'services/fileService';
import { 
  getUserStorageNodes,
  updateUserStorageNode
} from 'services/storageService';
import type { UserStorageNode } from 'services/storageService';
import FileUploadModal from 'components/modals/FileUploadModal';
import FileEncryptModal from 'components/modals/FileEncryptModal';
import DownloadManager from 'components/modals/DownloadManager';
import NodeSelectModal from '../components/NodeSelectModal';
import { ActionBar, RoundedButton, RoundedSearch } from '../components/styles/StyledComponents';
import { FormattedMessage, useIntl } from 'react-intl';
import { FileProvider } from 'contexts/FileContext';

// Import custom hooks
import { useUpload } from '../hooks/useUpload';
import { useFileOperations } from '../hooks/useFileOperations';
import { useFolderOperations } from '../hooks/useFolderOperations';
import { useSearch } from '../hooks/useSearch';
import { useDownload } from '../hooks/useDownload';

const { Content } = Layout;

interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
}

interface UserInfo {
  username: string;
  [key: string]: any;
}

interface EncryptedFile extends File {
  name: string;
  size: number;
  type: string;
}

interface FileEncryptModalProps {
  visible: boolean;
  files: File[];
  [key: string]: any;
}

const AllFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [currentParentId, setCurrentParentId] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<any>(null);
  const [fileUploadModalVisible, setFileUploadModalVisible] = useState(false);
  const [fileEncryptModalProps, setFileEncryptModalProps] = useState<FileEncryptModalProps | null>(null);
  const [rootDirectoryId, setRootDirectoryId] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    total: 0
  });
  const screens = Grid.useBreakpoint();
  const intl = useIntl();
  const [nodeSelectModalVisible, setNodeSelectModalVisible] = useState(false);
  const [userNodes, setUserNodes] = useState<UserStorageNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  // Initialize custom hooks
  const { searchText, filteredFiles, setFilteredFiles, handleSearch, setSearchText } = useSearch(files);
  
  const { 
    uploadStates,
    setUploadStates,
    handleUpload,
    uploadFiles,
    handleDuplicateDecision,
    handleRemoveFiles,
    handleAddFiles,
    handleEncryptFiles,
    handlePauseUpload,
    handleResumeUpload
  } = useUpload(
    currentParentId, 
    userInfo,
    currentPath,
    currentFolder,
    pagination, 
    setPagination,
    setLoading,
    setFiles,
    setFilteredFiles,
    setSearchText,
    selectedNodeId
  );

  const {
    selectedRowKeys,
    previewImage,
    handleDelete,
    handleBatchDelete,
    handlePreview,
    handlePreviewClose,
    handleSelectChange
  } = useFileOperations(
    currentParentId, 
    pagination, 
    setPagination,
    setFiles,
    setFilteredFiles,
    setSearchText,
    setLoading
  );

  const {
    newFolderModalVisible,
    setNewFolderModalVisible,
    newFolderName,
    setNewFolderName,
    pathHistory,
    handleCreateFolder,
    handleFolderClick,
    handlePathClick,
    handleHomeClick
  } = useFolderOperations(
    currentParentId,
    userInfo,
    currentPath,
    pagination,
    setPagination,
    setFiles,
    setFilteredFiles,
    setSearchText,
    setLoading,
    setCurrentParentId,
    setCurrentFolder
  );

  const {
    downloadTasks,
    setDownloadManagerVisible,
    startDownload,
    handleCancelDownload,
    handleClearDownloads,
    handleBatchDownload
  } = useDownload();

  // 获取用户信息和节点信息
  useEffect(() => {
    const init = async () => {
      try {
        // 1. 获取用户信息
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }

        // 2. 获取用户节点信息
        const response = await getUserStorageNodes();
        if (response.success && response.data) {
          setUserNodes(response.data);
          // 设置默认节点
          const defaultNode = response.data.find(node => node.isDefault);
          const nodeId = defaultNode ? defaultNode.id : response.data[0]?.id;
          
          if (nodeId) {
            setSelectedNodeId(nodeId);
            // 3. 获取根目录和文件列表
            await fetchRootDirectory(
              setLoading,
              setRootDirectoryId,
              setCurrentParentId,
              setFiles,
              setFilteredFiles,
              setSearchText,
              setPagination,
              pagination,
              nodeId
            );
          } else {
            message.warning('没有可用的存储节点');
          }
        }
      } catch (error) {
        console.error('初始化失败:', error);
        message.error('初始化失败，请刷新页面重试');
      }
    };

    init();
  }, []);

  // 修改 loadFiles 调用，添加 nodeId 参数
  const handleLoadFiles = (parentId: number) => {
    loadFiles(
      parentId,
      { setLoading, setFiles, setFilteredFiles, setSearchText, setPagination, pagination },
      selectedNodeId
    );
  };

  // 处理节点选择
  const handleNodeSelect = (nodeId: number) => {
    setSelectedNodeId(nodeId);
    setNodeSelectModalVisible(false);
    // 重新加载当前目录的文件
    handleLoadFiles(currentParentId);
  };

  // 修改 handlePageChange
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page,
      pageSize: pageSize
    }));
    
    loadFiles(
      currentParentId,
      { setLoading, setFiles, setFilteredFiles, setSearchText, setPagination, pagination: { currentPage: page, pageSize: pageSize } },
      selectedNodeId
    );
  };

  const handleDownloadCollapse = (collapsed: boolean) => {
    setDownloadManagerVisible(!collapsed);
  };

  const handleCloseUploadModal = () => {
    if (!uploadStates.isUploading) {
      setFileUploadModalVisible(false);
    }
  };


  const handleEncryptComplete = (encryptedFiles: EncryptedFile[], originalFiles: File[]) => {
    const newFiles = new Map();
    
    Array.from(uploadStates.files.entries()).forEach(([key, value]) => {
      if (!originalFiles.find((f: File) => f.name === key)) {
        newFiles.set(key, value);
      }
    });
    
    encryptedFiles.forEach((encryptedFile: EncryptedFile) => {
      newFiles.set(encryptedFile.name, {
        file: encryptedFile,
        name: encryptedFile.name,
        fileSize: encryptedFile.size,
        status: 'pending',
        progress: 0,
        isDuplicate: false,
        action: 'upload',
        isEncrypted: true
      });
    });
    
    setUploadStates(prev => ({
      ...prev,
      files: newFiles
    }));
    
    setFileEncryptModalProps(null);
    message.success('文件加密成功');
  };

  // 处理节点更新
  const handleNodeUpdate = async (nodeId: number, values: { nodeName: string }) => {
    try {
      const response = await updateUserStorageNode(nodeId, values);
      if (response.success) {
        message.success('节点信息更新成功');
        // 重新获取节点列表
        const nodesResponse = await getUserStorageNodes();
        if (nodesResponse.success && nodesResponse.data) {
          setUserNodes(nodesResponse.data);
        }
        return true;
      } else {
        message.error(response.message || '更新失败');
        return false;
      }
    } catch (error) {
      console.error('更新节点信息失败:', error);
      message.error('更新节点信息失败');
      return false;
    }
  };

  return (
    <Content style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      padding: '10px 10px 0 10px'
    }}>
      <FileProvider initialParentId={rootDirectoryId || 0}>
        <ActionBar>
          <Space size={screens.md ? 8 : 4} className="flex-nowrap">
            <RoundedButton
              icon={<SwapOutlined />}
              onClick={() => setNodeSelectModalVisible(true)}
              disabled={!userNodes.length}
            >
              <span className="action-button-text">
                <FormattedMessage id="filelist.action.switchNode" defaultMessage="切换节点" />
              </span>
            </RoundedButton>
            <Upload
              multiple
              showUploadList={false}
              beforeUpload={(file, fileList) => {
                if (!selectedNodeId) {
                  message.warning('请先选择存储节点');
                  return false;
                }
                if (!file || !fileList || fileList.length === 0) {
                  return false;
                }
                const validFiles = fileList.filter(f => f && f.name && f.size);
                if (validFiles.length === 0) {
                  message.warning('没有有效的文件可上传');
                  return false;
                }
                handleUpload(validFiles, files);
                setFileUploadModalVisible(true);
                return false;
              }}
              disabled={uploadStates.isUploading || !selectedNodeId}
            >
              <RoundedButton
                type="primary"
                icon={<CloudUploadOutlined />}
                loading={uploadStates.isUploading}
                disabled={!selectedNodeId}
              >
                <span className="action-button-text">
                  <FormattedMessage id="filelist.action.upload" />
                </span>
              </RoundedButton>
            </Upload>
            <RoundedButton
              icon={<FolderOutlined />}
              onClick={() => setNewFolderModalVisible(true)}
              disabled={!selectedNodeId}
            >
              <span className="action-button-text">
                <FormattedMessage id="filelist.action.newFolder" />
              </span>
            </RoundedButton>
            <RoundedButton
              icon={<ReloadOutlined />}
              onClick={() => handleLoadFiles(currentParentId)}
              loading={loading}
              disabled={!selectedNodeId}
            >
              <span className="action-button-text">
                <FormattedMessage id="filelist.action.refresh" />
              </span>
            </RoundedButton>
          </Space>
          <RoundedSearch
            placeholder={intl.formatMessage({ id: 'filelist.action.search' })}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => handleSearch(e.target.value)}
            allowClear
          />
        </ActionBar>

        <div className="px-4 py-2 border-b">
          <PathHistory
            pathHistory={pathHistory}
            onHomeClick={() => handleHomeClick(rootDirectoryId)}
            onPathClick={handlePathClick}
          />
        </div>

        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <FileList
            loading={loading}
            filteredFiles={filteredFiles}
            searchText={searchText}
            handleFolderClick={handleFolderClick}
            handlePreview={handlePreview}
            handleDelete={handleDelete}
            handleBatchDelete={handleBatchDelete}
            handleBatchDownload={handleBatchDownload}
            selectedRowKeys={selectedRowKeys}
            onSelectChange={handleSelectChange}
            onDownload={startDownload}
            pagination={pagination}
            onPageChange={handlePageChange}
            newFolderModalVisible={newFolderModalVisible}
            setNewFolderModalVisible={setNewFolderModalVisible}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            handleCreateFolder={handleCreateFolder}
            previewImage={previewImage}
            handlePreviewClose={handlePreviewClose}
            currentParentId={currentParentId}
            setLoading={setLoading}
            setFiles={setFiles}
            setFilteredFiles={setFilteredFiles}
            setSearchText={setSearchText}
            setPagination={setPagination}
          />
        </div>

        <FileUploadModal
          visible={fileUploadModalVisible}
          uploadingFiles={uploadStates.files}
          isUploading={uploadStates.isUploading}
          onStartUpload={uploadFiles}
          onCancel={handleCloseUploadModal}
          onDuplicateDecision={handleDuplicateDecision}
          onRemoveFiles={handleRemoveFiles}
          onAddFiles={handleAddFiles}
          onEncryptFiles={handleEncryptFiles}
          onEncryptComplete={handleEncryptComplete}
          existingFiles={files}
          onPauseUpload={handlePauseUpload}
          onResumeUpload={handleResumeUpload}
          setUploadStates={setUploadStates}
          onUploadComplete={() => {
            handleLoadFiles(currentParentId);
          }}
        />

        {fileEncryptModalProps && (
          <FileEncryptModal {...fileEncryptModalProps} />
        )}

        <DownloadManager
          downloads={downloadTasks}
          onCancel={handleCancelDownload}
          onClear={handleClearDownloads}
          onCollapse={handleDownloadCollapse}
        />

        <NodeSelectModal
          open={nodeSelectModalVisible}
          onClose={() => setNodeSelectModalVisible(false)}
          nodes={userNodes}
          selectedNodeId={selectedNodeId}
          onNodeSelect={handleNodeSelect}
          onNodeUpdate={handleNodeUpdate}
        />
      </FileProvider>
    </Content>
  );
};

export default AllFiles; 