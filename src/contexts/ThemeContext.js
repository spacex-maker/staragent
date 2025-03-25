import React, { createContext, useContext, useState, useEffect } from 'react';
import { darkTheme, lightTheme } from '../themes';

// 创建主题上下文
const ThemeContext = createContext({
  theme: {
    mode: 'light',
    colors: {
      ...lightTheme.colors
    }
  },
  toggleTheme: () => {}
});

// 创建主题提供者组件
export const ThemeProvider = ({ children, value }) => {
  const [internalTheme, setInternalTheme] = useState(value.theme);

  // 同步外部主题状态变化
  useEffect(() => {
    setInternalTheme(value.theme);
  }, [value.theme]);

  // 提供扩展的上下文值，确保theme对象具有mode和colors属性
  const contextValue = {
    theme: {
      ...internalTheme,
      mode: internalTheme.mode,
      colors: internalTheme.colors
    },
    toggleTheme: value.toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 创建自定义钩子以使用主题上下文
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 