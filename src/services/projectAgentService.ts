import { message } from 'antd';
import axios from 'api/axios';
import { ProjectAgent } from 'pages/Agent/types';

/**
 * 获取项目成员列表
 * @param projectId - 项目ID
 * @param showError - 是否显示错误提示，默认为true
 * @returns 返回项目成员列表
 */
export const fetchProjectAgents = async (projectId: string | number, showError: boolean = true): Promise<ProjectAgent[]> => {
  if (!projectId) return [];
  
  try {
    const response = await axios.get(`/productx/sa-ai-agent-project/list-by-project/${projectId}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      if (showError) {
        message.error(response.data.message || '获取项目员工失败');
      }
      return [];
    }
  } catch (error) {
    console.error('获取项目员工错误:', error);
    if (showError) {
      message.error('获取项目员工失败，请稍后重试');
    }
    return [];
  }
};

/**
 * 更新项目成员设置
 * @param record - 项目成员记录
 * @param field - 要更新的字段
 * @param value - 新的值
 */
export const updateProjectAgentSettings = async (record: ProjectAgent, field: string, value: any): Promise<boolean> => {
  try {
    const updateData: any = {
      id: record.id
    };
    
    if (field === 'priority') {
      updateData.priority = value;
    } else if (field === 'enableMemory') {
      updateData.enableMemory = value;
    } else if (field === 'enableRag') {
      updateData.enableRag = value;
    } else if (field === 'enableExternal') {
      updateData.enableExternal = value;
    } else if (field === 'temperature') {
      updateData.temperature = value;
    } else if (field === 'maxTokens') {
      updateData.maxTokens = value;
    }
    
    const response = await axios.post('/productx/sa-ai-agent-project/update', updateData);
    
    if (response.data.success) {
      message.success(`员工${field}设置已更新`);
      return true;
    } else {
      message.error(response.data.message || `更新员工${field}设置失败`);
      return false;
    }
  } catch (error) {
    console.error('更新员工设置错误:', error);
    message.error('更新员工设置失败，请稍后重试');
    return false;
  }
};

/**
 * 从项目中移除成员
 * @param recordId - 成员记录ID
 */
export const removeProjectAgent = async (recordId: number): Promise<boolean> => {
  try {
    const response = await axios.delete(`/productx/sa-ai-agent-project/${recordId}`);
    
    if (response.data.success) {
      message.success('员工已从项目中移除');
      return true;
    } else {
      message.error(response.data.message || '移除员工失败');
      return false;
    }
  } catch (error) {
    console.error('移除员工错误:', error);
    message.error('移除员工失败，请稍后重试');
    return false;
  }
}; 