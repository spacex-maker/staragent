import React from 'react';
import { Modal, Form, Tabs, message } from 'antd';
import { Project } from '../../../types';
import BasicInfoForm from './BasicInfo/BasicInfoForm';
import AgentList from './AgentManagement/AgentList';

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

  React.useEffect(() => {
    if (visible && project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        visibility: project.visibility,
        industries: project.industries
      });
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
          visibility: values.visibility,
          industryIds: industryIds,
          status: project.isActive
        };
        
        await onProjectUpdate(project.id, updateData);
        message.success('更新项目成功');
        onSuccess();
      } catch (error) {
        console.error('更新项目错误:', error);
        message.error('更新项目失败');
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
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
            <BasicInfoForm
              form={form}
              initialValues={project}
            />
          )
        },
        {
          key: 'agents',
          label: '员工管理',
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