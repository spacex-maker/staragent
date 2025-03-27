import React from 'react';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import axios from '../../../../api/axios';
import ModelSelector from '../ModelSelector';
import MBTISelector from '../MBTISelector';
import RoleSelector from '../RoleSelector';

interface CreateAIAgentModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateAIAgentModal: React.FC<CreateAIAgentModalProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await axios.post('/productx/sa-ai-agent/create', values);
      if (response.data.success) {
        message.success('AI员工创建成功');
        onSuccess();
      } else {
        message.error(response.data.message || 'AI员工创建失败');
      }
    } catch (error) {
      console.error('创建AI员工错误:', error);
      message.error('创建AI员工时发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="新增AI员工"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
      width={1000}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          temperature: 0.7,
          maxTokens: 2000
        }}
      >
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入AI员工名称' }]}
        >
          <Input placeholder="请输入AI员工名称" maxLength={50} showCount />
        </Form.Item>

        <Form.Item
          name="modelType"
          label="使用模型"
          rules={[{ required: true, message: '请选择使用模型' }]}
        >
          <ModelSelector />
        </Form.Item>

        <Form.Item
          name="mbtiCode"
          label="MBTI性格"
          tooltip="选择AI员工的MBTI性格类型，这将影响其行为方式和沟通风格"
        >
          <MBTISelector />
        </Form.Item>

        <Form.Item
          name="roles"
          label="角色"
          rules={[{ required: true, message: '请选择AI员工角色' }]}
          tooltip="选择AI员工可以扮演的角色，支持多选"
        >
          <RoleSelector />
        </Form.Item>

        <Form.Item
          name="prompt"
          label="预设提示词"
          rules={[{ required: true, message: '请输入预设提示词' }]}
          tooltip="定义AI员工的行为和专业领域，例如：你是一个专业的前端开发工程师，擅长React、TypeScript等技术"
        >
          <Input.TextArea
            placeholder="请输入预设提示词，定义AI员工的行为和专业领域"
            maxLength={500}
            showCount
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          name="temperature"
          label="随机性"
          rules={[
            { required: true, message: '请输入随机性参数' },
            { type: 'number', min: 0, max: 1, message: '随机性参数必须在0-1之间' }
          ]}
          tooltip="值越大，回答越具有创造性；值越小，回答越确定性"
        >
          <InputNumber
            placeholder="请输入随机性参数"
            step={0.1}
            min={0}
            max={1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="maxTokens"
          label="最大Token数"
          rules={[
            { required: true, message: '请输入最大Token数' },
            { type: 'number', min: 1, message: '最大Token数必须大于0' }
          ]}
          tooltip="限制每次回答的最大长度，1个汉字约等于2个token"
        >
          <InputNumber
            placeholder="请输入最大Token数"
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAIAgentModal; 