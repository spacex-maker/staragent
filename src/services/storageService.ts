import instance from 'api/axios';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

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

export interface CloudProvider {
  createTime: string;
  updateTime: string;
  id: number;
  providerName: string;
  countryCode: string;
  serviceType: string;
  status: string;
  website: string;
  isDefault: boolean;
  iconImg?: string;
}

interface CloudProviderRegion {
  providerId: number;
  countryCode: string;
  regionCode: string;
  regionName: string;
  status: string;
}

interface CountryFlag {
  name: string;
  localName: string | null;
  code: string;
  flagImageUrl: string;
}

export interface UserStorageNode {
  id: number;
  nodeName: string;
  nodeCloud: string;
  nodeType: string;
  nodeRegion: string;
  storageLimit: number;
  storageUsed: number;
  storageAvailable: number;
  usagePercentage: number;
  isDefault: boolean;
}

export const getStorageInfo = async (): Promise<ApiResponse<StorageInfo>> => {
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

export const getStorageStats = async (): Promise<ApiResponse<StorageStatsResponse>> => {
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

export const getActiveCloudProviders = async (): Promise<ApiResponse<CloudProvider[]>> => {
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

export const getCloudProviderRegions = async (providerId: number, countryCode?: string): Promise<ApiResponse<CloudProviderRegion[]>> => {
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

export const getAllCountryFlags = async (): Promise<ApiResponse<CountryFlag[]>> => {
  try {
    const response = await instance.get('/base/countries/list-all-flag');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取国家国旗信息失败'
    };
  }
};

export const getUserStorageNodes = async (): Promise<ApiResponse<UserStorageNode[]>> => {
  try {
    const response = await instance.get('/productx/user-storage/nodes');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取用户存储节点失败'
    };
  }
};

export const updateUserStorageNode = async (nodeId: number, data: { nodeName: string }): Promise<ApiResponse<any>> => {
  try {
    const response = await instance.post('/productx/user-storage/update', {
      id: nodeId,
      name: data.nodeName
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '更新节点信息失败'
    };
  }
}; 