import { useState, useEffect, useCallback } from 'react';
import { ProjectAgent } from '../../../types';
import { fetchProjectAgents as fetchAgentsApi } from '../../../../../services/projectAgentService';

export const useProjectAgents = (projectId: string | undefined) => {
  const [projectAgents, setProjectAgents] = useState<ProjectAgent[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取项目员工列表
  const fetchAgents = useCallback(async () => {
    if (!projectId) {
      setProjectAgents([]);
      return;
    }
    
    setLoading(true);
    try {
      const agents = await fetchAgentsApi(projectId, false);
      setProjectAgents(agents);
    } catch (error) {
      console.error('获取项目员工失败:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 监听员工列表变化事件
  useEffect(() => {
    const handleAgentsChange = () => {
      if (projectId) {
        fetchAgents();
      }
    };

    // 初始加载
    fetchAgents();

    // 监听员工变化事件
    window.addEventListener('projectAgentsChanged', handleAgentsChange);
    return () => {
      window.removeEventListener('projectAgentsChanged', handleAgentsChange);
    };
  }, [projectId, fetchAgents]);

  return {
    projectAgents,
    fetchAgents,
    loading
  };
}; 