import React from 'react';
import { Table, Input, Switch, Button, Popconfirm, Space, Tag } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ProjectAgent } from '../../../../types';

interface AgentTableProps {
  projectAgents: ProjectAgent[];
  loading: boolean;
  onUpdateAgentSettings: (agent: ProjectAgent, field: string, value: any) => void;
  onRemoveAgent: (agentId: number) => void;
}

const AgentTag = styled(Tag)`
  margin-right: 0;
`;

const AgentTable: React.FC<AgentTableProps> = ({
  projectAgents,
  loading,
  onUpdateAgentSettings,
  onRemoveAgent,
}) => {
  const columns = [
    {
      title: '员工信息',
      dataIndex: 'agentName',
      key: 'agentName',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <Space>
            <RobotOutlined style={{ color: 'var(--ant-color-primary)' }} />
            <span style={{ fontWeight: 'bold' }}>{text}</span>
          </Space>
          <Space size={4} style={{ marginLeft: 22 }}>
            <AgentTag color="blue">{record.role}</AgentTag>
            <AgentTag>{record.modelType}</AgentTag>
          </Space>
        </Space>
      ),
      width: 220,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: number, record: any) => (
        <Input
          type="number"
          min={1}
          max={10}
          defaultValue={priority}
          onChange={(e) => onUpdateAgentSettings(record, 'priority', parseInt(e.target.value))}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 80,
      render: (temperature: number | null, record: any) => (
        <Input
          type="number"
          min={0}
          max={1}
          step={0.1}
          placeholder="默认"
          defaultValue={temperature || ''}
          onChange={(e) => {
            const value = e.target.value ? parseFloat(e.target.value) : null;
            onUpdateAgentSettings(record, 'temperature', value);
          }}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: '最大Token',
      dataIndex: 'maxTokens',
      key: 'maxTokens',
      width: 100,
      render: (maxTokens: number | null, record: any) => (
        <Input
          type="number"
          min={1}
          placeholder="默认"
          defaultValue={maxTokens || ''}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value) : null;
            onUpdateAgentSettings(record, 'maxTokens', value);
          }}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: '记忆',
      dataIndex: 'enableMemory',
      key: 'enableMemory',
      width: 80,
      render: (enabled: boolean, record: any) => (
        <Switch
          checked={enabled}
          onChange={(checked) => onUpdateAgentSettings(record, 'enableMemory', checked)}
        />
      ),
    },
    {
      title: '知识库',
      dataIndex: 'enableRag',
      key: 'enableRag',
      width: 80,
      render: (enabled: boolean, record: any) => (
        <Switch
          checked={enabled}
          onChange={(checked) => onUpdateAgentSettings(record, 'enableRag', checked)}
        />
      ),
    },
    {
      title: '外部工具',
      dataIndex: 'enableExternal',
      key: 'enableExternal',
      width: 80,
      render: (enabled: boolean, record: any) => (
        <Switch
          checked={enabled}
          onChange={(checked) => onUpdateAgentSettings(record, 'enableExternal', checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
        <Popconfirm
          title="确定要移除此员工吗？"
          onConfirm={() => onRemoveAgent(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="text"
            danger
          >
            移除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      dataSource={projectAgents}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={false}
      size="middle"
      scroll={{ x: 'max-content', y: 400 }}
      locale={{ emptyText: '暂无员工，请添加员工到项目中' }}
    />
  );
};

export default AgentTable; 