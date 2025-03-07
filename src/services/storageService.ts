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

interface CloudProvider {
  createTime: string;
  updateTime: string;
  id: number;
  providerName: string;
  countryCode: string;
  serviceType: string;
  status: string;
  website: string;
}

interface CloudProviderRegion {
  providerId: number;
  countryCode: string;
  regionCode: string;
  regionName: string;
  status: string;
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

export const getActiveCloudProviders = async (): Promise<{
  success: boolean;
  message: string;
  data?: CloudProvider[];
}> => {
  try {
    const response = await instance.get('/productx/cloud-providers/active');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取云厂商信息失败'
    };
  }
};

export const getCloudProviderRegions = async (providerId: number, countryCode?: string): Promise<{
  success: boolean;
  message: string;
  data?: CloudProviderRegion[];
}> => {
  try {
    const params = new URLSearchParams();
    params.append('providerId', providerId.toString());
    if (countryCode) {
      params.append('countryCode', countryCode);
    }
    const response = await instance.get(`/productx/cloud-provider-regions/list?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取云厂商地域信息失败'
    };
  }
}; 