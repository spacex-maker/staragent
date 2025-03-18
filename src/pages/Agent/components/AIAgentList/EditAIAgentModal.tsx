import React from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { AIAgent } from '../../types';
import axios from '../../../../api/axios';

interface EditAIAgentModalProps {
  visible: boolean;
  editingAgent: AIAgent;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditAIAgentModal: React.FC<EditAIAgentModalProps> = ({
  visible,
  editingAgent,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (visible && editingAgent) {
      form.setFieldsValue(editingAgent);
    }
  }, [visible, editingAgent, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updateData = {
        id: editingAgent.id,
        ...values,
      };

      const response = await axios.post('/productx/sa-ai-agent/update', updateData);
      if (response.data.success) {
        message.success('AI员工更新成功');
        onSuccess();
      } else {
        message.error(response.data.message || 'AI员工更新失败');
      }
    } catch (error) {
      console.error('更新AI员工错误:', error);
      message.error('更新AI员工时发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑AI员工"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
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
          <Input placeholder="请输入AI员工角色" maxLength={50} showCount />
        </Form.Item>

        <Form.Item
          name="prompt"
          label="预设提示词"
          rules={[{ required: true, message: '请输入预设提示词' }]}
        >
          <Input.TextArea
            placeholder="请输入预设提示词"
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

export default EditAIAgentModal; 