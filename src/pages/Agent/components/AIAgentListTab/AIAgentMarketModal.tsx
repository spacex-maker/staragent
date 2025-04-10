import React, { useState, useEffect } from 'react';
import { Modal, Tabs, List, Input, Select, Space, Empty, Spin, message } from 'antd';
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from '../../../../api/axios';
import { AIAgent } from '../../types';
import MarketAIAgentItem from './MarketAIAgentItem';
import ModelSelector from '../ModelSelector';
import RoleSelector from '../RoleSelector';

const { TabPane } = Tabs;
const { confirm } = Modal;

const FilterContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background: var(--ant-color-bg-container-disabled);
  border-radius: 8px;
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 16px;
  
  .ant-input-affix-wrapper {
    border-radius: 20px;
  }
`;

const StyledSpace = styled(Space)`
  width: 100%;
`;

const ListContainer = styled.div`
  height: 60vh;
  overflow-y: auto;
  padding: 0 4px;
  
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
`;

interface AIAgentMarketModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect?: (agent: AIAgent) => void;
}

const AIAgentMarketModal: React.FC<AIAgentMarketModalProps> = ({
  visible,
  onCancel,
  onSelect
}) => {
  const [activeTab, setActiveTab] = useState('official');
  const [loading, setLoading] = useState(false);
  const [recruitLoading, setRecruitLoading] = useState(false);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [searchName, setSearchName] = useState('');
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>();

  const fetchOfficialAgents = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (searchName) params.name = searchName;
      if (selectedRole?.length > 0) params.role = selectedRole[0];
      if (selectedModel) params.modelType = selectedModel;

      const response = await axios.get('/base/productx/sa-ai-agent/list-system', { params });
      if (response.data.success) {
        setAgents(response.data.data);
      }
    } catch (error) {
      console.error('获取官方AI员工列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && activeTab === 'official') {
      fetchOfficialAgents();
    }
  }, [visible, activeTab, searchName, selectedRole, selectedModel]);

  const handleSearch = (value: string) => {
    setSearchName(value);
  };

  const handleRoleChange = (value: string[]) => {
    setSelectedRole(value);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  const handleRecruitAgent = async (agent: AIAgent) => {
    confirm({
      title: '确认招募',
      icon: <QuestionCircleOutlined />,
      content: `确定要招募 "${agent.name}" 作为您的AI员工吗？`,
      okText: '确认招募',
      cancelText: '取消',
      onOk: async () => {
        try {
          setRecruitLoading(true);
          await axios.post('/productx/sa-ai-agent/copy', {
            aiAgentId: agent.id
          });
          
          onSelect?.(agent);
        } catch (error) {
          console.error('招募AI员工失败:', error);
        } finally {
          setRecruitLoading(false);
        }
      }
    });
  };

  return (
    <Modal
      title="AI员工市场"
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="官方AI员工" key="official">
          <FilterContainer>
            <Input
              placeholder="搜索AI员工名称"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <RoleSelector
              value={selectedRole}
              onChange={handleRoleChange}
              dropdownMatchSelectWidth={false}
            />
            <ModelSelector
              value={selectedModel}
              onChange={handleModelChange}
              dropdownMatchSelectWidth={false}
            />
          </FilterContainer>

          <ListContainer>
            <Spin spinning={loading}>
              {agents.length > 0 ? (
                <List
                  dataSource={agents}
                  renderItem={(agent) => (
                    <MarketAIAgentItem
                      agent={agent}
                      onRecruit={handleRecruitAgent}
                      loading={recruitLoading}
                    />
                  )}
                />
              ) : (
                <Empty description="暂无符合条件的AI员工" />
              )}
            </Spin>
          </ListContainer>
        </TabPane>
        
        <TabPane tab="用户共享AI员工" key="shared">
          <Empty description="即将推出，敬请期待" />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default AIAgentMarketModal; 