import { useState } from 'react';
import { message } from 'antd';
import { cosService } from 'services/cos';
import instance from 'api/axios';
import { loadFiles } from 'services/fileService';
import { formatFileSize } from 'utils/format';

export const useUpload = (
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
  nodeId
) => {
  const [uploadStates, setUploadStates] = useState({
    files: new Map(),
    isUploading: false
  });

  const handleUpload = async (files, existingFiles = []) => {
    if (!Array.isArray(files)) {
      console.warn('Files must be an array');
      return false;
    }

    const fileList = files.filter(file => file && file.name && file.size);
    if (fileList.length === 0) {
      console.warn('No valid files to upload');
      return false;
    }

    const uploadStates = new Map();
    
    fileList.forEach(file => {
      const isDuplicate = existingFiles.some(existingFile => existingFile.name === file.name);
      uploadStates.set(file.name, {
        file,
        name: file.name,
        fileSize: file.size,
        status: 'pending',
        progress: 0,
        isDuplicate,
        action: isDuplicate ? 'ask' : 'upload',
      });
    });
    
    setUploadStates(prev => ({
      ...prev,
      files: uploadStates
    }));
    
    return true;
  };

  const uploadFiles = async (filesToUpload) => {
    if (!Array.isArray(filesToUpload) || filesToUpload.length === 0) {
      console.warn('No files to upload');
      return;
    }

    if (!nodeId) {
      message.error('请先选择存储节点');
      return;
    }

    console.log('开始上传文件:');
    console.log('- 目标文件夹ID:', currentParentId);
    console.log('- 目标文件夹名称:', currentFolder?.name || '根目录');
    console.log('- 存储节点ID:', nodeId);
    console.log('- 上传的文件:', filesToUpload.map(file => {
      const fileObj = file instanceof File ? file : file.file;
      return `${fileObj.name} (${formatFileSize(fileObj.size)})`;
    }).join('\n  '));

    const initialUploadStates = new Map();
    
    filesToUpload.forEach(file => {
      // 处理直接传入的 File 对象
      const fileObj = file instanceof File ? file : file.file;
      
      if (!fileObj || !fileObj.name) {
        console.warn('Invalid file object:', file);
        return;
      }

      initialUploadStates.set(fileObj.name, {
        progress: 0,
        speed: 0,
        startTime: Date.now(),
        fileSize: fileObj.size,
        isCompleted: false,
        lastProgress: 0,
        lastTime: Date.now(),
        uploadCompleted: false,
        fileCreated: false,
        status: 'pending',
        isDuplicate: file.isDuplicate || false,
        file: fileObj,
        taskId: null,
        useChunkUpload: file.useChunkUpload || false
      });
    });

    if (initialUploadStates.size === 0) {
      console.warn('No valid files to upload');
      return;
    }

    setUploadStates(prev => ({
      isUploading: true,
      files: initialUploadStates
    }));

    try {
      const fullPath = `${userInfo.username}/`;
      
      const uploadPromises = Array.from(initialUploadStates.values()).map(async fileState => {
        try {
          setUploadStates(prev => {
            const newFiles = new Map(prev.files);
            const state = newFiles.get(fileState.file.name);
            newFiles.set(fileState.file.name, {
              ...state,
              status: 'uploading',
              startTime: Date.now(),
              lastTime: Date.now(),
              lastProgress: 0,
              speed: 0
            });
            return { ...prev, files: newFiles };
          });

          const uploadResult = await cosService.uploadFile(
            fileState.file,
            fullPath,
            (progress, speed, taskId) => {
              setUploadStates(prev => {
                const state = prev.files.get(fileState.file.name);
                if (!state || state.uploadCompleted) return prev;

                const now = Date.now();
                const timeDiff = (now - state.lastTime) / 1000;
                
                if (timeDiff >= 0.5) {
                  const progressDiff = progress - state.lastProgress;
                  const uploadedBytes = (progressDiff / 100) * fileState.fileSize;
                  const currentSpeed = uploadedBytes / timeDiff;
                  
                  // 计算总上传字节数和总时间
                  const totalUploadedBytes = state.totalUploadedBytes || 0;
                  const totalUploadTime = state.totalUploadTime || 0;
                  
                  const newFiles = new Map(prev.files);
                  newFiles.set(fileState.file.name, {
                    ...state,
                    progress: Math.round(progress),
                    speed: currentSpeed,
                    lastProgress: progress,
                    lastTime: now,
                    taskId: taskId || state.taskId,
                    // 累计上传的字节数和时间
                    totalUploadedBytes: totalUploadedBytes + uploadedBytes,
                    totalUploadTime: totalUploadTime + timeDiff,
                    // 记录文件总大小，用于最终计算
                    totalFileSize: fileState.fileSize
                  });
                  
                  return {
                    ...prev,
                    files: newFiles
                  };
                }
                
                return prev;
              });
            },
            fileState.useChunkUpload
          );

          // 在状态更新中计算平均速度
          let calculatedAverageSpeed = 0;
          
          setUploadStates(prev => {
            const state = prev.files.get(fileState.file.name);
            // 使用文件总大小除以总时间来计算平均速度
            calculatedAverageSpeed = Math.round(
              state?.totalFileSize / (state?.totalUploadTime || 1)
            );

            const newFiles = new Map(prev.files);
            newFiles.set(fileState.file.name, {
              ...state,
              status: 'creating',
              progress: 100,
              speed: 0,
              taskId: state.taskId,
              averageSpeed: calculatedAverageSpeed
            });

            console.log('文件上传完成:', {
              fileName: fileState.file.name,
              fileSize: state?.totalFileSize,
              totalTime: state?.totalUploadTime,
              averageSpeed: calculatedAverageSpeed
            });

            return { ...prev, files: newFiles };
          });

          await instance.post('/productx/file-storage/create-directory', {
            parentId: currentParentId,
            nodeId: nodeId,
            isDirectory: false,
            name: fileState.file.name,
            extension: fileState.file.name.split('.').pop(),
            size: fileState.file.size,
            storagePath: uploadResult.key,
            hash: uploadResult.etag?.replace(/"/g, ''),
            mimeType: fileState.file.type,
            storageType: 'COS',
            downloadUrl: uploadResult.url,
            visibility: 'PRIVATE',
            uploadAverageSpeed: calculatedAverageSpeed
          });

          setUploadStates(prev => {
            const newFiles = new Map(prev.files);
            const state = newFiles.get(fileState.file.name);
            newFiles.set(fileState.file.name, {
              ...state,
              status: 'success',
              uploadCompleted: true,
              fileCreated: true,
              speed: 0,
              taskId: null
            });
            return { ...prev, files: newFiles };
          });

          return { success: true, file: fileState.file };
        } catch (error) {
          setUploadStates(prev => {
            const newFiles = new Map(prev.files);
            const state = newFiles.get(fileState.file.name);
            newFiles.set(fileState.file.name, {
              ...state,
              status: 'error',
              progress: 0,
              speed: 0,
              errorMessage: error.message,
              taskId: null
            });
            return { ...prev, files: newFiles };
          });

          return { success: false, file: fileState.file, error };
        }
      });

      const results = await Promise.all(uploadPromises);
      
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;
      
      if (failureCount === 0) {
        message.success(`成功上传 ${successCount} 个文件`);
      } else {
        message.warning(`${successCount} 个文件上传成功，${failureCount} 个文件上传失败`);
      }
      
      await loadFiles(
        currentParentId, 
        { setLoading, setFiles, setFilteredFiles, setSearchText, setPagination, pagination },
        nodeId
      );
    } catch (error) {
      console.error('上传过程中发生错误:', error);
      message.error('上传过程中发生错误: ' + (error.message || '未知错误'));
    } finally {
      setUploadStates(prev => ({
        ...prev,
        isUploading: false
      }));
    }
  };

  const handleDuplicateDecision = (fileName, action) => {
    setUploadStates(prev => {
      const newFiles = new Map(prev.files);
      const fileState = newFiles.get(fileName);
      if (fileState) {
        newFiles.set(fileName, {
          ...fileState,
          action,
          status: action === 'skip' ? 'skipped' : 'pending'
        });
      }
      return {
        ...prev,
        files: newFiles
      };
    });
  };

  const handleRemoveFiles = (fileNames) => {
    setUploadStates(prev => {
      const newFiles = new Map(prev.files);
      fileNames.forEach(fileName => {
        newFiles.delete(fileName);
      });
      return {
        ...prev,
        files: newFiles
      };
    });
    message.success('已移除选中的文件');
  };

  const handleAddFiles = (newFiles) => {
    const fileList = Array.from(newFiles);
    const currentFiles = new Map(uploadStates.files);
    
    fileList.forEach(fileObj => {
      // 处理从 beforeUpload 传来的带有 isDuplicate 标记的文件对象
      if (fileObj.file && typeof fileObj.isDuplicate !== 'undefined') {
        const file = fileObj.file;
        currentFiles.set(file.name, {
          file,
          name: file.name,
          fileSize: file.size,
          status: 'pending',
          progress: 0,
          isDuplicate: fileObj.isDuplicate,
          action: fileObj.isDuplicate ? 'ask' : 'upload',
        });
      } else {
        // 处理普通文件对象（如加密后的文件）
        currentFiles.set(fileObj.name, {
          file: fileObj,
          name: fileObj.name,
          fileSize: fileObj.size,
          status: 'pending',
          progress: 0,
          isDuplicate: false,
          action: 'upload',
        });
      }
    });
    
    setUploadStates(prev => ({
      ...prev,
      files: currentFiles
    }));
  };

  const handleEncryptFiles = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      message.error('请选择要加密的文件');
      return null;
    }

    // 创建加密模态框的 props
    return {
      visible: true,
      files: selectedFiles
    };
  };

  const handlePauseUpload = async (taskId) => {
    console.log('handlePauseUpload 被调用，taskId:', taskId);
    if (!taskId) {
      console.log('taskId 为空，退出');
      return;
    }
    
    const success = await cosService.pauseUpload(taskId);
    console.log('暂停上传结果:', success);
    
    if (success) {
      setUploadStates(prev => {
        const newFiles = new Map(prev.files);
        console.log('当前文件状态:', Array.from(newFiles.entries()));
        
        for (const [fileName, fileState] of newFiles.entries()) {
          console.log('检查文件:', fileName, '当前taskId:', fileState.taskId);
          if (fileState.taskId === taskId) {
            console.log('找到匹配的文件，更新状态');
            newFiles.set(fileName, {
              ...fileState,
              status: 'paused',
              speed: 0
            });
            break;
          }
        }
        return { ...prev, files: newFiles };
      });
      message.success('已暂停上传');
    }
  };

  const handleResumeUpload = async (taskId) => {
    if (!taskId) return;
    
    const success = await cosService.resumeUpload(taskId);
    if (success) {
      setUploadStates(prev => {
        const newFiles = new Map(prev.files);
        for (const [fileName, fileState] of newFiles.entries()) {
          if (fileState.taskId === taskId) {
            newFiles.set(fileName, {
              ...fileState,
              status: 'uploading',
              lastTime: Date.now(),
              lastProgress: fileState.progress
            });
            break;
          }
        }
        return { ...prev, files: newFiles };
      });
      message.success('已恢复上传');
    }
  };

  return {
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
  };
}; 