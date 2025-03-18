import React, { useState, useEffect } from 'react';
import { Button, Space, Tooltip, message } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ProjectAgent } from '../../../../types';
import axios from '../../../../../../api/axios';
import AgentTable from './AgentTable';
import AddAgentModal from '../../AddAgentModal';
import { AgentListProps } from '../types';

const TabContainer = styled.div`
  margin-top: 8px;
  padding-bottom: 16px;
`;

const AgentListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const AgentList: React.FC<AgentListProps> = ({ projectId, onAddAgent, onAgentsChange }) => {
  const [projectAgents, setProjectAgents] = useState<ProjectAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [addAgentModalVisible, setAddAgentModalVisible] = useState(false);

  const fetchProjectAgents = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/productx/sa-ai-agent-project/list-by-project/${projectId}`);
      if (response.data.success) {
        setProjectAgents(response.data.data);
        onAgentsChange?.();
      } else {
        message.error(response.data.message || '获取项目员工失败');
      }
    } catch (error) {
      console.error('获取项目员工错误:', error);
      message.error('获取项目员工失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAgents();
  }, [projectId]);

  const handleAddAgent = () => {
    setAddAgentModalVisible(true);
  };

  const handleAddAgentSuccess = () => {
    setAddAgentModalVisible(false);
    fetchProjectAgents();
    onAddAgent();
  };

  const handleRemoveAgent = async (recordId: number) => {
    try {
      const response = await axios.delete(`/productx/sa-ai-agent-project/${recordId}`);
      
      if (response.data.success) {
        message.success('员工已从项目中移除');
        fetchProjectAgents();
      } else {
        message.error(response.data.message || '移除员工失败');
      }
    } catch (error) {
      console.error('移除员工错误:', error);
      message.error('移除员工失败，请稍后重试');
    }
  };

  const handleUpdateAgentSettings = async (record: ProjectAgent, field: string, value: any) => {
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
        setProjectAgents(prev => 
          prev.map(item => 
            item.id === record.id ? { ...item, [field]: value } : item
          )
        );
        onAgentsChange?.();
      } else {
        message.error(response.data.message || `更新员工${field}设置失败`);
      }
    } catch (error) {
      console.error('更新员工设置错误:', error);
      message.error('更新员工设置失败，请稍后重试');
    }
  };

  return (
    <TabContainer>
      <AgentListHeader>
        <div>
          <Tooltip title="员工将按照优先级顺序参与项目，优先级越高越先响应">
            <InfoCircleOutlined style={{ marginRight: 8 }} />
          </Tooltip>
          <span>项目员工列表</span>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddAgent}
        >
          添加员工
        </Button>
      </AgentListHeader>
      <AgentTable
        projectAgents={projectAgents}
        loading={loading}
        onUpdateAgentSettings={handleUpdateAgentSettings}
        onRemoveAgent={handleRemoveAgent}
      />
      <AddAgentModal
        visible={addAgentModalVisible}
        projectId={projectId}
        onCancel={() => setAddAgentModalVisible(false)}
        onSuccess={handleAddAgentSuccess}
      />
    </TabContainer>
  );
};

export default AgentList; 