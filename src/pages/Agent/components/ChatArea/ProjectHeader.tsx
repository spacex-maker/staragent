import React, { useState } from 'react';
import { Typography, Dropdown, Button, Space, Table, Avatar, Switch, Tooltip, Modal, List } from 'antd';
import { ProjectOutlined, EllipsisOutlined, RobotOutlined, CloudSyncOutlined, SettingOutlined, UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Project, ProjectAgent } from '../../types';
import { useProjectAgents } from 'hooks/useProjectAgents';
import AgentMemoryModal from './AgentMemoryModal';
import ProjectSettingsModal from './ProjectSettingsModal';
import { FormattedMessage, useIntl } from 'react-intl';

const { Title, Text } = Typography;

const ProjectTitleBar = styled.div`
  padding: 16px;
  background: var(--ant-color-bg-container);
  border-bottom: 1px solid var(--ant-color-border);
  display: flex;
  align-items: center;
  gap: 8px;
  height: 64px;
`;

const ProjectIcon = styled.div`
  font-size: 16px;
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProjectTitle = styled(Title)`
  margin: 0 !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectDescription = styled(Text)`
  color: var(--ant-color-text-secondary);
  font-size: 12px;
  display: block;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const MoreButton = styled(Button)`
  padding: 4px 8px;
  height: 32px;
  margin-left: auto;
`;

const AgentListContainer = styled.div`
  padding: 12px;
  min-width: 400px;
  max-width: 600px;
  max-height: 500px;
  overflow: auto;
`;

const AgentTag = styled(Text)`
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  background: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
  margin-left: 8px;
`;

const AgentActionButton = styled(Button)`
  padding: 4px 8px;
  height: 24px;
  font-size: 12px;
  border-radius: 12px;
  
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;

const AgentAvatar = styled(Avatar)`
  margin-right: 8px;
`;

interface ProjectHeaderProps {
  project: Project;
  onTemporaryChange?: (isTemporary: boolean) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onTemporaryChange }) => {
  const { projectAgents, loading, fetchAgents } = useProjectAgents(project.id);
  const [selectedAgent, setSelectedAgent] = useState<ProjectAgent | null>(null);
  const [memoryModalVisible, setMemoryModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isTemporary, setIsTemporary] = useState(false);
  const [temporaryHelpVisible, setTemporaryHelpVisible] = useState(false);
  const intl = useIntl();

  const handleTemporaryChange = (checked: boolean) => {
    setIsTemporary(checked);
    onTemporaryChange?.(checked);
  };

  const handleViewMemory = (agent: ProjectAgent) => {
    setSelectedAgent(agent);
    setMemoryModalVisible(true);
  };

  const handleOpenSettings = () => {
    setSettingsModalVisible(true);
  };

  const renderFeaturesList = (items: string) => {
    return (
      <List
        dataSource={items.split('||')}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text>• {item}</Typography.Text>
          </List.Item>
        )}
      />
    );
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'project.agent.info', defaultMessage: '助手信息' }),
      dataIndex: 'agentName',
      key: 'agentName',
      render: (text: string, record: ProjectAgent) => (
        <Space direction="vertical" size={2}>
          <Space>
            {record.avatarUrl ? (
              <AgentAvatar src={record.avatarUrl} />
            ) : (
              <AgentAvatar icon={<UserOutlined />} />
            )}
            <span>{text}</span>
          </Space>
          <Space size={4} style={{ marginLeft: 38 }}>
            <AgentTag>{record.role}</AgentTag>
            <AgentTag>{record.modelType}</AgentTag>
          </Space>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'agent.priority', defaultMessage: '优先级' }),
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      align: 'center' as const,
    },
    {
      title: intl.formatMessage({ id: 'common.actions', defaultMessage: '操作' }),
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: ProjectAgent) => (
        <AgentActionButton
          type="primary"
          icon={<CloudSyncOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleViewMemory(record);
          }}
        >
          {intl.formatMessage({ id: 'agent.memory', defaultMessage: '记忆' })}
        </AgentActionButton>
      ),
    }
  ];

  const dropdownItems = [
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined /> {intl.formatMessage({ id: 'project.settings', defaultMessage: '项目设置' })}
        </span>
      ),
      onClick: handleOpenSettings,
    },
  ];

  const dropdownContent = (
    <AgentListContainer>
      <Table
        dataSource={projectAgents}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        locale={{ emptyText: intl.formatMessage({ id: 'project.agent.empty', defaultMessage: '暂无助手' }) }}
      />
    </AgentListContainer>
  );

  return (
    <>
      <ProjectTitleBar>
        <ProjectIcon>
          <ProjectOutlined />
        </ProjectIcon>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProjectTitle level={4}>{project.name}</ProjectTitle>
          {project.description && (
            <ProjectDescription>{project.description}</ProjectDescription>
          )}
        </div>
        <Space>
          <Space size="small">
            <Switch
              checkedChildren={intl.formatMessage({ id: 'chat.temporary' })}
              unCheckedChildren={intl.formatMessage({ id: 'chat.normal' })}
              checked={isTemporary}
              onChange={handleTemporaryChange}
            />
            <QuestionCircleOutlined 
              onClick={() => setTemporaryHelpVisible(true)} 
              style={{ cursor: 'pointer', fontSize: '16px' }} 
            />
          </Space>
          <Dropdown
            menu={{
              items: dropdownItems,
            }}
            trigger={['click']}
          >
            <MoreButton type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      </ProjectTitleBar>

      <Modal
        title={intl.formatMessage({ id: 'chat.temporary.modal.title' })}
        open={temporaryHelpVisible}
        onCancel={() => setTemporaryHelpVisible(false)}
        footer={null}
        width={500}
      >
        <Typography.Paragraph>
          {intl.formatMessage({ id: 'chat.temporary.modal.description' })}
        </Typography.Paragraph>
        
        {renderFeaturesList(intl.formatMessage({ id: 'chat.temporary.modal.features' }))}
        
        <Typography.Title level={5} style={{ marginTop: 16 }}>
          {intl.formatMessage({ id: 'chat.temporary.modal.scenarios.title' })}
        </Typography.Title>
        
        {renderFeaturesList(intl.formatMessage({ id: 'chat.temporary.modal.scenarios' }))}
        
        <Typography.Paragraph type="secondary" style={{ marginTop: 16 }}>
          {intl.formatMessage({ id: 'chat.temporary.modal.tip' })}
        </Typography.Paragraph>
      </Modal>

      {selectedAgent && (
        <AgentMemoryModal
          open={memoryModalVisible}
          onClose={() => setMemoryModalVisible(false)}
          agent={{
            agentId: selectedAgent.agentId,
            agentName: selectedAgent.agentName,
            avatarUrl: selectedAgent.avatarUrl
          }}
        />
      )}

      <ProjectSettingsModal
        open={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        projectAgents={projectAgents}
        loading={loading}
        onViewMemory={handleViewMemory}
      />
    </>
  );
};

export default ProjectHeader; 