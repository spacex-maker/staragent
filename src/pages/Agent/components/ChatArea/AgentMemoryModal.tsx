import React, { useState, useEffect } from 'react';
import { Modal, Input, List, Empty, Spin, Typography, Tag, Button, Space, Avatar, Tabs } from 'antd';
import { SearchOutlined, ClockCircleOutlined, UserOutlined, BulbOutlined, BookOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import instance from 'api/axios';
import { FormattedMessage, useIntl } from 'react-intl';

const { Text } = Typography;

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const SearchInput = styled(Input)`
  border-radius: 20px;
  
  .ant-input {
    border-radius: 20px;
  }
  
  .ant-input-prefix {
    margin-left: 4px;
  }
`;

const SearchButton = styled(Button)`
  min-width: 80px;
  border-radius: 20px;
`;

const MemoryList = styled(List)`
  .ant-list-item {
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 8px;
    background: var(--ant-color-bg-container);
    border: 1px solid var(--ant-color-border);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.mode === 'dark' 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
        : '0 4px 12px rgba(0, 0, 0, 0.1)'};
    }
  }
`;

const MemoryContent = styled(Text)`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  display: block;
`;

const MemoryContext = styled(Text)`
  font-size: 13px;
  line-height: 1.5;
  color: var(--ant-color-text-secondary);
  margin-bottom: 8px;
  display: block;
  padding: 8px;
  background: var(--ant-color-bg-elevated);
  border-radius: 8px;
`;

const MemoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ant-color-text-secondary);
  font-size: 12px;
`;

const RelevanceTag = styled(Tag)<{ $importance: number }>`
  background: ${props => {
    if (props.$importance >= 0.8) return 'var(--ant-color-success-bg)';
    if (props.$importance >= 0.5) return 'var(--ant-color-warning-bg)';
    return 'var(--ant-color-info-bg)';
  }};
  color: ${props => {
    if (props.$importance >= 0.8) return 'var(--ant-color-success)';
    if (props.$importance >= 0.5) return 'var(--ant-color-warning)';
    return 'var(--ant-color-info)';
  }};
  border: none;
  border-radius: 10px;
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AgentAvatar = styled(Avatar)`
  border: 2px solid var(--ant-color-primary-border);
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 16px;
  }
`;

interface Memory {
  id: string;
  content: string;
  context?: string;
  timestamp: string;
  importance: number;
  tags: string;
  memoryType: string;
}

interface AgentMemoryModalProps {
  open: boolean;
  onClose: () => void;
  agent: {
    agentId: number;
    agentName: string;
    avatarUrl?: string;
  };
}

const AgentMemoryModal: React.FC<AgentMemoryModalProps> = ({
  open,
  onClose,
  agent,
}): JSX.Element => {
  const intl = useIntl();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [structuredMemories, setStructuredMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStructured, setLoadingStructured] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('vector');

  const fetchMemories = async (keyword: string) => {
    try {
      setLoading(true);
      const response = await instance.get('/productx/sa-ai-agent-memory/search', {
        params: {
          agentId: agent.agentId,
          keyWord: keyword,
          limit: 20
        }
      });
      
      if (response.data.success) {
        setMemories(response.data.data);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'memory.error.fetchVector' }), error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStructuredMemories = async () => {
    try {
      setLoadingStructured(true);
      const response = await instance.get(`/productx/sa-ai-agent-memory/list-by-agent/${agent.agentId}`);
      
      if (response.data.success) {
        setStructuredMemories(response.data.data);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'memory.error.fetchStructured' }), error);
    } finally {
      setLoadingStructured(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (activeTab === 'vector') {
        fetchMemories('');
      } else {
        fetchStructuredMemories();
      }
    }
    return () => {
      if (!open) {
        setSearchValue('');
        setMemories([]);
        setStructuredMemories([]);
      }
    };
  }, [open, activeTab]);

  const handleSearch = () => {
    fetchMemories(searchValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchValue('');
    fetchMemories('');
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const renderMemoryList = (memoryList: Memory[], isLoading: boolean) => (
    <Spin spinning={isLoading}>
      {memoryList.length > 0 ? (
        <MemoryList
          dataSource={memoryList}
          renderItem={(memory: Memory) => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <MemoryContent>{memory.content}</MemoryContent>
                {memory.context && (
                  <MemoryContext>
                    <Text type="secondary">
                      <FormattedMessage id="memory.context.label" />
                    </Text>
                    {memory.context}
                  </MemoryContext>
                )}
                <MemoryMeta>
                  <ClockCircleOutlined />
                  <span>{memory.timestamp}</span>
                  {memory.importance > 0 && (
                    <RelevanceTag $importance={memory.importance}>
                      <FormattedMessage 
                        id="memory.relevance" 
                        values={{ score: (memory.importance * 100).toFixed(0) }}
                      />
                    </RelevanceTag>
                  )}
                  {memory.memoryType && (
                    <Tag color="blue">{memory.memoryType}</Tag>
                  )}
                  {memory.tags?.split(',').filter(Boolean).map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </MemoryMeta>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description={
            activeTab === 'vector' && searchValue
              ? intl.formatMessage({ id: 'memory.empty.withSearch' })
              : intl.formatMessage({ id: 'memory.empty.noData' })
          }
        />
      )}
    </Spin>
  );

  const items = [
    {
      key: 'vector',
      label: (
        <span>
          <BulbOutlined /> <FormattedMessage id="memory.vector.tab" />
        </span>
      ),
      children: (
        <>
          <SearchContainer>
            <SearchInput
              placeholder={intl.formatMessage({ id: 'memory.search.placeholder' })}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Space>
              <SearchButton 
                type="primary"
                onClick={handleSearch}
                loading={loading}
              >
                <FormattedMessage id="memory.search.button" />
              </SearchButton>
              <SearchButton 
                onClick={handleClear}
                disabled={loading || (!searchValue && memories.length === 0)}
              >
                <FormattedMessage id="memory.clear.button" />
              </SearchButton>
            </Space>
          </SearchContainer>
          {renderMemoryList(memories, loading)}
        </>
      ),
    },
    {
      key: 'structured',
      label: (
        <span>
          <BookOutlined /> <FormattedMessage id="memory.structured.tab" />
        </span>
      ),
      children: renderMemoryList(structuredMemories, loadingStructured),
    },
  ];

  return (
    <Modal
      title={
        <AgentHeader>
          {agent.avatarUrl ? (
            <AgentAvatar src={agent.avatarUrl} size={32} />
          ) : (
            <AgentAvatar icon={<UserOutlined />} size={32} />
          )}
          <span>
            <FormattedMessage 
              id="memory.modal.title" 
              values={{ agentName: agent.agentName }}
            />
          </span>
        </AgentHeader>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
    >
      <StyledTabs 
        activeKey={activeTab}
        onChange={handleTabChange}
        items={items}
      />
    </Modal>
  );
};

export default AgentMemoryModal; 