import React, { useState, useEffect } from 'react';
import { Modal, Tabs, List, Input, Button, Row, Col, Empty, Spin, message, Typography } from 'antd';
import { SearchOutlined, QuestionCircleOutlined, ReloadOutlined, TeamOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../../../../api/axios';
import { AIAgent } from '../../types';
import MarketAIAgentItem from './MarketAIAgentItem';
import ModelSelector from '../ModelSelector';
import RoleSelector from '../RoleSelector';

const { TabPane } = Tabs;
const { confirm } = Modal;
const { Text } = Typography;

const FilterContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background: var(--ant-color-bg-container-disabled);
  border-radius: 8px;
`;

const StyledRow = styled(Row)`
  margin-bottom: 16px;
  
  .ant-col {
    display: flex;
    align-items: center;
  }
  
  .input-wrapper, .selector-wrapper {
    width: 100%;
  }
  
  .buttons-wrapper {
    display: flex;
    gap: 8px;
    justify-content: flex-start;
  }
`;

const ListContainer = styled.div`
  height: 60vh;
  overflow-y: auto;
  padding: 8px 12px;
  position: relative;
  
  .ant-list {
    overflow: visible;
  }
  
  .ant-list-item {
    overflow: visible;
  }
  
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

const TotalCountFooter = styled.div`
  padding: 12px 0;
  text-align: right;
  border-top: 1px solid var(--ant-color-border);
  margin-top: 16px;
  color: var(--ant-color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
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
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('official');
  const [loading, setLoading] = useState(false);
  const [recruitLoading, setRecruitLoading] = useState(false);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [searchInput, setSearchInput] = useState('');
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
      console.error(intl.formatMessage({ id: 'aiAgent.market.fetchError' }), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && activeTab === 'official') {
      fetchOfficialAgents();
    }
  }, [visible, activeTab]);

  const handleSearch = () => {
    setSearchName(searchInput);
    fetchOfficialAgents();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleRoleChange = (value: string[]) => {
    setSelectedRole(value);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  const handleRecruitAgent = async (agent: AIAgent) => {
    confirm({
      title: intl.formatMessage({ id: 'aiAgent.market.confirmRecruit.title' }),
      icon: <QuestionCircleOutlined />,
      content: intl.formatMessage(
        { id: 'aiAgent.market.confirmRecruit.content' },
        { name: agent.name }
      ),
      okText: intl.formatMessage({ id: 'aiAgent.market.confirmRecruit.ok' }),
      cancelText: intl.formatMessage({ id: 'aiAgent.market.confirmRecruit.cancel' }),
      onOk: async () => {
        try {
          setRecruitLoading(true);
          await axios.post('/productx/sa-ai-agent/copy', {
            aiAgentId: agent.id
          });
          
          onSelect?.(agent);
        } catch (error) {
          console.error(intl.formatMessage({ id: 'aiAgent.market.recruitError' }), error);
        } finally {
          setRecruitLoading(false);
        }
      }
    });
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchName('');
    setSelectedRole([]);
    setSelectedModel(undefined);
    fetchOfficialAgents();
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'aiAgent.market.title' })}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={intl.formatMessage({ id: 'aiAgent.market.tab.official' })} key="official">
          <FilterContainer>
            <StyledRow gutter={16}>
              <Col span={14}>
                <div className="input-wrapper">
                  <Input
                    placeholder={intl.formatMessage({ id: 'aiAgent.market.search.placeholder' })}
                    prefix={<SearchOutlined />}
                    value={searchInput}
                    onChange={handleInputChange}
                    onPressEnter={handleSearch}
                    allowClear
                    style={{ borderRadius: '20px', width: '100%' }}
                  />
                </div>
              </Col>
              <Col span={10}>
                <div className="buttons-wrapper">
                  <Button 
                    type="primary" 
                    onClick={handleSearch} 
                    icon={<SearchOutlined />}
                    loading={loading}
                  >
                    <FormattedMessage id="aiAgent.market.search.button" />
                  </Button>
                  <Button 
                    onClick={handleReset}
                    icon={<ReloadOutlined />}
                  >
                    <FormattedMessage id="aiAgent.market.reset.button" />
                  </Button>
                </div>
              </Col>
            </StyledRow>
            
            <StyledRow gutter={16}>
              <Col span={12}>
                <div className="selector-wrapper">
                  <RoleSelector
                    value={selectedRole}
                    onChange={handleRoleChange}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div className="selector-wrapper">
                  <ModelSelector
                    value={selectedModel}
                    onChange={handleModelChange}
                  />
                </div>
              </Col>
            </StyledRow>
          </FilterContainer>

          <ListContainer>
            <Spin spinning={loading}>
              {agents.length > 0 ? (
                <>
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
                  <TotalCountFooter>
                    <TeamOutlined />
                    <Text type="secondary">
                      <FormattedMessage 
                        id="aiAgent.market.total" 
                        values={{ count: agents.length }} 
                      />
                    </Text>
                  </TotalCountFooter>
                </>
              ) : (
                <Empty description={intl.formatMessage({ id: 'aiAgent.market.empty' })} />
              )}
            </Spin>
          </ListContainer>
        </TabPane>
        
        <TabPane tab={intl.formatMessage({ id: 'aiAgent.market.tab.shared' })} key="shared">
          <Empty description={intl.formatMessage({ id: 'aiAgent.market.comingSoon' })} />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default AIAgentMarketModal; 