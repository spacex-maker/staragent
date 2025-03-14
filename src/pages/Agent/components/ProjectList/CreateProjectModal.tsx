import React from 'react';
import { Modal, Form, Input, Radio, Space, message } from 'antd';
import { LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { Project } from '../../types';
import axios from '../../../../api/axios';
import styled from 'styled-components';

interface CreateProjectModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onProjectCreate: (project: Project) => void;
}

const StyledModal = styled(Modal)`
  .ant-modal-body {
    transition: height 0.3s ease;
  }
`;

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  visible,
  onSuccess,
  onCancel,
  onProjectCreate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({ visibility: 'private' });
    }
  }, [visible, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      try {
        console.log('开始创建项目:', values);
        const response = await axios.post('/productx/sa-project/create', values);
        console.log('项目创建响应:', response.data);
        
        if (response.data.success) {
          message.success('项目创建成功');
          
          // 直接调用成功回调，让父组件刷新项目列表
          onSuccess();
          onCancel();
        } else {
          console.error('项目创建失败:', response.data);
          message.error(response.data.message || '项目创建失败');
        }
      } catch (error: any) {
        console.error('创建项目错误:', error);
        // 错误已经由 axios 拦截器处理，这里只需记录日志
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <StyledModal
      title="新建项目"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
      width={600}
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
    </StyledModal>
  );
};

export default CreateProjectModal; 