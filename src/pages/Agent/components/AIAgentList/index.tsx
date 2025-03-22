import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { List, Typography, Tag, Spin, message } from 'antd';
import styled from 'styled-components';
import axios from '../../../../api/axios';
import { AIAgent } from '../../types';
import AIAgentItem from './AIAgentItem';
import CreateAIAgentModal from './CreateAIAgentModal';
import EditAIAgentModal from './EditAIAgentModal';
import AIAgentListHeader from './AIAgentListHeader';

const { Text } = Typography;

const ListContainer = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export interface AIAgentListRef {
  triggerAddAgent: () => void;
}

interface AIAgentListProps {
  onNavigateToAgents?: () => void;
}

const AIAgentList = forwardRef<AIAgentListRef, AIAgentListProps>((props, ref) => {
  const { onNavigateToAgents } = props;
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    triggerAddAgent: () => {
      setIsCreateModalVisible(true);
    }
  }));

  const fetchAgents = async () => {
    try {
      const response = await axios.get('/productx/sa-ai-agent/list');
      if (response.data.success) {
        setAgents(response.data.data);
      } else {
        message.error(response.data.message || '获取AI员工列表失败');
      }
    } catch (error) {
      console.error('获取AI员工列表错误:', error);
      message.error('获取AI员工列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleEdit = (agent: AIAgent) => {
    setEditingAgent(agent);
    setIsEditModalVisible(true);
  };

  const handleDelete = (agentId: string) => {
    setAgents(prev => prev.filter(agent => agent.id.toString() !== agentId));
  };

  const handleCreateSuccess = () => {
    setIsCreateModalVisible(false);
    fetchAgents();
  };

  const handleEditSuccess = () => {
    setIsEditModalVisible(false);
    setEditingAgent(null);
    fetchAgents();
  };

  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleRecruit = () => {
    // TODO: 实现招募员工功能
    message.info('招募员工功能开发中...');
  };

  if (loading) {
    return (
      <ListContainer>
        <Spin tip="加载中..." />
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <AIAgentListHeader 
        onCreateAgent={handleCreate}
        onRecruitAgent={handleRecruit}
      />

      <List
        dataSource={agents}
        renderItem={(agent) => (
          <AIAgentItem
            agent={agent}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        locale={{ emptyText: '暂无AI员工' }}
      />

      <CreateAIAgentModal
        visible={isCreateModalVisible}
        onSuccess={handleCreateSuccess}
        onCancel={() => setIsCreateModalVisible(false)}
      />

      {editingAgent && (
        <EditAIAgentModal
          visible={isEditModalVisible}
          editingAgent={editingAgent}
          onSuccess={handleEditSuccess}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingAgent(null);
          }}
        />
      )}
    </ListContainer>
  );
});

export default AIAgentList; 