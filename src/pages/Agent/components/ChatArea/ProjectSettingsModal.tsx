import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Table, Space, Button, Switch, Tooltip, Form, Avatar, Radio, Spin, message } from 'antd';
import { RobotOutlined, CloudSyncOutlined, SettingOutlined, InfoCircleOutlined, DollarOutlined, KeyOutlined, UserOutlined, ApiOutlined, BulbOutlined, CommentOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ProjectAgent } from '../../types';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../../../../api/axios';

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
  color: var(--ant-color-text-secondary);
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

const ReplyModeCard = styled(Radio.Button)<{ $selected?: boolean }>`
  display: block;
  width: 100%;
  height: auto;
  padding: 12px;
  margin-bottom: 10px;
  text-align: left;
  border-radius: 12px !important;
  transition: all 0.3s;
  box-shadow: ${props => props.$selected ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'none'};
  border: 1px solid ${props => props.$selected ? 'var(--ant-color-primary)' : 'var(--ant-color-border)'} !important;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .reply-mode-title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
    color: ${props => props.$selected ? 'var(--ant-color-primary)' : 'var(--ant-color-text)'};
  }

  .reply-mode-desc {
    color: var(--ant-color-text-secondary);
    font-size: 12px;
    line-height: 1.5;
  }
`;

