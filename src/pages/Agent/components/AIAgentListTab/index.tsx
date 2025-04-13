import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, List, message } from 'antd';
import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../../../../api/axios';
import { AIAgent } from '../../types';
import AIAgentItem from './AIAgentItem';
import CreateAIAgentModal from './CreateAIAgentModal';
import EditAIAgentModal from './EditAIAgentModal';
import AIAgentListHeader from './AIAgentListHeader';
import AIAgentMarketModal from './AIAgentMarketModal';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
  min-height: 64px;
  border-bottom: 1px solid var(--ant-color-border);
  flex-shrink: 0;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionButton = styled(Button)`
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const ListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  min-height: 0;

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--ant-color-border);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--ant-color-border-hover);
  }

  /* 确保滚动条不占用内容区域宽度 */
  padding-right: 20px;
  margin-right: -20px;
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
  const [isMarketModalVisible, setIsMarketModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const intl = useIntl();

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
        message.error(response.data.message || intl.formatMessage({ id: 'aiAgentList.getListError' }));
      }
    } catch (error) {
      console.error('获取AI助手列表错误:', error);
      message.error(intl.formatMessage({ id: 'aiAgentList.getListError' }));
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
    setIsMarketModalVisible(true);
  };

  const handleSelectMarketAgent = async (agent: AIAgent) => {
    // 招募逻辑已经在 AIAgentMarketModal 中处理
    // 这里只需要关闭模态框并刷新列表
    setIsMarketModalVisible(false);
    fetchAgents();
  };

  return (
    <Container>
      <Header>
        <ActionButton
          type="default"
          icon={<UsergroupAddOutlined />}
          onClick={handleRecruit}
        >
          <FormattedMessage id="aiAgentList.recruitAgent" defaultMessage="招募助手" />
        </ActionButton>
        <ActionButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddAgent}
        >
          <FormattedMessage id="aiAgentList.addNewAgent" defaultMessage="新增助手" />
        </ActionButton>
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
          locale={{ 
            emptyText: intl.formatMessage({ 
              id: 'aiAgentList.emptyText', 
              defaultMessage: '暂无AI助手，点击上方按钮添加' 
            }) 
          }}
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

      <AIAgentMarketModal
        visible={isMarketModalVisible}
        onCancel={() => setIsMarketModalVisible(false)}
        onSelect={handleSelectMarketAgent}
      />
    </Container>
  );
});

AIAgentListTab.displayName = 'AIAgentListTab';

export default AIAgentListTab; 