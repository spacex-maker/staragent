import COS from 'cos-js-sdk-v5';
import axios from '../api/axios';

class COSService {
  constructor() {
    this.cos = null;
    this.host = '';
    this.uploadTasks = new Map(); // 存储上传任务
  }

  async init() {
    try {
      const { data } = await axios.get('/productx/tencent/cos-credential', {
        params: { bucketName: 'px-1258150206' },
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        withCredentials: true
      });
      
      if (data.success) {
        const { secretId, secretKey, sessionToken, host } = data.data;
        
        this.cos = new COS({
          SecretId: secretId,
          SecretKey: secretKey,
          SecurityToken: sessionToken,
          UseAccelerate: true,
          Protocol: window.location.protocol.slice(0, -1),
          Domain: host.replace(/^https?:\/\//, ''),
          WithCredentials: true
        });
        
        this.host = host;
        return true;
      }
      return false;
    } catch (error) {
      console.error('初始化 COS 失败:', error.response?.data?.message || '获取临时密钥失败');
      return false;
    }
  }

  async uploadFile(file, path = '', onProgress, useChunkUpload = false, resumeData = null) {
    try {
      if (!this.cos) {
        const initialized = await this.init();
        if (!initialized) {
          throw new Error('COS 初始化失败');
        }
      }

      // 添加控制台输出
      console.log(`开始上传文件: ${file.name}`);
      console.log(`上传方式: ${useChunkUpload ? '分片上传' : '普通上传'}`);
      console.log(`文件大小: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);

      return new Promise((resolve, reject) => {
        const key = path ? `${path}${file.name}` : file.name;
        let lastProgress = resumeData ? resumeData.progress : 0;
        let lastUpdateTime = Date.now();
        let isTaskCancelled = false;

        // 创建上传任务
        const taskId = resumeData ? resumeData.taskId : `${key}_${Date.now()}`;
        
        // 存储任务信息
        this.uploadTasks.set(taskId, {
          taskId,
          tid: null,
          file,
          path,
          status: 'uploading',
          progress: lastProgress,
          onProgress,
          uploadId: resumeData?.uploadId,
          partNumber: resumeData?.partNumber,
          useChunkUpload,
          startTime: Date.now(),
          totalBytes: file.size,
          uploadedBytes: (lastProgress / 100) * file.size
        });

        // 根据是否使用分片上传选择不同的上传方法
        const uploadMethod = useChunkUpload ? this.cos.sliceUploadFile : this.cos.putObject;
        const uploadOptions = {
          Bucket: 'px-1258150206',
          Region: 'ap-nanjing',
          Key: key,
          Body: file,
          onProgress: (progressData) => {
            if (isTaskCancelled) {
              return;
            }

            const now = Date.now();
            const timeDiff = (now - lastUpdateTime) / 1000; // 转换为秒
            
            if (timeDiff >= 0.5) { // 至少每500ms更新一次
              const percent = Math.min(Math.round(progressData.percent * 100), 100);
              const taskInfo = this.uploadTasks.get(taskId);
              
              if (taskInfo) {
                const currentBytes = (percent / 100) * file.size;
                const bytesDiff = currentBytes - taskInfo.uploadedBytes;
                const speed = bytesDiff / timeDiff; // 字节/秒
                
                taskInfo.progress = percent;
                taskInfo.speed = speed;
                taskInfo.uploadedBytes = currentBytes;
                taskInfo.lastUpdateTime = now;
                
                onProgress(percent, speed, taskId);
                lastProgress = percent;
                lastUpdateTime = now;
              }
            }
          }
        };

        // 如果使用分片上传，添加分片相关配置
        if (useChunkUpload) {
          Object.assign(uploadOptions, {
            ChunkSize: 1024 * 1024 * 50, // 50MB 分片大小
            AsyncLimit: 3, // 并发数
            ChunkParallel: true,
            SliceSize: 1024 * 1024 * 50,
            RetryTimes: 3,
            onTaskReady: (tid) => {
              const taskInfo = this.uploadTasks.get(taskId);
              if (taskInfo) {
                taskInfo.tid = tid;
                taskInfo.status = 'uploading';
              }
            }
          });

          // 如果有续传数据，添加到上传选项中
          if (resumeData?.uploadId) {
            uploadOptions.UploadId = resumeData.uploadId;
            uploadOptions.PartNumber = resumeData.partNumber;
          }
        }

        const task = uploadMethod.call(this.cos, uploadOptions, (err, data) => {
          const taskInfo = this.uploadTasks.get(taskId);
          
          if (isTaskCancelled && useChunkUpload) {
            // 只有分片上传才需要保存进度信息
            if (taskInfo && data) {
              taskInfo.uploadId = data.UploadId;
              taskInfo.partNumber = data.CurrPartNumber;
              taskInfo.status = 'paused';
            }
            return;
          }

          if (err) {
            if (taskInfo) {
              taskInfo.status = 'error';
              taskInfo.error = err.message;
            }
            console.error('上传失败:', {
              fileName: file.name,
              error: err.message
            });
            this.uploadTasks.delete(taskId);
            reject(err);
          } else {
            if (taskInfo) {
              taskInfo.status = 'success';
              taskInfo.progress = 100;
              taskInfo.speed = 0;
            }
            onProgress(100, 0, taskId);
            this.uploadTasks.delete(taskId);
            resolve({
              url: `${this.host}${key}`,
              key: key,
              etag: data.ETag,
              location: data.Location,
              taskId,
              ...data
            });
          }
        });

        // 更新任务信息
        const taskInfo = this.uploadTasks.get(taskId);
        if (taskInfo) {
          taskInfo.cancel = () => {
            isTaskCancelled = true;
            if (taskInfo.tid && useChunkUpload) {
              taskInfo.status = 'cancelling';
              this.cos.cancelTask(taskInfo.tid);
            } else {
              taskInfo.status = 'cancelled';
              this.uploadTasks.delete(taskId);
            }
          };
        }
      });
    } catch (error) {
      console.error('上传过程发生错误:', error);
      throw error;
    }
  }

  // 暂停上传
  pauseUpload(taskId) {
    console.log('尝试暂停上传，taskId:', taskId);
    const taskInfo = this.uploadTasks.get(taskId);
    console.log('找到的任务信息:', taskInfo);
    
    if (taskInfo && taskInfo.cancel) {
      try {
        taskInfo.cancel();
        taskInfo.status = 'paused';
        console.log('暂停成功，保存上传进度:', {
          taskId: taskInfo.taskId,
          progress: taskInfo.progress,
          uploadId: taskInfo.uploadId,
          partNumber: taskInfo.partNumber
        });
        return true;
      } catch (error) {
        console.error('暂停失败:', error);
        return false;
      }
    }
    console.log('未找到有效的任务信息');
    return false;
  }

  // 恢复上传
  resumeUpload(taskId) {
    console.log('尝试恢复上传，taskId:', taskId);
    const taskInfo = this.uploadTasks.get(taskId);
    console.log('找到的任务信息:', taskInfo);
    
    if (taskInfo) {
      try {
        const resumeData = {
          taskId: taskInfo.taskId,
          progress: taskInfo.progress,
          uploadId: taskInfo.uploadId,
          partNumber: taskInfo.partNumber
        };

        // 删除旧任务
        this.uploadTasks.delete(taskId);
        
        // 开始新的上传，传入续传数据
        this.uploadFile(taskInfo.file, taskInfo.path, taskInfo.onProgress, taskInfo.useChunkUpload, resumeData)
          .then(() => {
            console.log('恢复上传成功');
          })
          .catch((error) => {
            console.error('恢复上传失败:', error);
          });
        
        return true;
      } catch (error) {
        console.error('恢复失败:', error);
        return false;
      }
    }
    console.log('未找到有效的任务信息');
    return false;
  }

  // 获取任务状态
  getTaskStatus(taskId) {
    const taskInfo = this.uploadTasks.get(taskId);
    return taskInfo ? taskInfo.status : null;
  }

  async createFolder(path) {
    if (!this.cos) {
      await this.init();
    }

    // 确保路径以 / 结尾，这是对象存储中表示文件夹的方式
    const folderPath = path.endsWith('/') ? path : `${path}/`;

    return new Promise((resolve, reject) => {
      this.cos.putObject({
        Bucket: 'px-1258150206',
        Region: 'ap-nanjing',
        Key: folderPath,
        Body: '',  // 空内容，只创建路径
        ContentLength: 0
      }, (err, data) => {
        if (err) {
          console.error('创建文件夹失败:', err);
          reject(err);
        } else {
          resolve({
            key: folderPath,
            ...data
          });
        }
      });
    });
  }

  async listFiles(prefix = '') {
    if (!this.cos) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      this.cos.getBucket({
        Bucket: 'px-1258150206',
        Region: 'ap-nanjing',
        Prefix: prefix,
        Delimiter: '/',
        MaxKeys: 1000
      }, (err, data) => {
        if (err) {
          console.error('获取文件列表失败:', err);
          reject(err);
        } else {
          const result = {
            CommonPrefixes: data.CommonPrefixes || [],
            Contents: data.Contents || []
          };
          resolve(result);
        }
      });
    });
  }

  async deleteFile(key) {
    if (!this.cos) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      this.cos.deleteObject({
        Bucket: 'px-1258150206',
        Region: 'ap-nanjing',
        Key: key
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async renameFile(oldKey, newKey) {
    if (!this.cos) {
      await this.init();
    }

    try {
      // 1. 复制文件到新的位置
      await new Promise((resolve, reject) => {
        this.cos.putObjectCopy({
          Bucket: 'px-1258150206',
          Region: 'ap-nanjing',
          Key: newKey,
          CopySource: encodeURIComponent('px-1258150206.cos.ap-nanjing.myqcloud.com/' + oldKey)
        }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      // 2. 删除原文件
      await this.deleteFile(oldKey);

      return true;
    } catch (error) {
      console.error('重命名文件失败:', error);
      throw error;
    }
  }
}

export const cosService = new COSService(); 