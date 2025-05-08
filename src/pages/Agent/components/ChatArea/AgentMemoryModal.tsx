import React, { useState, useEffect } from 'react';
import { Modal, Input, List, Empty, Spin, Typography, Tag, Button, Space, Avatar } from 'antd';
import { SearchOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import instance from 'api/axios';

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

const MemoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ant-color-text-secondary);
  font-size: 12px;
`;

const RelevanceTag = styled(Tag)<{ $importance: number }>`
  background: ${props => {
    if (props.$importance >= 0.8) return props.theme.mode === 'dark' ? '#064e3b' : '#ecfdf5';
    if (props.$importance >= 0.5) return props.theme.mode === 'dark' ? '#1e3a8a' : '#eff6ff';
    if (props.$importance >= 0.3) return props.theme.mode === 'dark' ? '#783c00' : '#fffbeb';
    return props.theme.mode === 'dark' ? '#7f1d1d' : '#fef2f2';
  }};
  color: ${props => {
    if (props.$importance >= 0.8) return props.theme.mode === 'dark' ? '#10b981' : '#047857';
    if (props.$importance >= 0.5) return props.theme.mode === 'dark' ? '#3b82f6' : '#1d4ed8';
    if (props.$importance >= 0.3) return props.theme.mode === 'dark' ? '#f59e0b' : '#b45309';
    return props.theme.mode === 'dark' ? '#ef4444' : '#b91c1c';
  }};
  border: 1px solid ${props => {
    if (props.$importance >= 0.8) return props.theme.mode === 'dark' ? '#059669' : '#6ee7b7';
    if (props.$importance >= 0.5) return props.theme.mode === 'dark' ? '#2563eb' : '#93c5fd';
    if (props.$importance >= 0.3) return props.theme.mode === 'dark' ? '#d97706' : '#fcd34d';
    return props.theme.mode === 'dark' ? '#dc2626' : '#fca5a5';
  }};
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AgentAvatar = styled(Avatar)`
  flex-shrink: 0;
`;

interface Memory {
  id: string;
  agentId: number;
  memoryType: string;
  content: string;
  context: string | null;
  timestamp: string;
  tags: string[] | null;
  connections: any[] | null;
  createTime: string | null;
  updateTime: string | null;
  agentName: string;
  importance: number;
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
}) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
      console.error('Failed to fetch memories:', error);
    } finally {
      setLoading(false);
    }
  };

  // 在模态框打开时加载初始数据
  useEffect(() => {
    if (open) {
      fetchMemories('');
    }
    return () => {
      if (!open) {
        setSearchValue('');
        setMemories([]);
      }
    };
  }, [open]);

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

  return (
    <Modal
      title={
        <AgentHeader>
          {agent.avatarUrl ? (
            <AgentAvatar src={agent.avatarUrl} size={32} />
          ) : (
            <AgentAvatar icon={<UserOutlined />} size={32} />
          )}
          <span>{`${agent.agentName}的记忆库`}</span>
        </AgentHeader>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
    >
      <SearchContainer>
        <SearchInput
          placeholder="搜索记忆内容..."
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
            查询
          </SearchButton>
          <SearchButton 
            onClick={handleClear}
            disabled={loading || (!searchValue && memories.length === 0)}
          >
            清空
          </SearchButton>
        </Space>
      </SearchContainer>
      
      <Spin spinning={loading}>
        {memories.length > 0 ? (
          <MemoryList
            dataSource={memories}
            renderItem={(memory: Memory) => (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <MemoryContent>{memory.content}</MemoryContent>
                  <MemoryMeta>
                    <ClockCircleOutlined />
                    <span>{memory.timestamp}</span>
                    {memory.importance > 0 && (
                      <RelevanceTag $importance={memory.importance}>
                        相关度: {(memory.importance * 100).toFixed(0)}%
                      </RelevanceTag>
                    )}
                    {memory.tags?.map((tag, index) => (
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
              searchValue
                ? "没有找到相关记忆"
                : "暂无记忆数据"
            }
          />
        )}
      </Spin>
    </Modal>
  );
};

export default AgentMemoryModal; 