import React, { useEffect, useState } from 'react';
import { List, Typography, Tag, Spin, message } from 'antd';
import styled from 'styled-components';
import axios from '../../../../api/axios';
import { AIAgent } from '../../types';
import AIAgentItem from './AIAgentItem';
import AIAgentModal from './AIAgentModal';
import AIAgentListHeader from './AIAgentListHeader';

const { Text } = Typography;

const ListContainer = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AIAgentList: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);

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
    setIsModalVisible(true);
  };

  const handleDelete = (agentId: string) => {
    setAgents(prev => prev.filter(agent => agent.id.toString() !== agentId));
  };

  const handleModalSuccess = () => {
    setIsModalVisible(false);
    fetchAgents();
  };

  const handleCreate = () => {
    setEditingAgent(null);
    setIsModalVisible(true);
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

      <AIAgentModal
        visible={isModalVisible}
        editingAgent={editingAgent}
        onSuccess={handleModalSuccess}
        onCancel={() => setIsModalVisible(false)}
      />
    </ListContainer>
  );
};

export default AIAgentList; 