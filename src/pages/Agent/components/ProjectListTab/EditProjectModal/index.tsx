import React from 'react';
import { Modal, Form, Tabs, message } from 'antd';
import { Project } from '../../../types';
import BasicInfoForm from './BasicInfo/BasicInfoForm';
import AgentList from './AgentManagement/AgentList';
import { FormattedMessage, useIntl } from 'react-intl';

interface EditProjectModalProps {
  visible: boolean;
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
  onProjectUpdate: (projectId: string, project: Partial<Project>) => Promise<void>;
  onAgentsChange?: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  visible,
  project,
  onSuccess,
  onCancel,
  onProjectUpdate,
  onAgentsChange,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('basic');
  const intl = useIntl();

  React.useEffect(() => {
    if (visible && project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        visibility: project.visibility === 'public',
        industries: project.industries,
        status: project.status
      });
      
      // 同时设置隐藏字段的值
      form.setFieldValue('visibilityValue', project.visibility);
    }
  }, [visible, project, form]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      try {
        // 将级联选择器的值转换为ID数组
        const industryIds = values.industryIds.map((path: number[]) => {
          // 获取每个选择路径的最后一个ID
          return path[path.length - 1];
        });

        const updateData = {
          id: project.id,
          name: values.name,
          description: values.description,
          // 使用保存的字符串值而不是布尔值
          visibility: values.visibilityValue || (values.visibility ? 'public' : 'private'),
          industryIds: industryIds,
          status: values.status
        };
        
        await onProjectUpdate(project.id, updateData);
        message.success(intl.formatMessage({ id: 'project.update.success', defaultMessage: '更新项目成功' }));
        onSuccess();
      } catch (error) {
        console.error('更新项目错误:', error);
        message.error(intl.formatMessage({ id: 'project.update.error', defaultMessage: '更新项目失败' }));
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<FormattedMessage id="project.edit" defaultMessage="编辑项目" />}
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
          label: intl.formatMessage({ id: 'project.basicInfo', defaultMessage: '基本信息' }),
          children: (
            <BasicInfoForm
              form={form}
              initialValues={{
                ...project,
                createdAt: project.createdAt
              }}
            />
          )
        },
        {
          key: 'agents',
          label: intl.formatMessage({ id: 'project.agentManagement', defaultMessage: '员工管理' }),
          children: (
            <AgentList
              projectId={project.id}
              onAddAgent={() => {}}
              onAgentsChange={onAgentsChange}
            />
          )
        }
      ]} />
    </Modal>
  );
};

export default EditProjectModal; 