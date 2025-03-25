import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, List, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from '../../../../api/axios';
import { AIAgent } from '../../types';
import AIAgentItem from './AIAgentItem';
import CreateAIAgentModal from './CreateAIAgentModal';
import EditAIAgentModal from './EditAIAgentModal';
import AIAgentListHeader from './AIAgentListHeader';

const Container = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ListContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export interface AIAgentListRef {
  triggerAddAgent: () => void;
}

interface AIAgentListProps {
  onNavigateToAgents?: () => void;
  autoTriggerAddAgent?: boolean;
}

const AIAgentListTab = forwardRef<AIAgentListRef, AIAgentListProps>(({ onNavigateToAgents, autoTriggerAddAgent = false }, ref) => {
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);

  // 监听 autoTriggerAddAgent 属性变化
  React.useEffect(() => {
    if (autoTriggerAddAgent) {
      setIsCreateModalVisible(true);
    }
  }, [autoTriggerAddAgent]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    triggerAddAgent: () => {
      setIsCreateModalVisible(true);
    }
  }));

  // 获取AI员工列表
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/productx/sa-ai-agent/list');
      if (response.data.success) {
        setAgents(response.data.data);
      } else {
        message.error(response.data.message || '获取AI员工列表失败');
      }
    } catch (error) {
      console.error('获取AI员工列表错误:', error);
      message.error('获取AI员工列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取列表
  React.useEffect(() => {
    fetchAgents();
  }, []);

  const handleAddAgent = () => {
    setIsCreateModalVisible(true);
  };

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

  const handleRecruit = () => {
    // TODO: 实现招募员工功能
    message.info('招募员工功能开发中...');
  };

  return (
    <Container>
      <Header>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddAgent}
        >
          新增AI员工
        </Button>
      </Header>

      <ListContent>
        <List
          loading={loading}
          dataSource={agents}
          renderItem={(agent) => (
            <AIAgentItem
              agent={agent}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          locale={{ emptyText: '暂无AI员工，点击上方按钮添加' }}
        />
      </ListContent>

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
    </Container>
  );
});

AIAgentListTab.displayName = 'AIAgentListTab';

export default AIAgentListTab; 