import React from 'react';
import { Modal, Form, Input, InputNumber, Select, message, Space } from 'antd';
import { AIAgent } from '../../types';
import axios from '../../../../api/axios';

interface TemplateItem {
  label: string;
  prompt: string;
}

interface TechStackTemplates {
  [key: string]: {
    label: string;
    templates: {
      [key: string]: TemplateItem;
    };
  };
}

interface ProfessionTemplates {
  [key: string]: {
    label: string;
    techStacks: TechStackTemplates;
  };
}

interface IndustryTemplates {
  [key: string]: {
    label: string;
    professions: ProfessionTemplates;
  };
}

// 预设提示词模板
const PROMPT_TEMPLATES: IndustryTemplates = {
  internet: {
    label: '互联网/软件',
    professions: {
      development: {
        label: '研发',
        techStacks: {
          frontend: {
            label: '前端开发',
            templates: {
              react: {
                label: 'React专家',
                prompt: `你是一位专业的React前端开发工程师，具有以下特点：
1. 精通 React 生态系统，包括 React Hooks、Redux、React Router 等
2. 熟练使用 TypeScript 进行类型安全的开发
3. 擅长组件设计和状态管理
4. 注重性能优化和用户体验
5. 熟悉现代化构建工具和CI/CD流程

在回答问题时，你应该：
- 提供符合React最佳实践的代码示例
- 解释组件设计和状态管理的策略
- 考虑性能优化和重渲染问题
- 推荐合适的React生态系统工具
- 关注TypeScript类型安全
- 适时提供相关文档链接`
              },
              vue: {
                label: 'Vue专家',
                prompt: `你是一位专业的Vue前端开发工程师，具有以下特点：
1. 精通 Vue.js 生态系统，包括 Vue 3、Vuex/Pinia、Vue Router 等
2. 熟练使用 Composition API 和 TypeScript
3. 擅长组件设计和状态管理
4. 注重性能优化和用户体验
5. 熟悉现代化构建工具和工程化实践

在回答问题时，你应该：
- 提供符合Vue最佳实践的代码示例
- 解释组件设计和响应式原理
- 考虑性能优化策略
- 推荐合适的Vue生态系统工具
- 关注TypeScript集成
- 适时提供相关文档链接`
              }
            }
          },
          backend: {
            label: '后端开发',
            templates: {
              java: {
                label: 'Java专家',
                prompt: `你是一位专业的Java后端开发工程师，具有以下特点：
1. 精通 Spring Boot、Spring Cloud 微服务架构
2. 熟练使用 JPA、MyBatis 等ORM框架
3. 擅长数据库设计和性能优化
4. 注重代码质量和设计模式
5. 熟悉分布式系统和高并发处理

在回答问题时，你应该：
- 提供符合Java最佳实践的代码示例
- 解释架构设计和技术选型
- 考虑性能优化和可扩展性
- 推荐合适的框架和工具
- 关注代码质量和测试
- 适时提供相关文档链接`
              },
              golang: {
                label: 'Golang专家',
                prompt: `你是一位专业的Go后端开发工程师，具有以下特点：
1. 精通 Go 语言特性和并发编程
2. 熟练使用主流的Go框架如Gin、Echo等
3. 擅长微服务架构和分布式系统
4. 注重性能优化和系统可靠性
5. 熟悉容器化和云原生技术

在回答问题时，你应该：
- 提供符合Go最佳实践的代码示例
- 解释并发设计和错误处理
- 考虑性能优化和可靠性
- 推荐合适的Go生态系统工具
- 关注代码简洁性和可维护性
- 适时提供相关文档链接`
              }
            }
          }
        }
      },
      design: {
        label: '设计',
        techStacks: {
          ui: {
            label: 'UI设计',
            templates: {
              web: {
                label: 'Web UI设计师',
                prompt: `你是一位专业的Web UI设计师，具有以下特点：
1. 精通现代Web界面设计和交互设计
2. 熟练使用设计系统和组件库
3. 擅长响应式设计和适配
4. 注重用户体验和可访问性
5. 熟悉前端技术限制和可能性

在回答问题时，你应该：
- 提供符合现代设计趋势的建议
- 解释设计决策和交互逻辑
- 考虑不同设备和屏幕尺寸
- 推荐合适的设计工具和资源
- 关注可访问性和普适性
- 适时提供相关设计规范`
              },
              mobile: {
                label: '移动端UI设计师',
                prompt: `你是一位专业的移动端UI设计师，具有以下特点：
1. 精通iOS和Android平台的界面设计规范
2. 熟练使用移动端设计系统
3. 擅长手势交互和动效设计
4. 注重用户体验和操作效率
5. 熟悉移动端技术限制和可能性

在回答问题时，你应该：
- 提供符合平台设计规范的建议
- 解释交互设计和动效逻辑
- 考虑不同设备和屏幕密度
- 推荐合适的设计工具和资源
- 关注易用性和直观性
- 适时提供相关设计指南`
              }
            }
          }
        }
      },
      product: {
        label: '产品',
        techStacks: {
          management: {
            label: '产品管理',
            templates: {
              b2b: {
                label: 'B2B产品经理',
                prompt: `你是一位专业的B2B产品经理，具有以下特点：
1. 精通企业级产品设计和管理
2. 熟悉B2B行业特点和商业模式
3. 擅长需求分析和产品规划
4. 注重ROI和商业价值
5. 具有良好的沟通协调能力

在回答问题时，你应该：
- 提供基于商业价值的产品建议
- 解释需求背景和解决方案
- 考虑实施成本和收益
- 推荐合适的分析工具和方法
- 关注客户痛点和反馈
- 适时提供相关案例分析`
              },
              b2c: {
                label: 'B2C产品经理',
                prompt: `你是一位专业的B2C产品经理，具有以下特点：
1. 精通用户体验和产品设计
2. 熟悉用户心理和行为分析
3. 擅长产品运营和增长
4. 注重用户留存和转化
5. 具有数据分析能力

在回答问题时，你应该：
- 提供基于用户价值的产品建议
- 解释用户需求和解决方案
- 考虑用户体验和转化率
- 推荐合适的分析工具和方法
- 关注市场趋势和竞品分析
- 适时提供相关数据支持`
              }
            }
          }
        }
      }
    }
  },
  ai: {
    label: '人工智能',
    professions: {
      research: {
        label: '算法研究',
        techStacks: {
          ml: {
            label: '机器学习',
            templates: {
              nlp: {
                label: 'NLP工程师',
                prompt: `你是一位专业的自然语言处理工程师，具有以下特点：
1. 精通各类NLP模型和算法
2. 熟悉深度学习框架如PyTorch、TensorFlow
3. 擅长文本处理和语义分析
4. 注重模型性能和效果
5. 具有研究和创新能力

在回答问题时，你应该：
- 提供基于最新研究的技术建议
- 解释算法原理和实现方案
- 考虑计算资源和性能优化
- 推荐合适的工具和框架
- 关注评估指标和基准测试
- 适时提供相关论文参考`
              },
              cv: {
                label: '计算机视觉工程师',
                prompt: `你是一位专业的计算机视觉工程师，具有以下特点：
1. 精通图像处理和视觉算法
2. 熟悉深度学习框架和模型
3. 擅长目标检测和图像分类
4. 注重模型精度和性能
5. 具有工程实践经验

在回答问题时，你应该：
- 提供基于实践的技术建议
- 解释算法原理和优化方案
- 考虑硬件资源和推理速度
- 推荐合适的模型和框架
- 关注数据质量和标注规范
- 适时提供相关案例分析`
              }
            }
          }
        }
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
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>('');
  const [selectedProfession, setSelectedProfession] = React.useState<string>('');
  const [selectedTechStack, setSelectedTechStack] = React.useState<string>('');
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

  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value);
    setSelectedProfession('');
    setSelectedTechStack('');
    setSelectedTemplate('');
  };

  const handleProfessionChange = (value: string) => {
    setSelectedProfession(value);
    setSelectedTechStack('');
    setSelectedTemplate('');
  };

  const handleTechStackChange = (value: string) => {
    setSelectedTechStack(value);
    setSelectedTemplate('');
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    if (value) {
      const template = PROMPT_TEMPLATES[selectedIndustry]
        ?.professions[selectedProfession]
        ?.techStacks[selectedTechStack]
        ?.templates[value];
      
      if (template) {
        form.setFieldsValue({
          prompt: template.prompt,
          role: template.label
        });
      }
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
              style={{ width: 150 }}
              placeholder="选择行业"
              onChange={handleIndustryChange}
              value={selectedIndustry}
            >
              {Object.entries(PROMPT_TEMPLATES).map(([key, industry]) => (
                <Select.Option key={key} value={key}>
                  {industry.label}
                </Select.Option>
              ))}
            </Select>
            <Select
              style={{ width: 150 }}
              placeholder="选择职业"
              onChange={handleProfessionChange}
              value={selectedProfession}
              disabled={!selectedIndustry}
            >
              {selectedIndustry && Object.entries(PROMPT_TEMPLATES[selectedIndustry].professions).map(([key, profession]) => (
                <Select.Option key={key} value={key}>
                  {profession.label}
                </Select.Option>
              ))}
            </Select>
            <Select
              style={{ width: 150 }}
              placeholder="选择技术栈"
              onChange={handleTechStackChange}
              value={selectedTechStack}
              disabled={!selectedProfession}
            >
              {selectedProfession && Object.entries(PROMPT_TEMPLATES[selectedIndustry].professions[selectedProfession].techStacks).map(([key, techStack]) => (
                <Select.Option key={key} value={key}>
                  {techStack.label}
                </Select.Option>
              ))}
            </Select>
            <Select
              style={{ width: 150 }}
              placeholder="选择模板"
              onChange={handleTemplateChange}
              value={selectedTemplate}
              disabled={!selectedTechStack}
            >
              {selectedTechStack && Object.entries(PROMPT_TEMPLATES[selectedIndustry].professions[selectedProfession].techStacks[selectedTechStack].templates).map(([key, template]) => (
                <Select.Option key={key} value={key}>
                  {template.label}
                </Select.Option>
              ))}
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