import React from 'react';
import { Table, Input, Switch, Button, Popconfirm, Space, Tag, Avatar } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ProjectAgent } from '../../../../types';
import { FormattedMessage, useIntl } from 'react-intl';

interface AgentTableProps {
  projectAgents: ProjectAgent[];
  loading: boolean;
  onUpdateAgentSettings: (agent: ProjectAgent, field: string, value: any) => void;
  onRemoveAgent: (agentId: number) => void;
}

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

const AgentTable: React.FC<AgentTableProps> = ({
  projectAgents,
  loading,
  onUpdateAgentSettings,
  onRemoveAgent,
}) => {
  const intl = useIntl();
  
  const columns = [
    {
      title: intl.formatMessage({ id: 'project.addAgent.info', defaultMessage: '员工信息' }),
      dataIndex: 'agentName',
      key: 'agentName',
      render: (text: string, record: ProjectAgent) => (
        <AgentInfoContainer>
          <AgentAvatar
            src={record.avatarUrl}
            icon={!record.avatarUrl && <RobotOutlined />}
          />
          <AgentDetails>
            <AgentName>{text}</AgentName>
            <TagsContainer>
              <AgentTag color="blue">{record.role}</AgentTag>
              <AgentTag>{record.modelType}</AgentTag>
            </TagsContainer>
          </AgentDetails>
        </AgentInfoContainer>
      ),
      width: 280,
    },
    {
      title: intl.formatMessage({ id: 'agent.priority', defaultMessage: '优先级' }),
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
      title: intl.formatMessage({ id: 'agent.detail.temperature', defaultMessage: '温度' }),
      dataIndex: 'temperature',
      key: 'temperature',
      width: 80,
      render: (temperature: number | null, record: any) => (
        <Input
          type="number"
          min={0}
          max={1}
          step={0.1}
          placeholder={intl.formatMessage({ id: 'agent.default', defaultMessage: '默认' })}
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
      title: intl.formatMessage({ id: 'agent.detail.maxTokens', defaultMessage: '最大Token' }),
      dataIndex: 'maxTokens',
      key: 'maxTokens',
      width: 100,
      render: (maxTokens: number | null, record: any) => (
        <Input
          type="number"
          min={1}
          placeholder={intl.formatMessage({ id: 'agent.default', defaultMessage: '默认' })}
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
      title: intl.formatMessage({ id: 'agent.memory', defaultMessage: '记忆' }),
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
      title: intl.formatMessage({ id: 'agent.knowledgeBase', defaultMessage: '知识库' }),
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
      title: intl.formatMessage({ id: 'agent.externalTools', defaultMessage: '外部工具' }),
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
      title: intl.formatMessage({ id: 'common.actions', defaultMessage: '操作' }),
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
        <Popconfirm
          title={intl.formatMessage({ id: 'project.agent.confirmRemove', defaultMessage: '确定要移除此员工吗？' })}
          onConfirm={() => onRemoveAgent(record.id)}
          okText={intl.formatMessage({ id: 'common.confirm', defaultMessage: '确定' })}
          cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: '取消' })}
        >
          <Button
            type="text"
            danger
          >
            <FormattedMessage id="common.remove" defaultMessage="移除" />
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
      locale={{ 
        emptyText: intl.formatMessage({ id: 'project.agent.empty', defaultMessage: '暂无员工，请添加员工到项目中' }) 
      }}
    />
  );
};

export default AgentTable; 