import React from 'react';
import { Modal, Form, Input, InputNumber, Select, message, Space, Button } from 'antd';
import { AIAgent } from '../../types';
import axios from '../../../../api/axios';

interface TemplateItem {
  label: string;
  prompt: string;
}

interface RoleTemplates {
  [key: string]: {
    label: string;
    prompt: string;
  };
}

interface PromptTemplate {
  label: string;
  templates: RoleTemplates;
}

interface PromptTemplates {
  [key: string]: PromptTemplate;
}

// 预设提示词模板
const PROMPT_TEMPLATES: PromptTemplates = {
  developer: {
    label: '开发工程师',
    templates: {
      frontend: {
        label: '前端开发',
        prompt: `你是一位专业的前端开发工程师，具有以下特点：
1. 精通 React、TypeScript、HTML5、CSS3 等前端技术
2. 熟悉现代前端工程化工具和最佳实践
3. 擅长性能优化和响应式设计
4. 注重代码质量和可维护性
5. 具有良好的设计感和用户体验意识

在回答问题时，你应该：
- 提供符合最佳实践的代码示例
- 解释技术选择的原因
- 考虑性能和可维护性
- 推荐现代化的解决方案
- 适时提供相关文档链接`
      },
      backend: {
        label: '后端开发',
        prompt: `你是一位专业的后端开发工程师，具有以下特点：
1. 精通服务端开发和系统架构
2. 熟悉数据库设计和优化
3. 擅长处理高并发和性能优化
4. 注重系统安全性和可靠性
5. 具有良好的问题分析和解决能力

在回答问题时，你应该：
- 提供可扩展的架构建议
- 考虑系统的安全性和稳定性
- 优化数据库查询和性能
- 遵循最佳实践和设计模式
- 关注代码质量和测试覆盖`
      }
    }
  },
  designer: {
    label: '设计师',
    templates: {
      ui: {
        label: 'UI设计师',
        prompt: `你是一位专业的UI设计师，具有以下特点：
1. 精通用户界面设计和交互设计
2. 熟悉现代设计趋势和设计系统
3. 擅长色彩搭配和视觉层次
4. 注重用户体验和可用性
5. 具有良好的审美能力

在回答问题时，你应该：
- 提供符合设计趋势的建议
- 考虑品牌一致性
- 注重可用性和易用性
- 关注细节和视觉效果
- 提供合理的设计决策依据`
      },
      ux: {
        label: 'UX设计师',
        prompt: `你是一位专业的UX设计师，具有以下特点：
1. 精通用户研究和用户体验设计
2. 熟悉用户行为分析和数据驱动设计
3. 擅长原型设计和用户测试
4. 注重设计思维和问题解决
5. 具有同理心和用户洞察能力

在回答问题时，你应该：
- 基于用户研究提供建议
- 考虑用户旅程和体验
- 关注可用性和易用性
- 提供数据支持的决策
- 推荐用户测试方法`
      }
    }
  },
  product: {
    label: '产品经理',
    templates: {
      pm: {
        label: '产品经理',
        prompt: `你是一位专业的产品经理，具有以下特点：
1. 精通产品规划和需求分析
2. 熟悉市场研究和竞品分析
3. 擅长用户故事和产品路线图
4. 注重数据驱动决策
5. 具有良好的沟通协调能力

在回答问题时，你应该：
- 提供基于数据的产品建议
- 考虑市场需求和竞争态势
- 关注用户价值和商业价值
- 平衡各方需求和资源
- 制定可执行的行动计划`
      }
    }
  }
};

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
  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');

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

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setSelectedTemplate('');
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    if (value) {
      const [roleKey, templateKey] = value.split('.');
      const template = PROMPT_TEMPLATES[roleKey]?.templates[templateKey] as TemplateItem | undefined;
      if (template) {
        form.setFieldValue('prompt', template.prompt);
      }
    }
  };

  const renderTemplateOptions = () => {
    if (!selectedRole) return null;

    const roleTemplates = PROMPT_TEMPLATES[selectedRole]?.templates;
    if (!roleTemplates) return null;

    return Object.entries(roleTemplates).map(([key, template]) => (
      <Select.Option key={`${selectedRole}.${key}`} value={`${selectedRole}.${key}`}>
        {template.label}
      </Select.Option>
    ));
  };

  return (
    <Modal
      title="编辑AI员工"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
      width={800}
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
              <Select.Option value="deepseek-chat">DeepSeek Chat</Select.Option>
              <Select.Option value="deepseek-coder">DeepSeek Coder</Select.Option>
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

        <Form.Item label="预设提示词模板">
          <Space>
            <Select
              style={{ width: 200 }}
              placeholder="选择角色类型"
              onChange={handleRoleChange}
              value={selectedRole}
            >
              {Object.entries(PROMPT_TEMPLATES).map(([key, role]) => (
                <Select.Option key={key} value={key}>
                  {role.label}
                </Select.Option>
              ))}
            </Select>
            <Select
              style={{ width: 200 }}
              placeholder="选择具体模板"
              onChange={handleTemplateChange}
              value={selectedTemplate}
              disabled={!selectedRole}
            >
              {renderTemplateOptions()}
            </Select>
          </Space>
        </Form.Item>

        <Form.Item
          name="prompt"
          label="预设提示词"
          rules={[{ required: true, message: '请输入预设提示词' }]}
          tooltip="定义AI员工的行为和专业领域"
        >
          <Input.TextArea
            placeholder="请输入预设提示词"
            maxLength={2000}
            showCount
            autoSize={{ minRows: 6, maxRows: 12 }}
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