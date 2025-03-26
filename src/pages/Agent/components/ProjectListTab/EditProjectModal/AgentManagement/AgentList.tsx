import React, { useState, useEffect } from 'react';
import { Button, Space, Tooltip, message } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ProjectAgent } from '../../../../types';
import { fetchProjectAgents, updateProjectAgentSettings, removeProjectAgent } from 'services/projectAgentService';
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

  const fetchAgents = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const agents = await fetchProjectAgents(projectId);
      setProjectAgents(agents);
      onAgentsChange?.();
    } catch (error) {
      console.error('获取项目员工错误:', error);
      message.error('获取项目员工失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [projectId]);

  const handleAddAgent = () => {
    setAddAgentModalVisible(true);
  };

  const handleAddAgentSuccess = () => {
    setAddAgentModalVisible(false);
    fetchAgents();
    onAddAgent();
  };

  const handleRemoveAgent = async (recordId: number) => {
      await removeProjectAgent(recordId);
      await fetchAgents();
  };

  const handleUpdateAgentSettings = async (record: ProjectAgent, field: string, value: any) => {
    try {
      const success = await updateProjectAgentSettings(record, field, value);
      if (success) {
        setProjectAgents(prev => 
          prev.map(item => 
            item.id === record.id ? { ...item, [field]: value } : item
          )
        );
        onAgentsChange?.();
      }
    } catch (error) {
      console.error('更新项目员工设置错误:', error);
    }
  };

  return (
    <TabContainer>
      <AgentListHeader>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddAgent}
          >
            添加员工
          </Button>
          <Tooltip title="添加员工到项目中，并设置其优先级和能力">
            <InfoCircleOutlined style={{ color: 'var(--ant-color-primary)' }} />
          </Tooltip>
        </Space>
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