const ReplyModeContainer = styled.div`
  margin-top: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

interface ReplyModeOption {
  value: string;
  label: string;
  description: string;
}

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
  const [replyModes, setReplyModes] = useState<string[]>([]);
  const [selectedReplyMode, setSelectedReplyMode] = useState("PRIORITY");
  const [loadingReplyModes, setLoadingReplyModes] = useState(false);

  // 获取回复模式列表和当前设置
  const fetchReplyModes = async () => {
    setLoadingReplyModes(true);
    try {
      // 获取可用的回复模式列表
      const response = await axios.get('/productx/user/list-reply-mode');
      if (response.data.success) {
        setReplyModes(response.data.data);
        
        // 获取当前设置的回复模式
        try {
          const currentModeResponse = await axios.get('/productx/user/get-reply-mode');
          if (currentModeResponse.data.success && currentModeResponse.data.data) {
            setSelectedReplyMode(currentModeResponse.data.data);
          }
        } catch (error) {
          console.error(intl.formatMessage({ id: 'replyMode.getCurrentFailed', defaultMessage: '获取当前回复模式失败:' }), error);
        }
      } else {
        console.error(intl.formatMessage({ id: 'replyMode.fetchFailed', defaultMessage: '获取回复模式失败:' }), response.data.message);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'replyMode.fetchError', defaultMessage: '获取回复模式接口错误:' }), error);
    } finally {
      setLoadingReplyModes(false);
    }
  };

  useEffect(() => {
    if (open) {
      // 加载回复模式
      fetchReplyModes();
      
      // 可以在这里加载其他保存的设置
      // 实际中可能从localStorage或API获取
    }
  }, [open]);

  const handleSaveSettings = async () => {
    // 保存设置到本地或发送到API
    try {
      // 发送回复模式设置到服务器
      const response = await axios.post('/productx/user/update-reply-mode', {
        replyMode: selectedReplyMode
      });
      
      if (response.data.success) {
        message.success(intl.formatMessage({ id: 'project.settings.save.success', defaultMessage: '设置保存成功' }));
      } else {
        message.error(response.data.message || intl.formatMessage({ id: 'project.settings.save.failed', defaultMessage: '设置保存失败' }));
      }
    } catch (error) {
      console.error('保存设置失败:', error);
      message.error(intl.formatMessage({ id: 'project.settings.save.error', defaultMessage: '保存设置时发生错误' }));
    }
    
    onClose();
  };

  // 获取回复模式的本地化描述
  const getReplyModeDescription = (mode: string): string => {
    const descriptions: Record<string, { id: string; defaultMessage: string }> = {
      ALL: { 
        id: 'replyMode.ALL.description', 
        defaultMessage: '所有助手同时响应用户消息，适用于需要多角度解答的场景，但可能导致信息冗余和大量token消耗。' 
      },
      PRIORITY: { 
        id: 'replyMode.PRIORITY.description', 
        defaultMessage: '由优先级最高的助手进行回复，适用于有明确职责分工的助手系统。' 
      },
      RANDOM: { 
        id: 'replyMode.RANDOM.description', 
        defaultMessage: '随机选择一个助手进行回复，适用于希望保持互动多样性的场景。' 
      },
      AI_SELECT: { 
        id: 'replyMode.AI_SELECT.description', 
        defaultMessage: '由AI系统根据上下文智能判断最合适的助手进行回复，适用于需要智能分发的复杂场景。' 
      },
      LAST_AT: { 
        id: 'replyMode.LAST_AT.description', 
        defaultMessage: '由上一次被@的助手进行回复，适用于用户希望继续与特定助手互动的场景。' 
      },
      LAST_REPLY: { 
        id: 'replyMode.LAST_REPLY.description', 
        defaultMessage: '由上一次回复用户的助手继续进行回复，适用于保持对话连贯性的场景。' 
      }
    };

    return intl.formatMessage(descriptions[mode] || { id: 'replyMode.unknown.description', defaultMessage: '暂无描述' });
  };

  // 将API返回的回复模式转换为选项格式
  const getReplyModeOptions = (): ReplyModeOption[] => {
    return replyModes.map(mode => {
      // 获取本地化的标签
      const getLabelId = (mode: string): { id: string; defaultMessage: string } => {
        switch (mode) {
          case 'ALL': return { id: 'replyMode.ALL.label', defaultMessage: '全部回复' };
          case 'PRIORITY': return { id: 'replyMode.PRIORITY.label', defaultMessage: '优先级回复' };
          case 'RANDOM': return { id: 'replyMode.RANDOM.label', defaultMessage: '随机回复' };
          case 'AI_SELECT': return { id: 'replyMode.AI_SELECT.label', defaultMessage: '智能选择' };
          case 'LAST_AT': return { id: 'replyMode.LAST_AT.label', defaultMessage: '上次@回复' };
          case 'LAST_REPLY': return { id: 'replyMode.LAST_REPLY.label', defaultMessage: '上次回复者' };
          default: return { id: 'replyMode.unknown.label', defaultMessage: mode };
        }
      };

      return {
        value: mode,
        label: intl.formatMessage(getLabelId(mode)),
        description: getReplyModeDescription(mode)
      };
    });
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

  // 渲染回复模式设置部分
  const renderReplyModeSection = () => {
    if (loadingReplyModes) {
      return (
        <LoadingContainer>
          <Spin tip={intl.formatMessage({ id: 'replyMode.loading', defaultMessage: '加载回复模式设置...' })} />
        </LoadingContainer>
      );
    }

    const options = getReplyModeOptions();

    return (
      <FormItemGroup>
        <SettingItem>
          <SettingLabel>
            <CommentOutlined /> {intl.formatMessage({ id: 'project.chatSettings.replyMode', defaultMessage: '回复模式设置' })}
          </SettingLabel>
          <SettingDescription>
            {intl.formatMessage({ id: 'project.chatSettings.replyMode.description', defaultMessage: '设置多个AI助手如何响应用户的消息' })}
          </SettingDescription>
          <ReplyModeContainer>
            <Radio.Group 
              value={selectedReplyMode}
              onChange={e => setSelectedReplyMode(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {options.map(option => (
                  <ReplyModeCard 
                    key={option.value} 
                    value={option.value}
                    $selected={selectedReplyMode === option.value}
                  >
                    <div className="reply-mode-title">{option.label}</div>
                    <div className="reply-mode-desc">{option.description}</div>
                  </ReplyModeCard>
                ))}
              </Space>
            </Radio.Group>
          </ReplyModeContainer>
        </SettingItem>
      </FormItemGroup>
    );
  };

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
                    <InfoCircleOutlined style={{ color: 'var(--ant-color-text-secondary)' }} />
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
    {
      key: 'replyMode',
      label: (
        <span>
          <CommentOutlined /> {intl.formatMessage({ id: 'replyMode.tab.label', defaultMessage: '回复模式' })}
        </span>
      ),
      children: (
        <div style={{ padding: '16px 0' }}>
          {renderReplyModeSection()}
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