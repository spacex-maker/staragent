import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Space, message, Tag, Tooltip, Avatar } from 'antd';
import { SearchOutlined, RobotOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AIAgent } from '../../types';
import instance from '../../../../api/axios';
import { FormattedMessage, useIntl } from 'react-intl';

const { Search } = Input;

const SearchContainer = styled.div`
  margin-bottom: 16px;
`;

const AgentTag = styled(Tag)`
  margin: 0;
`;

const AgentAvatar = styled(Avatar)`
  border: 2px solid var(--ant-color-primary);
  background: var(--ant-color-bg-container);
  color: var(--ant-color-primary);
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  
  .anticon {
    font-size: 20px;
  }

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;

const AgentInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
`;

const AgentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AgentName = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: var(--ant-color-text);
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 6px;
`;

interface AddAgentModalProps {
  visible: boolean;
  projectId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({
  visible,
  projectId,
  onCancel,
  onSuccess,
}) => {
  const intl = useIntl();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchAgents();
    } else {
      setSearchValue('');
      setSelectedAgentIds([]);
    }
  }, [visible]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/productx/sa-ai-agent/list');
      if (response.data.success) {
        setAgents(response.data.data);
      } else {
        message.error(response.data.message || intl.formatMessage({ id: 'project.addAgent.failed', defaultMessage: '获取员工列表失败' }));
      }
    } catch (error) {
      console.error('获取员工列表错误:', error);
      message.error(intl.formatMessage({ id: 'project.addAgent.failed', defaultMessage: '获取员工列表失败，请稍后重试' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    agent.roles.some(role => role.toLowerCase().includes(searchValue.toLowerCase())) ||
    agent.modelType.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAddAgents = async () => {
    if (selectedAgentIds.length === 0) {
      message.warning(intl.formatMessage({ id: 'project.addAgent.selectAtLeast', defaultMessage: '请至少选择一名员工' }));
      return;
    }

    setConfirmLoading(true);
    
    let successCount = 0;
    let failCount = 0;
    
    // 逐个添加员工
    for (const agentId of selectedAgentIds) {
      try {
        const response = await instance.post('/productx/sa-ai-agent-project/create', {
          projectId: parseInt(projectId),
          agentId,
          priority: 1, // 默认优先级
          enableMemory: true,
          enableRag: true,
          enableExternal: false,
          temperature: null, // 使用员工默认设置
          maxTokens: null // 使用员工默认设置
        });
        
        if (response.data.success) {
          successCount++;
        } else {
          failCount++;
          message.error(response.data.message || intl.formatMessage({ id: 'project.addAgent.failed', defaultMessage: '添加员工失败' }));
        }
      } catch (error: any) {
        failCount++;
        if (error.response && error.response.data) {
          message.error(error.response.data.message || intl.formatMessage({ id: 'project.addAgent.failed', defaultMessage: '添加员工失败，请稍后重试' }));
        } else {
          message.error(intl.formatMessage({ id: 'project.addAgent.failed', defaultMessage: '添加员工失败，请稍后重试' }));
        }
        console.error('添加员工到项目错误:', error);
      }
    }
    
    if (successCount > 0) {
      message.success(intl.formatMessage(
        { id: 'project.addAgent.success', defaultMessage: '成功添加 {count} 名员工' },
        { count: successCount }
      ));
    }
    
    if (successCount > 0 && failCount === 0) {
      onSuccess();
    }
    
    setConfirmLoading(false);
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'project.addAgent.info', defaultMessage: '员工信息' }),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: AIAgent) => (
        <AgentInfoContainer>
          <AgentAvatar
            src={record.avatarUrl}
            icon={!record.avatarUrl && <RobotOutlined />}
          />
          <AgentDetails>
            <AgentName>{text}</AgentName>
            <TagsContainer>
              {record.roles.map((role, index) => (
                <AgentTag key={index} color="blue">{role}</AgentTag>
              ))}
              <AgentTag>{record.modelType}</AgentTag>
            </TagsContainer>
          </AgentDetails>
        </AgentInfoContainer>
      ),
      width: 250,
    },
    {
      title: intl.formatMessage({ id: 'project.addAgent.status', defaultMessage: '状态' }),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' 
            ? intl.formatMessage({ id: 'project.addAgent.enabled', defaultMessage: '启用' })
            : intl.formatMessage({ id: 'project.addAgent.disabled', defaultMessage: '禁用' })
          }
        </Tag>
      ),
    },
  ];

  return (
    <Modal
      title={intl.formatMessage({ id: 'project.addAgent', defaultMessage: '添加员工到项目' })}
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          <FormattedMessage id="project.addAgent.cancel" defaultMessage="取消" />
        </Button>,
        <Button
          key="add"
          type="primary"
          loading={confirmLoading}
          onClick={handleAddAgents}
          disabled={selectedAgentIds.length === 0}
        >
          <FormattedMessage id="project.addAgent.addSelected" defaultMessage="添加所选员工" />
        </Button>,
      ]}
    >
      <Tooltip title={intl.formatMessage({ id: 'project.addAgent.select', defaultMessage: '选择要添加到项目的员工，可以通过搜索快速找到员工' })}>
        <InfoCircleOutlined style={{ marginRight: 8 }} />
        <span>
          <FormattedMessage id="project.addAgent.select" defaultMessage="请选择要添加到项目的员工" />
        </span>
      </Tooltip>

      <SearchContainer>
        <Search
          placeholder={intl.formatMessage({ id: 'project.addAgent.search', defaultMessage: '搜索员工名称、角色或模型' })}
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
      </SearchContainer>

      <Table
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys) => {
            setSelectedAgentIds(selectedRowKeys as number[]);
          },
          selectedRowKeys: selectedAgentIds,
        }}
        dataSource={filteredAgents}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        size="middle"
      />
    </Modal>
  );
};

export default AddAgentModal; 