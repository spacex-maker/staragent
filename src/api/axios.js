import axios from 'axios';
import { message } from 'antd';

// 获取当前网络设置
const getCurrentNetwork = () => localStorage.getItem('network') || 'china';

// 获取基地址
const getBaseURL = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    return 'http://127.0.0.1:8080';
  }
  
  const network = getCurrentNetwork();
  return network === 'usa' ? 'https://usa.api.aimatex.com' : 'https://api.aimatex.com';
};

// 创建 axios 实例
const instance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    message.error('发送请求时出错，请检查网络连接');
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 处理 204 No Content 响应（通常是删除操作的响应）
    if (response.status === 204) {
      return {
        ...response,
        data: { success: true }
      };
    }
    
    // 检查响应数据中是否包含 success 字段，并且值为 false
    if (response.data && response.data.success === false) {
      console.error('API 返回错误:', response.data);
      // 显示错误消息
      message.error(response.data.message || '操作失败');
      // 创建一个自定义错误对象
      const customError = new Error(response.data.message || '操作失败');
      customError.response = response;
      customError.isCustomError = true;
      return Promise.reject(customError);
    }
    
    // 处理成功响应，但可能需要记录日志
    if (response.data && response.data.success === true) {
      console.log('API 操作成功:', response.data);
    }
    
    return response;
  },
  error => {
    console.error('响应错误:', error);
    
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('错误响应:', error.response);
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        message.error('登录已过期，请重新登录');
      } else if (error.response.status === 404) {
        message.error('请求的资源不存在');
      } else if (error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error(`请求失败 (${error.response.status})`);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('无响应错误:', error.request);
      message.error('服务器未响应，请检查网络连接');
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
      message.error('请求配置错误: ' + error.message);
    }
    
    return Promise.reject(error);
  }
);

// 添加请求测试方法
export const testConnection = async () => {
  try {
    const response = await instance.get('/health-check');
    return response.status === 200;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

export default instance; 