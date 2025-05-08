import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Table, Space, Button, Switch, Tooltip, Form, Avatar } from 'antd';
import { RobotOutlined, CloudSyncOutlined, SettingOutlined, InfoCircleOutlined, DollarOutlined, KeyOutlined, UserOutlined, ApiOutlined, BulbOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ProjectAgent } from '../../types';
import { FormattedMessage, useIntl } from 'react-intl';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    overflow: hidden;
  }
`;

const AgentTag = styled.span`
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

const SettingItem = styled.div`
  margin-bottom: 24px;
`;

const SettingLabel = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingDescription = styled.div`
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
  margin-bottom: 12px;
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormItemGroup = styled.div`
  background-color: var(--ant-color-bg-subtle);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const FormTitle = styled.div`
  font-weight: 500;
  margin-bottom: 16px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AgentAvatar = styled(Avatar)`
  margin-right: 8px;
`;

interface ProjectSettingsModalProps {
  open: boolean;
  onClose: () => void;
  projectAgents: ProjectAgent[];
  loading: boolean;
  onViewMemory: (agent: ProjectAgent) => void;
}

const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  open,
  onClose,
  projectAgents,
  loading,
  onViewMemory
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('agents');
  const [tokenDisplay, setTokenDisplay] = useState(true);
  const [costDisplay, setCostDisplay] = useState(true);
  const [enableContext, setEnableContext] = useState(true);
  const [enableMemory, setEnableMemory] = useState(true);

  useEffect(() => {
    if (open) {
      // 可以在这里加载保存的设置
      // 实际中可能从localStorage或API获取
    }
  }, [open]);

  const handleSaveSettings = () => {
    // 保存设置到本地或发送到API
    console.log('Settings saved:', {
      tokenDisplay,
      costDisplay,
      enableContext,
      enableMemory
    });
    onClose();
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
            onViewMemory(record);
          }}
        >
          {intl.formatMessage({ id: 'agent.memory', defaultMessage: '记忆' })}
        </AgentActionButton>
      ),
    }
  ];

  const items = [
    {
      key: 'agents',
      label: (
        <span>
          <RobotOutlined /> {intl.formatMessage({ id: 'agent.management', defaultMessage: '助手管理' })}
        </span>
      ),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Table
            dataSource={projectAgents}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={false}
            size="small"
            locale={{ emptyText: intl.formatMessage({ id: 'project.agent.empty', defaultMessage: '暂无助手' }) }}
          />
        </div>
      ),
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined /> {intl.formatMessage({ id: 'project.chatSettings', defaultMessage: '聊天设置' })}
        </span>
      ),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Form form={form} layout="vertical">
            <FormItemGroup>
              <SettingItem>
                <SettingLabel>
                  <KeyOutlined /> {intl.formatMessage({ id: 'project.chatSettings.tokenDisplay', defaultMessage: '显示token消耗' })}
                </SettingLabel>
                <SettingControl>
                  <Switch 
                    checked={tokenDisplay} 
                    onChange={setTokenDisplay} 
                    checkedChildren={intl.formatMessage({ id: 'common.show', defaultMessage: '显示' })} 
                    unCheckedChildren={intl.formatMessage({ id: 'common.hide', defaultMessage: '隐藏' })}
                  />
                </SettingControl>
              </SettingItem>

              <SettingItem>
                <SettingLabel>
                  <DollarOutlined /> {intl.formatMessage({ id: 'project.chatSettings.costDisplay', defaultMessage: '显示费用消耗' })}
                </SettingLabel>
                <SettingControl>
                  <Switch 
                    checked={costDisplay} 
                    onChange={setCostDisplay} 
                    checkedChildren={intl.formatMessage({ id: 'common.show', defaultMessage: '显示' })} 
                    unCheckedChildren={intl.formatMessage({ id: 'common.hide', defaultMessage: '隐藏' })}
                  />
                </SettingControl>
              </SettingItem>

              <SettingItem>
                <SettingLabel>
                  <ApiOutlined /> {intl.formatMessage({ id: 'project.chatSettings.enableContext', defaultMessage: '开启上下文' })}
                  <Tooltip title={intl.formatMessage({ id: 'project.chatSettings.enableContext.tooltip', defaultMessage: '一般用于节省token的情况' })}>
                    <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                  </Tooltip>
                </SettingLabel>
                <SettingControl>
                  <Switch 
                    checked={enableContext}
                    onChange={setEnableContext}
                    checkedChildren={intl.formatMessage({ id: 'common.on', defaultMessage: '开启' })} 
                    unCheckedChildren={intl.formatMessage({ id: 'common.off', defaultMessage: '关闭' })}
                  />
                </SettingControl>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>
                  <BulbOutlined /> {intl.formatMessage({ id: 'project.chatSettings.enableMemory', defaultMessage: '开启记忆' })}
                </SettingLabel>
                <SettingControl>
                  <Switch 
                    checked={enableMemory}
                    onChange={setEnableMemory}
                    checkedChildren={intl.formatMessage({ id: 'common.on', defaultMessage: '开启' })} 
                    unCheckedChildren={intl.formatMessage({ id: 'common.off', defaultMessage: '关闭' })}
                  />
                </SettingControl>
              </SettingItem>
            </FormItemGroup>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <StyledModal
      title={intl.formatMessage({ id: 'project.settings', defaultMessage: '项目设置' })}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {intl.formatMessage({ id: 'common.cancel', defaultMessage: '取消' })}
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveSettings}>
          {intl.formatMessage({ id: 'common.save', defaultMessage: '保存' })}
        </Button>,
      ]}
      width={700}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={items}
      />
    </StyledModal>
  );
};

export default ProjectSettingsModal; 