import { theme } from 'antd';
const { darkAlgorithm, defaultAlgorithm } = theme;

// 亮色主题
export const lightTheme = {
  mode: 'light',
  defaultAlgorithm,
  darkAlgorithm,
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#60a5fa',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#ffffff',
    text: 'rgba(0, 0, 0, 0.85)',
    textSecondary: 'rgba(0, 0, 0, 0.65)',
    borderColor: '#d9d9d9',
  },
};

// 暗色主题
export const darkTheme = {
  mode: 'dark',
  defaultAlgorithm,
  darkAlgorithm,
  colors: {
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    secondary: '#93c5fd',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#111827',
    text: 'rgba(255, 255, 255, 0.85)',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    borderColor: '#303030',
  },
}; 