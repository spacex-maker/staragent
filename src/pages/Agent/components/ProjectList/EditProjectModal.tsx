import React from 'react';
import { Modal, Form, Input, Radio, Space, message, Tabs, Table, Button, Switch, Tag, Tooltip, Popconfirm } from 'antd';
import { LockOutlined, GlobalOutlined, PlusOutlined, RobotOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Project, ProjectAgent } from '../../types';
import axios from '../../../../api/axios';
import styled from 'styled-components';
import AddAgentModal from './AddAgentModal';

interface EditProjectModalProps {
  visible: boolean;
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
  onProjectUpdate: (projectId: string, project: Partial<Project>) => void;
}

const TabContainer = styled.div`
  margin-top: 8px;
  padding-bottom: 16px;
`;

const AgentListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const AgentTag = styled(Tag)`
  margin-right: 0;
`;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    transition: height 0.3s ease;
  }
`;

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  visible,
  project,
  onSuccess,
  onCancel,
  onProjectUpdate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('basic');
  const [projectAgents, setProjectAgents] = React.useState<ProjectAgent[]>([]);
  const [agentLoading, setAgentLoading] = React.useState(false);
  const [addAgentModalVisible, setAddAgentModalVisible] = React.useState(false);

  React.useEffect(() => {
    if (visible && project) {
      form.setFieldsValue(project);
      if (activeTab === 'agents') {
        fetchProjectAgents(project.id);
      }
    }
  }, [visible, project, form, activeTab]);

  const fetchProjectAgents = async (projectId: string) => {
    if (!projectId) return;
    
    setAgentLoading(true);
    try {
      const response = await axios.get(`/productx/sa-ai-agent-project/list-by-project/${projectId}`);
      if (response.data.success) {
        setProjectAgents(response.data.data);
      } else {
        message.error(response.data.message || '获取项目员工失败');
      }
    } catch (error) {
      console.error('获取项目员工错误:', error);
      message.error('获取项目员工失败，请稍后重试');
    } finally {
      setAgentLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'agents' && project) {
      fetchProjectAgents(project.id);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      try {
        const updateData = {
          id: parseInt(project.id),
          name: values.name,
          description: values.description,
          visibility: values.visibility
        };
        
        const response = await axios.post('/productx/sa-project/update', updateData);
        if (response.data.success) {
          const updatedProject = {
            ...project,
            ...values,
            updatedAt: new Date().toISOString()
          };
          onProjectUpdate(project.id, updatedProject);
          message.success('项目更新成功');
          onSuccess();
        } else {
          message.error(response.data.message || '项目更新失败');
        }
      } catch (error) {
        message.error('更新项目时发生错误');
        console.error('更新项目错误:', error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleAddAgent = () => {
    setAddAgentModalVisible(true);
  };

  const handleAddAgentSuccess = () => {
    setAddAgentModalVisible(false);
    if (project) {
      fetchProjectAgents(project.id);
    }
  };

  const handleRemoveAgent = async (recordId: number) => {
    if (!project) return;
    
    try {
      const response = await axios.delete(`/productx/sa-ai-agent-project/${recordId}`);
      
      if (response.data.success) {
        message.success('员工已从项目中移除');
        fetchProjectAgents(project.id);
      } else {
        message.error(response.data.message || '移除员工失败');
      }
    } catch (error) {
      console.error('移除员工错误:', error);
      message.error('移除员工失败，请稍后重试');
    }
  };

  const handleUpdateAgentSettings = async (record: ProjectAgent, field: string, value: any) => {
    if (!project) return;
    
    try {
      // 构建更新数据，只包含需要更新的字段
      const updateData: any = {
        id: record.id
      };
      
      // 根据字段类型设置正确的值
      if (field === 'priority') {
        updateData.priority = value;
      } else if (field === 'enableMemory') {
        updateData.enableMemory = value;
      } else if (field === 'enableRag') {
        updateData.enableRag = value;
      } else if (field === 'enableExternal') {
        updateData.enableExternal = value;
      } else if (field === 'temperature') {
        updateData.temperature = value;
      } else if (field === 'maxTokens') {
        updateData.maxTokens = value;
      }
      
      const response = await axios.post('/productx/sa-ai-agent-project/update', updateData);
      
      if (response.data.success) {
        message.success(`员工${field}设置已更新`);
        // 更新本地数据
        setProjectAgents(prev => 
          prev.map(item => 
            item.id === record.id ? { ...item, [field]: value } : item
          )
        );
      } else {
        message.error(response.data.message || `更新员工${field}设置失败`);
      }
    } catch (error) {
      console.error('更新员工设置错误:', error);
      message.error('更新员工设置失败，请稍后重试');
    }
  };

  const agentColumns = [
    {
      title: '员工信息',
      dataIndex: 'agentName',
      key: 'agentName',
      render: (text: string, record: ProjectAgent) => (
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
      render: (priority: number, record: ProjectAgent) => (
        <Input
          type="number"
          min={1}
          max={10}
          defaultValue={priority}
          onChange={(e) => handleUpdateAgentSettings(record, 'priority', parseInt(e.target.value))}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 80,
      render: (temperature: number | null, record: ProjectAgent) => (
        <Input
          type="number"
          min={0}
          max={1}
          step={0.1}
          placeholder="默认"
          defaultValue={temperature || ''}
          onChange={(e) => {
            const value = e.target.value ? parseFloat(e.target.value) : null;
            handleUpdateAgentSettings(record, 'temperature', value);
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
      render: (maxTokens: number | null, record: ProjectAgent) => (
        <Input
          type="number"
          min={1}
          placeholder="默认"
          defaultValue={maxTokens || ''}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value) : null;
            handleUpdateAgentSettings(record, 'maxTokens', value);
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
      render: (enabled: boolean, record: ProjectAgent) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleUpdateAgentSettings(record, 'enableMemory', checked)}
        />
      ),
    },
    {
      title: '知识库',
      dataIndex: 'enableRag',
      key: 'enableRag',
      width: 80,
      render: (enabled: boolean, record: ProjectAgent) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleUpdateAgentSettings(record, 'enableRag', checked)}
        />
      ),
    },
    {
      title: '外部工具',
      dataIndex: 'enableExternal',
      key: 'enableExternal',
      width: 80,
      render: (enabled: boolean, record: ProjectAgent) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleUpdateAgentSettings(record, 'enableExternal', checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: ProjectAgent) => (
        <Popconfirm
          title="确定要移除此员工吗？"
          onConfirm={() => handleRemoveAgent(record.id)}
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
    <>
      <StyledModal
        title="编辑项目"
        open={visible}
        onOk={handleOk}
        onCancel={onCancel}
        confirmLoading={loading}
        destroyOnClose
        width={900}
        footer={activeTab === 'basic' ? undefined : null}
      >
        <Tabs activeKey={activeTab} onChange={handleTabChange} items={[
          {
            key: 'basic',
            label: '基本信息',
            children: (
              <Form
                form={form}
                layout="vertical"
              >
                <Form.Item
                  name="name"
                  label="项目名称"
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Input placeholder="请输入项目名称" maxLength={50} showCount />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="项目描述"
                >
                  <Input.TextArea 
                    placeholder="请输入项目描述" 
                    maxLength={200} 
                    showCount 
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                </Form.Item>
                <Form.Item
                  name="visibility"
                  label="可见性"
                  rules={[{ required: true, message: '请选择可见性' }]}
                >
                  <Radio.Group>
                    <Radio value="private">
                      <Space>
                        <LockOutlined />
                        私有
                      </Space>
                    </Radio>
                    <Radio value="public">
                      <Space>
                        <GlobalOutlined />
                        公开
                      </Space>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            )
          },
          {
            key: 'agents',
            label: '员工管理',
            children: (
              <TabContainer>
                <AgentListHeader>
                  <div>
                    <Tooltip title="员工将按照优先级顺序参与项目，优先级越高越先响应">
                      <InfoCircleOutlined style={{ marginRight: 8 }} />
                    </Tooltip>
                    <span>项目员工列表</span>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddAgent}
                  >
                    添加员工
                  </Button>
                </AgentListHeader>
                <Table
                  dataSource={projectAgents}
                  columns={agentColumns}
                  rowKey="id"
                  loading={agentLoading}
                  pagination={false}
                  size="middle"
                  scroll={{ x: 'max-content', y: 400 }}
                  locale={{ emptyText: '暂无员工，请添加员工到项目中' }}
                />
              </TabContainer>
            )
          }
        ]} />
      </StyledModal>

      <AddAgentModal
        visible={addAgentModalVisible}
        projectId={project?.id || ''}
        onCancel={() => setAddAgentModalVisible(false)}
        onSuccess={handleAddAgentSuccess}
      />
    </>
  );
};

export default EditProjectModal; 