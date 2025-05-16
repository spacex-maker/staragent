import React, { useState } from 'react';
import { Table, Input, Switch, Button, Popconfirm, Space, Tag, Avatar } from 'antd';
import { RobotOutlined, CloudSyncOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ProjectAgent } from '../../../../types';
import { FormattedMessage, useIntl } from 'react-intl';
import AgentMemoryModal from '../../../ChatArea/AgentMemoryModal';

interface AgentTableProps {
  projectAgents: ProjectAgent[];
  loading: boolean;
  onUpdateAgentSettings: (agent: ProjectAgent, field: string, value: any) => void;
  onRemoveAgent: (agentId: number) => void;
}

const AgentTag = styled(Tag)`
  margin: 0;
`;

const ModelTag = styled(Tag)`
  margin: 0;
  background-color: var(--ant-color-magenta-2);
  color: var(--ant-color-magenta-7);
  border-color: var(--ant-color-magenta-3);
  font-weight: 500;
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
  gap: 12px;
  padding: 4px 0;
`;

const AgentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AgentName = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: var(--ant-color-text);
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  margin-top: 4px;
  align-items: center;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`;

const SettingLabel = styled.span`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  flex-shrink: 0;
`;

const ActionButton = styled(Button)`
  padding: 0 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  
  .anticon {
    margin-right: 4px;
  }
`;

const RemoveButton = styled(Button)`
  padding: 0 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  border-radius: 12px;
`;

// 根据模型类型选择颜色
const getModelTagColor = (modelType: string): string => {
  const lowerCaseType = modelType.toLowerCase();
  if (lowerCaseType.includes('gpt-4')) return 'purple';
  if (lowerCaseType.includes('gpt-3')) return 'magenta';
  if (lowerCaseType.includes('claude')) return 'cyan';
  if (lowerCaseType.includes('gemini')) return 'blue';
  if (lowerCaseType.includes('grok')) return 'orange';
  if (lowerCaseType.includes('deepseek')) return 'green';
  if (lowerCaseType.includes('llama')) return 'gold';
  return 'default';
};

const AgentTable: React.FC<AgentTableProps> = ({
  projectAgents,
  loading,
  onUpdateAgentSettings,
  onRemoveAgent,
}) => {
  const intl = useIntl();
  const [memoryModalVisible, setMemoryModalVisible] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<ProjectAgent | null>(null);
  
  const handleViewMemory = (agent: ProjectAgent) => {
    setSelectedAgent(agent);
    setMemoryModalVisible(true);
  };

  const handleCloseMemoryModal = () => {
    setMemoryModalVisible(false);
    setSelectedAgent(null);
  };
  
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
              <ModelTag color={getModelTagColor(record.modelType)}>{record.modelType}</ModelTag>
            </TagsContainer>
            
            <SettingsContainer>
              <SettingItem>
                <SettingLabel>{intl.formatMessage({ id: 'agent.priority', defaultMessage: '优先级' })}:</SettingLabel>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={record.priority}
                  onChange={(e) => onUpdateAgentSettings(record, 'priority', parseInt(e.target.value))}
                  style={{ width: 50 }}
                  size="small"
                />
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>{intl.formatMessage({ id: 'agent.detail.temperature', defaultMessage: '温度' })}:</SettingLabel>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  placeholder={intl.formatMessage({ id: 'agent.default', defaultMessage: '默认' })}
                  defaultValue={record.temperature || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : null;
                    onUpdateAgentSettings(record, 'temperature', value);
                  }}
                  style={{ width: 50 }}
                  size="small"
                />
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>{intl.formatMessage({ id: 'agent.detail.maxTokens', defaultMessage: '最大Token' })}:</SettingLabel>
                <Input
                  type="number"
                  min={1}
                  placeholder={intl.formatMessage({ id: 'agent.default', defaultMessage: '默认' })}
                  defaultValue={record.maxTokens || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : null;
                    onUpdateAgentSettings(record, 'maxTokens', value);
                  }}
                  style={{ width: 65 }}
                  size="small"
                />
              </SettingItem>
            </SettingsContainer>
          </AgentDetails>
        </AgentInfoContainer>
      ),
      width: 380,
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
      width: 160,
      render: (_: any, record: ProjectAgent) => (
        <Space>
          <ActionButton
            type="primary"
            size="small"
            icon={<CloudSyncOutlined />}
            onClick={() => handleViewMemory(record)}
          >
            <FormattedMessage id="agent.memory" defaultMessage="记忆" />
          </ActionButton>
          <Popconfirm
            title={intl.formatMessage({ id: 'project.agent.confirmRemove', defaultMessage: '确定要移除此员工吗？' })}
            onConfirm={() => onRemoveAgent(record.id)}
            okText={intl.formatMessage({ id: 'common.confirm', defaultMessage: '确定' })}
            cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: '取消' })}
          >
            <RemoveButton
              type="text"
              danger
              size="small"
            >
              <FormattedMessage id="common.remove" defaultMessage="移除" />
            </RemoveButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
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
      
      {selectedAgent && (
        <AgentMemoryModal
          open={memoryModalVisible}
          onClose={handleCloseMemoryModal}
          agent={{
            agentId: selectedAgent.agentId,
            agentName: selectedAgent.agentName,
            avatarUrl: selectedAgent.avatarUrl
          }}
        />
      )}
    </>
  );
};

export default AgentTable; 