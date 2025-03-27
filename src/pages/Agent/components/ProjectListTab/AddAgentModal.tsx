import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Space, message, Tag, Tooltip } from 'antd';
import { SearchOutlined, RobotOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AIAgent } from '../../types';
import instance from '../../../../api/axios';

const { Search } = Input;

const SearchContainer = styled.div`
  margin-bottom: 16px;
`;

const AgentTag = styled(Tag)`
  margin-right: 0;
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
        message.error(response.data.message || '获取员工列表失败');
      }
    } catch (error) {
      console.error('获取员工列表错误:', error);
      message.error('获取员工列表失败，请稍后重试');
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
      message.warning('请至少选择一名员工');
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
          message.error(response.data.message || '添加员工失败');
        }
      } catch (error: any) {
        failCount++;
        if (error.response && error.response.data) {
          message.error(error.response.data.message || '添加员工失败，请稍后重试');
        } else {
          message.error('添加员工失败，请稍后重试');
        }
        console.error('添加员工到项目错误:', error);
      }
    }
    
    if (successCount > 0) {
      message.success(`成功添加 ${successCount} 名员工`);
    }
    
    if (successCount > 0 && failCount === 0) {
      onSuccess();
    }
    
    setConfirmLoading(false);
  };

  const columns = [
    {
      title: '员工信息',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: AIAgent) => (
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <Space>
            <RobotOutlined style={{ color: 'var(--ant-color-primary)' }} />
            <span style={{ fontWeight: 'bold' }}>{text}</span>
          </Space>
          <Space size={4} style={{ marginLeft: 22 }}>
            {record.roles.map((role, index) => (
              <AgentTag key={index} color="blue">{role}</AgentTag>
            ))}
            <AgentTag>{record.modelType}</AgentTag>
          </Space>
        </Space>
      ),
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
  ];

  return (
    <Modal
      title="添加员工到项目"
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="add"
          type="primary"
          loading={confirmLoading}
          onClick={handleAddAgents}
          disabled={selectedAgentIds.length === 0}
        >
          添加所选员工
        </Button>,
      ]}
    >
      <Tooltip title="选择要添加到项目的员工，可以通过搜索快速找到员工">
        <InfoCircleOutlined style={{ marginRight: 8 }} />
        <span>请选择要添加到项目的员工</span>
      </Tooltip>

      <SearchContainer>
        <Search
          placeholder="搜索员工名称、角色或模型"
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