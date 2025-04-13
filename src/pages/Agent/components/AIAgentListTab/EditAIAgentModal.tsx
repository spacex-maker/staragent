import React from 'react';
import { Modal, Form, Input, InputNumber, Select, message, Space } from 'antd';
import { AIAgent } from '../../types';
import axios from '../../../../api/axios';
import ModelSelector from '../ModelSelector';
import MBTISelector from '../MBTISelector';
import RoleSelector from '../RoleSelector';
import { useIntl, FormattedMessage } from 'react-intl';

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
  const intl = useIntl();

  React.useEffect(() => {
    if (visible && editingAgent) {
      // 直接使用 roles 数组
      form.setFieldsValue({
        ...editingAgent,
        roles: editingAgent.roles || []
      });
    }
  }, [visible, editingAgent, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updateData = {
        id: editingAgent.id,
        ...values
      };

      const response = await axios.post('/productx/sa-ai-agent/update', updateData);
      if (response.data.success) {
        message.success(intl.formatMessage({ id: 'aiAgentModal.edit.success', defaultMessage: 'AI助手更新成功' }));
        onSuccess();
      } else {
        message.error(response.data.message || intl.formatMessage({ id: 'aiAgentModal.edit.error', defaultMessage: 'AI助手更新失败' }));
      }
    } catch (error) {
      console.error('更新AI助手错误:', error);
      message.error(intl.formatMessage({ id: 'aiAgentModal.edit.errorOccurred', defaultMessage: '更新AI助手时发生错误' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'aiAgentModal.edit.title', defaultMessage: '编辑AI助手' })}
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
      >
        <Form.Item
          name="name"
          label={intl.formatMessage({ id: 'aiAgentModal.form.name', defaultMessage: '名称' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.name.required', defaultMessage: '请输入AI助手名称' }) }]}
        >
          <Input 
            placeholder={intl.formatMessage({ id: 'aiAgentModal.form.name.placeholder', defaultMessage: '请输入AI助手名称' })} 
            maxLength={50} 
            showCount 
          />
        </Form.Item>

        <Form.Item
          name="modelType"
          label={intl.formatMessage({ id: 'aiAgentModal.form.model', defaultMessage: '使用模型' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.model.required', defaultMessage: '请选择使用模型' }) }]}
        >
          <ModelSelector />
        </Form.Item>

        <Form.Item
          name="mbtiCode"
          label={intl.formatMessage({ id: 'aiAgentModal.form.mbti', defaultMessage: 'MBTI性格' })}
          tooltip={intl.formatMessage({ id: 'aiAgentModal.form.mbti.tooltip', defaultMessage: '选择AI助手的MBTI性格类型，这将影响其行为方式和沟通风格' })}
        >
          <MBTISelector />
        </Form.Item>

        <Form.Item
          name="roles"
          label={intl.formatMessage({ id: 'aiAgentModal.form.roles', defaultMessage: '角色' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.roles.required', defaultMessage: '请选择AI助手角色' }) }]}
          tooltip={intl.formatMessage({ id: 'aiAgentModal.form.roles.tooltip', defaultMessage: '选择AI助手可以扮演的角色，支持多选' })}
        >
          <RoleSelector />
        </Form.Item>

        <Form.Item
          name="prompt"
          label={intl.formatMessage({ id: 'aiAgentModal.form.prompt', defaultMessage: '预设提示词' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.prompt.required', defaultMessage: '请输入预设提示词' }) }]}
          tooltip={intl.formatMessage({ id: 'aiAgentModal.form.prompt.tooltip', defaultMessage: '定义AI助手的行为和专业领域' })}
        >
          <Input.TextArea
            placeholder={intl.formatMessage({ id: 'aiAgentModal.form.prompt.placeholder', defaultMessage: '请输入预设提示词' })}
            maxLength={2000}
            showCount
            autoSize={{ minRows: 6, maxRows: 12 }}
          />
        </Form.Item>

        <Form.Item
          name="temperature"
          label={intl.formatMessage({ id: 'aiAgentModal.form.temperature', defaultMessage: '随机性' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.temperature.required', defaultMessage: '请输入随机性参数' }) },
            { type: 'number', min: 0, max: 1, message: intl.formatMessage({ id: 'aiAgentModal.form.temperature.range', defaultMessage: '随机性参数必须在0-1之间' }) }
          ]}
        >
          <InputNumber
            placeholder={intl.formatMessage({ id: 'aiAgentModal.form.temperature.placeholder', defaultMessage: '请输入随机性参数' })}
            step={0.1}
            min={0}
            max={1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="maxTokens"
          label={intl.formatMessage({ id: 'aiAgentModal.form.maxTokens', defaultMessage: '最大Token数' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.maxTokens.required', defaultMessage: '请输入最大Token数' }) },
            { type: 'number', min: 1, message: intl.formatMessage({ id: 'aiAgentModal.form.maxTokens.min', defaultMessage: '最大Token数必须大于0' }) }
          ]}
        >
          <InputNumber
            placeholder={intl.formatMessage({ id: 'aiAgentModal.form.maxTokens.placeholder', defaultMessage: '请输入最大Token数' })}
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={intl.formatMessage({ id: 'aiAgentModal.form.status', defaultMessage: '状态' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.status.required', defaultMessage: '请选择状态' }) }]}
        >
          <Select>
            <Select.Option value="active">{intl.formatMessage({ id: 'aiAgentModal.form.status.active', defaultMessage: '启用' })}</Select.Option>
            <Select.Option value="inactive">{intl.formatMessage({ id: 'aiAgentModal.form.status.inactive', defaultMessage: '禁用' })}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAIAgentModal; 