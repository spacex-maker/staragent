import React from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import axios from '../../../../api/axios';

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
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'active',
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
          <Select>
            <Select.OptGroup label="文本聊天">
              <Select.Option value="gpt-4o">GPT-4 Optimized</Select.Option>
              <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="图像生成">
              <Select.Option value="dall-e-3">DALL-E 3</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="语音识别">
              <Select.Option value="whisper-1">Whisper-1</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="嵌入搜索">
              <Select.Option value="text-embedding-3-large">Text Embedding 3 Large</Select.Option>
              <Select.Option value="text-embedding-3-small">Text Embedding 3 Small</Select.Option>
            </Select.OptGroup>
          </Select>
        </Form.Item>

        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true, message: '请输入AI员工角色' }]}
        >
          <Input placeholder="请输入AI员工角色，例如：前端开发专家" maxLength={50} showCount />
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

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select>
            <Select.Option value="active">启用</Select.Option>
            <Select.Option value="inactive">禁用</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAIAgentModal; 