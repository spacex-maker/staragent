import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import FileList from './FileList';
import UploadProgress from './UploadProgress';
import ActionButtons from './ActionButtons';
import FileEncryptModal from '../FileEncryptModal';

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

interface DesktopFileUploadModalProps {
  visible: boolean;
  uploadingFiles: Map<string, UploadFile>;
  isUploading: boolean;
  onStartUpload: () => void;
  onCancel: () => void;
  onDuplicateDecision: (fileName: string, action: string) => void;
  onRemoveFiles: (fileNames: string[]) => void;
  onAddFiles: (files: any[]) => void;
  onEncryptFiles: (files: any[], callback: (encryptedFiles: any[], originalFiles: any[]) => void) => void;
  onEncryptComplete: (encryptedFiles: any[], originalFiles: any[]) => void;
  existingFiles: any[];
  onPauseUpload: (taskId: string) => void;
  onResumeUpload: (taskId: string) => void;
  setUploadStates: React.Dispatch<React.SetStateAction<{
    files: Map<string, UploadFile>;
    isUploading: boolean;
  }>>;
}

const DesktopFileUploadModal: React.FC<DesktopFileUploadModalProps> = ({
  visible,
  uploadingFiles = new Map(),
  isUploading = false,
  onStartUpload,
  onCancel,
  onDuplicateDecision,
  onRemoveFiles = () => {
    console.warn('onRemoveFiles callback is not provided');
    message.warning('移除文件功能未实现');
  },
  onAddFiles = () => {
    console.warn('onAddFiles callback is not provided');
    message.warning('添加文件功能未实现');
  },
  onEncryptFiles = () => {
    console.warn('onEncryptFiles callback is not provided');
    message.warning('加密文件功能未实现');
  },
  onPauseUpload = () => {
    console.warn('onPauseUpload callback is not provided');
    message.warning('暂停上传功能未实现');
  },
  onResumeUpload = () => {
    console.warn('onResumeUpload callback is not provided');
    message.warning('恢复上传功能未实现');
  },
  onEncryptComplete,
  existingFiles = [],
  setUploadStates,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [encryptModalVisible, setEncryptModalVisible] = useState(false);
  const [selectedFilesToEncrypt, setSelectedFilesToEncrypt] = useState<File[]>([]);

  // 监听文件列表变化，设置全选状态
  useEffect(() => {
    if (uploadingFiles.size > 0) {
      const pendingFiles = Array.from(uploadingFiles.values())
        .filter(file => file.status === 'pending')
        .map(file => file.file.name);
      setSelectedRowKeys(pendingFiles);
    }
  }, [uploadingFiles]);

  // 统计不同类型的文件数量
  const fileStats = useMemo(() => {
    const total = uploadingFiles.size;
    const duplicates = Array.from(uploadingFiles.values()).filter(f => f.isDuplicate).length;
    const succeeded = Array.from(uploadingFiles.values()).filter(f => f.status === 'success').length;
    const failed = Array.from(uploadingFiles.values()).filter(f => f.status === 'error').length;
    const uploading = Array.from(uploadingFiles.values()).filter(f => f.status === 'uploading' || f.status === 'creating').length;
    const skipped = Array.from(uploadingFiles.values()).filter(f => f.status === 'skipped').length;
    const progress = total > 0 
      ? Math.round((succeeded + failed) / total * 100) 
      : 0;
      
    return {
      total,
      duplicates,
      succeeded,
      failed,
      uploading,
      skipped,
      progress
    };
  }, [uploadingFiles]);

  // 计算上传进度和速度信息
  const uploadStats = useMemo(() => {
    if (fileStats.total === 0 || !isUploading) {
      return {
        progress: 0,
        speed: 0,
        remainingTime: 0,
        totalSize: 0,
        uploadedSize: 0
      };
    }
    
    const validFiles = Array.from(uploadingFiles.values()).filter(
      file => file.status !== 'skipped' && file.status !== 'error'
    );
    
    if (validFiles.length === 0) return { progress: 0, speed: 0, remainingTime: 0, totalSize: 0, uploadedSize: 0 };
    
    let totalSize = 0;
    let uploadedSize = 0;
    let currentSpeed = 0;
    
    validFiles.forEach(file => {
      totalSize += file.fileSize;
      
      if (file.status === 'success') {
        uploadedSize += file.fileSize;
      } else if (file.status === 'uploading' || file.status === 'creating') {
        uploadedSize += (file.fileSize * (file.progress || 0)) / 100;
        if (file.speed) {
          currentSpeed += file.speed;
        }
      }
    });
    
    const progress = Math.round((uploadedSize / totalSize) * 100);
    const remainingSize = totalSize - uploadedSize;
    const remainingTime = currentSpeed > 0 ? remainingSize / currentSpeed : 0;
    
    return {
      progress,
      speed: currentSpeed,
      remainingTime,
      totalSize,
      uploadedSize
    };
  }, [uploadingFiles, isUploading, fileStats.total]);

  // 处理批量移除
  const handleBatchRemove = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要移除的文件');
      return;
    }
    if (typeof onRemoveFiles === 'function') {
      onRemoveFiles(selectedRowKeys.map(key => key.toString()));
      setSelectedRowKeys([]);
    }
  };

  // 处理单个文件移除
  const handleSingleRemove = (fileName: string) => {
    if (typeof onRemoveFiles === 'function') {
      onRemoveFiles([fileName]);
    }
  };

  // 处理加密文件
  const handleEncryptFiles = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要加密的文件');
      return;
    }

    const selectedFiles = Array.from(uploadingFiles.values())
      .filter(file => selectedRowKeys.includes(file.file.name))
      .map(file => file.file);

    setSelectedFilesToEncrypt(selectedFiles);
    setEncryptModalVisible(true);
  };

  // 处理加密完成
  const handleEncryptComplete = (encryptedFiles: File[], originalFiles: File[]) => {
    if (typeof onEncryptComplete === 'function') {
      onEncryptComplete(encryptedFiles, originalFiles);
    }
    setSelectedRowKeys([]);
    setEncryptModalVisible(false);
  };

  // 处理分片上传标记
  const handleMarkChunkUpload = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要标记的文件');
      return;
    }

    const newFiles = new Map(uploadingFiles);
    selectedRowKeys.forEach(fileName => {
      const file = newFiles.get(fileName.toString());
      if (file) {
        newFiles.set(fileName.toString(), {
          ...file,
          useChunkUpload: true
        });
      }
    });

    setUploadStates(prev => ({
      ...prev,
      files: newFiles
    }));
    message.success('已标记选中文件为分片上传');
  };

  // 计算是否可以开始上传
  const canStartUpload = useMemo(() => {
    return !isUploading && Array.from(uploadingFiles.values()).some(file => 
      file.status === 'pending'
    );
  }, [isUploading, uploadingFiles]);

  return (
    <>
      <Modal
        open={visible}
        title={<FormattedMessage id="modal.fileUpload.title" />}
        width={800}
        maskClosable={false}
        closable={!isUploading}
        onCancel={onCancel}
        footer={
          <ActionButtons 
            isUploading={isUploading}
            selectedCount={selectedRowKeys.length}
            onEncrypt={handleEncryptFiles}
            onClear={handleBatchRemove}
            onMarkChunkUpload={handleMarkChunkUpload}
            onCancel={onCancel}
            onStartUpload={onStartUpload}
            canStartUpload={canStartUpload}
          />
        }
        styles={{ 
          body: {
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {isUploading && (
          <UploadProgress {...uploadStats} />
        )}
        
        <div style={{ marginBottom: 16 }}>
          <Upload
            showUploadList={false}
            multiple
            beforeUpload={(file, fileList) => {
              // 检查文件是否与现有文件重复
              const duplicateFiles = fileList.filter(newFile => 
                existingFiles.some(existingFile => existingFile.name === newFile.name) ||
                Array.from(uploadingFiles.keys()).includes(newFile.name)
              );
              
              // 如果有重复文件，标记它们
              if (duplicateFiles.length > 0) {
                const filesWithDuplicateFlag = fileList.map(file => ({
                  file,
                  isDuplicate: existingFiles.some(existingFile => existingFile.name === file.name) ||
                              Array.from(uploadingFiles.keys()).includes(file.name)
                }));
                onAddFiles(filesWithDuplicateFlag);
              } else {
                onAddFiles(fileList.map(file => ({ file, isDuplicate: false })));
              }
              return false;
            }}
            disabled={isUploading}
          >
            <Button 
              icon={<PlusOutlined />}
              disabled={isUploading}
            >
              <FormattedMessage id="modal.fileUpload.addMore" />
            </Button>
          </Upload>
        </div>
        
        <FileList
          files={Array.from(uploadingFiles.values())}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={(selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
          }}
          onRemoveFile={handleSingleRemove}
          onPauseUpload={onPauseUpload}
          onResumeUpload={onResumeUpload}
          isUploading={isUploading}
        />
      </Modal>
      
      <FileEncryptModal
        visible={encryptModalVisible}
        files={selectedFilesToEncrypt}
        onCancel={() => setEncryptModalVisible(false)}
        onEncryptComplete={handleEncryptComplete}
      />
    </>
  );
};

export default DesktopFileUploadModal; 