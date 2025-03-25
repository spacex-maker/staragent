import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api/auth';

// 创建认证上下文
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: false
});

// 创建认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 检查用户是否已登录
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // 获取用户信息
          const storedUserInfo = localStorage.getItem('userInfo');
          if (storedUserInfo) {
            setUser(JSON.parse(storedUserInfo));
            setIsAuthenticated(true);
          } else {
            const result = await auth.getUserInfo();
            if (result.success) {
              setUser(result.data);
              setIsAuthenticated(true);
            } else {
              // 获取用户信息失败，清除token
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('认证检查错误:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录函数
  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await auth.login(credentials);
      if (result.success) {
        const userInfo = await auth.getUserInfo();
        if (userInfo.success) {
          setUser(userInfo.data);
          setIsAuthenticated(true);
          return { success: true };
        }
      }
      return result;
    } catch (error) {
      console.error('登录错误:', error);
      return { success: false, message: error.message || '登录失败' };
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    auth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 创建自定义钩子以使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 