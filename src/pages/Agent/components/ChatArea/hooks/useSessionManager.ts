import { useState, useCallback } from 'react';
import { message } from 'antd';
import axios from '../../../../../api/axios';
import { Project } from '../../../types';

// 使用不同的接口名，避免可能的命名冲突
interface SessionManagerProps {
  activeProject: Project | null;
  activeSessionId: string | null;
  setActiveSessionId: (sessionId: string | null) => void;
  clearSessionMessages: () => void;
  onClearMessages?: () => void;
}

export const useSessionManager = ({
  activeProject,
  activeSessionId,
  setActiveSessionId,
  clearSessionMessages,
  onClearMessages
}: SessionManagerProps) => {
  const [noSessionsMessage] = useState<string>('');
  const [newSessionLoading, setNewSessionLoading] = useState(false);
  const [sessionSwitching, setSessionSwitching] = useState(false);

  // 处理会话选择
  const handleSessionSelect = useCallback(async (sessionId: string) => {
    if (sessionId === activeSessionId) return;
    
    setSessionSwitching(true);
    try {
      // 先清空当前消息
      clearSessionMessages();
      // 设置新的会话ID
      setActiveSessionId(sessionId);
      // 清空全局消息
      onClearMessages?.();
    } catch (error) {
      console.error('切换会话失败:', error);
      message.error('切换会话失败，请稍后重试');
    } finally {
      setSessionSwitching(false);
    }
  }, [activeSessionId, setActiveSessionId, clearSessionMessages, onClearMessages]);

  // 处理新建会话
  const handleNewSession = useCallback(async () => {
    if (!activeProject?.id) return;
    
    setNewSessionLoading(true);
    try {
      const response = await axios.post('/chat/create-session', {
        projectId: parseInt(activeProject.id),
        title: '新会话'
      });
      
      if (response.data.success) {
        const newSession = response.data.data;
        // 先清空当前消息
        clearSessionMessages();
        // 设置新的会话ID
        setActiveSessionId(newSession.id.toString());
        // 清空全局消息
        onClearMessages?.();
      } else {
        message.error(response.data.message || '创建会话失败');
      }
    } catch (error) {
      console.error('创建会话错误:', error);
      message.error('创建会话失败，请稍后重试');
    } finally {
      setNewSessionLoading(false);
    }
  }, [activeProject?.id, setActiveSessionId, clearSessionMessages, onClearMessages]);

  return {
    handleSessionSelect,
    handleNewSession,
    noSessionsMessage,
    newSessionLoading,
    sessionSwitching
  };
}; 