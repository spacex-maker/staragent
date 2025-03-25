import React from 'react';
import { Modal, Form, message } from 'antd';
import styled from 'styled-components';
import BasicInfoForm from '../EditProjectModal/BasicInfo/BasicInfoForm';

interface CreateProjectModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onProjectCreate: (values: any) => Promise<void>;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  visible,
  onSuccess,
  onCancel,
  onProjectCreate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

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

        const createData = {
          name: values.name,
          description: values.description,
          visibility: values.visibility,
          industryIds: industryIds
        };

        await onProjectCreate(createData);
        message.success('创建项目成功');
        form.resetFields();
        onSuccess();
      } catch (error) {
        console.error('创建项目错误:', error);
        message.error('创建项目失败');
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="创建项目"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <BasicInfoForm
        form={form}
      />
    </Modal>
  );
};

export default CreateProjectModal; 