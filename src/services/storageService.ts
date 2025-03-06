import instance from 'api/axios';

interface StorageInfo {
  storageLimit: number;
  storageUsed: number;
  storageAvailable: number;
  usagePercentage: number;
}

interface FileTypeStats {
  fileType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'ARCHIVE' | 'OTHER';
  typeDescription: string;
  fileCount: number;
  storageSize: number;
  countPercentage: number;
  sizePercentage: number;
}

interface StorageStatsResponse {
  fileTypeStats: FileTypeStats[];
  totalFiles: number;
  totalSize: number;
}

export const getStorageInfo = async (): Promise<{
  success: boolean;
  message: string;
  data?: StorageInfo;
}> => {
  try {
    const response = await instance.get('/productx/user-storage/info');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取存储信息失败'
    };
  }
};

export const getStorageStats = async (): Promise<{
  success: boolean;
  message: string;
  data?: StorageStatsResponse;
}> => {
  try {
    const response = await instance.get('/productx/file-storage/type-statistics');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取存储统计信息失败'
    };
  }
}; 