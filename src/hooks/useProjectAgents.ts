import { useState, useEffect, useCallback } from 'react';
import { ProjectAgent } from '../pages/Agent/types';
import { fetchProjectAgents as fetchAgentsApi } from '../services/projectAgentService';

interface UseProjectAgentsResult {
  projectAgents: ProjectAgent[];
  loading: boolean;
  fetchAgents: () => Promise<void>;
}

export const useProjectAgents = (projectId?: string | number): UseProjectAgentsResult => {
  const [projectAgents, setProjectAgents] = useState<ProjectAgent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAgents = useCallback(async () => {
    if (!projectId) {
      setProjectAgents([]);
      return;
    }

    setLoading(true);
    try {
      const agents = await fetchAgentsApi(projectId, false);
      setProjectAgents(agents);
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
    loading,
    fetchAgents
  };
}; 