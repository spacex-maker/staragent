// 导出 axios 实例
export { default as axios } from './axios';

// 导出认证相关 API
export { auth } from './auth';

// 后续可以继续添加其他模块的 API
// export { user } from './user';
// export { posts } from './posts';
// 等等...

// 如果需要，也可以导出一些通用的 API 配置
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://admin.anakkix.cn/manage/',
  timeout: 90000,
}; 