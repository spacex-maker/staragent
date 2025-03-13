import React from 'react';
import { Modal, Form, Input, Radio, Space, message } from 'antd';
import { LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { Project } from '../../types';
import axios from '../../../../api/axios';

interface ProjectModalProps {
  visible: boolean;
  editingProject: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
  onProjectCreate: (project: Project) => void;
  onProjectUpdate: (projectId: string, project: Partial<Project>) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  visible,
  editingProject,
  onSuccess,
  onCancel,
  onProjectCreate,
  onProjectUpdate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      if (editingProject) {
        form.setFieldsValue(editingProject);
      } else {
        form.resetFields();
        form.setFieldsValue({ visibility: 'private' });
      }
    }
  }, [visible, editingProject, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingProject) {
        try {
          const updateData = {
            id: parseInt(editingProject.id),
            name: values.name,
            description: values.description,
            visibility: values.visibility
          };
          
          const response = await axios.post('/productx/sa-project/update', updateData);
          if (response.data.success) {
            const updatedProject = {
              ...editingProject,
              ...values,
              updatedAt: new Date().toISOString()
            };
            onProjectUpdate(editingProject.id, updatedProject);
            message.success('项目更新成功');
            onSuccess();
          } else {
            message.error(response.data.message || '项目更新失败');
          }
        } catch (error) {
          message.error('更新项目时发生错误');
          console.error('更新项目错误:', error);
          return;
        }
      } else {
        try {
          const response = await axios.post('/productx/sa-project/create', values);
          if (response.data.success) {
            const newProject: Project = {
              id: response.data.data.id.toString(),
              name: response.data.data.name,
              description: response.data.data.description,
              visibility: response.data.data.visibility,
              isActive: response.data.data.status === 'active',
              createdAt: response.data.data.createTime,
              updatedAt: response.data.data.updateTime
            };
            onProjectCreate(newProject);
            message.success('项目创建成功');
            onSuccess();
          } else {
            message.error(response.data.message || '项目创建失败');
          }
        } catch (error) {
          message.error('创建项目时发生错误');
          console.error('创建项目错误:', error);
          return;
        }
      }
      onCancel();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingProject ? '编辑项目' : '新建项目'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ visibility: 'private' }}
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
    </Modal>
  );
};

export default ProjectModal; 