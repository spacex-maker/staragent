import React from 'react';
import { Modal, Form, Tabs, message } from 'antd';
import styled from 'styled-components';
import axios from '../../../../../api/axios';
import BasicInfoForm from './BasicInfo/BasicInfoForm';
import AgentList from './AgentManagement/AgentList';
import { EditProjectModalProps } from './types';

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
        visibility: project.visibility
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
          id: parseInt(project.id),
          name: values.name,
          description: values.description,
          visibility: values.visibility,
          industryIds: industryIds
        };
        
        const response = await axios.post('/productx/sa-project/update', updateData);
        if (response.data.success) {
          const updatedProject = {
            ...project,
            ...values,
            industryIds: industryIds,
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

  return (
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
    </StyledModal>
  );
};

export default EditProjectModal; 