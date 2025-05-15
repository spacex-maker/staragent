import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message, Button, Space, Tooltip, Typography, Tag, Statistic, Row, Col, Select, Radio } from 'antd';
import { RobotOutlined, InfoCircleOutlined, DatabaseOutlined, ThunderboltOutlined, DollarOutlined, ManOutlined, WomanOutlined, QuestionOutlined } from '@ant-design/icons';
import axios from '../../../../api/axios';
import ModelSelector from '../ModelSelector';
import MBTISelector from '../MBTISelector';
import RoleSelector from '../RoleSelector';
import styled from 'styled-components';
import { useIntl, FormattedMessage } from 'react-intl';

const { Paragraph } = Typography;

interface CreateAIAgentModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const StyledFormItem = styled(Form.Item)`
  .prompt-container {
    position: relative;
  }

  .optimized-content {
    max-height: 250px;
    overflow: auto;
    border: 1px solid var(--ant-color-border);
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 20px;
    background-color: var(--ant-color-bg-container);
    white-space: pre-wrap;
    font-size: 14px;
    line-height: 1.6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  }
  
  .token-stats {
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
    padding: 12px;
    border-radius: 12px;
    background-color: var(--ant-color-bg-container);
    border: 1px solid var(--ant-color-border);
  }
  
  .stat-item {
    text-align: center;
    padding: 0 8px;
  }
  
  .stat-value {
    font-size: 16px;
    font-weight: 500;
    color: var(--ant-color-text);
    margin-top: 4px;
  }
  
  .stat-label {
    font-size: 12px;
    color: var(--ant-color-text-secondary);
  }
  
  .cost-value {
    color: var(--ant-color-success);
  }
  
  .stat-icon {
    margin-right: 4px;
    color: var(--ant-color-primary);
  }
  
  .optimize-modal-title {
    display: flex;
    align-items: center;
    
    .anticon {
      color: var(--ant-color-primary);
      margin-right: 8px;
    }
  }
`;

const OptimizeResultModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    overflow: hidden;
  }
  
  .ant-modal-body {
    padding: 20px 24px;
  }
  
  .ant-modal-footer {
    border-top: none;
    padding: 0 24px 20px;
  }
  
  .stats-card {
    margin-top: 16px;
    border-radius: 12px;
    background: var(--ant-color-bg-container);
    border: 1px solid var(--ant-color-border);
    overflow: hidden;
  }
  
  .stats-header {
    padding: 10px 16px;
    background: var(--ant-color-primary-bg);
    border-bottom: 1px solid var(--ant-color-border);
  }
  
  .stats-title {
    color: var(--ant-color-primary);
    font-size: 14px;
    margin: 0;
    font-weight: 500;
  }
  
  .stats-content {
    padding: 16px;
    display: flex;
    justify-content: space-between;
  }
  
  .stat-item {
    text-align: center;
    flex: 1;
    position: relative;
  }
  
  .stat-item:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 10%;
    height: 80%;
    width: 1px;
    background-color: var(--ant-color-border);
  }
  
  .stat-number {
    font-size: 20px;
    font-weight: 600;
    color: var(--ant-color-text);
    line-height: 1.4;
  }
  
  .cost-number {
    color: var(--ant-color-success);
  }
  
  .stat-label {
    font-size: 13px;
    color: var(--ant-color-text-secondary);
    margin-top: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .stat-icon {
    margin-right: 6px;
    font-size: 16px;
  }
  
  .optimized-content {
    max-height: 250px;
    overflow: auto;
    border: 1px solid var(--ant-color-border);
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 12px;
    background-color: var(--ant-color-bg-container);
    white-space: pre-wrap;
    font-size: 14px;
    line-height: 1.6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  }
`;

const CreateAIAgentModal: React.FC<CreateAIAgentModalProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [optimizing, setOptimizing] = React.useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [tokenInfo, setTokenInfo] = React.useState<{
    content?: string;
    contextTokens?: number;
    contentTokens?: number;
    promptCost?: number;
    completionCost?: number;
    unit?: string;
  } | null>(null);
  const [optimizeModalVisible, setOptimizeModalVisible] = useState(false);
  const intl = useIntl();

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      setPromptValue('');
      setTokenInfo(null);
    }
  }, [visible, form]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPromptValue(value);
    form.setFieldsValue({ prompt: value });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await axios.post('/productx/sa-ai-agent/create', {
        ...values,
        prompt: promptValue // 确保使用状态中的prompt值
      });
      if (response.data.success) {
        message.success(intl.formatMessage({ id: 'aiAgentModal.create.success', defaultMessage: 'AI助手创建成功' }));
        onSuccess();
      } else {
        message.error(response.data.message || intl.formatMessage({ id: 'aiAgentModal.create.error', defaultMessage: 'AI助手创建失败' }));
      }
    } catch (error) {
      console.error('创建AI助手错误:', error);
      message.error(intl.formatMessage({ id: 'aiAgentModal.create.errorOccurred', defaultMessage: '创建AI助手时发生错误' }));
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizePrompt = async () => {
    try {
      if (!promptValue || promptValue.trim() === '') {
        message.warning(intl.formatMessage({ 
          id: 'aiAgentModal.optimize.emptyPrompt', 
          defaultMessage: '请先输入一些提示词再进行优化' 
        }));
        return;
      }

      setOptimizing(true);
      const response = await axios.post('/chat/optimize-prompt', {
        content: promptValue
      });

      if (response.data.success) {
        // 保存token相关信息
        const { content, contextTokens, contentTokens, promptCost, completionCost, unit } = response.data.data;
        setTokenInfo({ content, contextTokens, contentTokens, promptCost, completionCost, unit });
        setOptimizeModalVisible(true);
      } else {
        message.error(response.data.message || intl.formatMessage({
          id: 'aiAgentModal.optimize.failed',
          defaultMessage: '优化提示词失败'
        }));
      }
    } catch (error) {
      console.error('优化提示词错误:', error);
      message.error(intl.formatMessage({
        id: 'aiAgentModal.optimize.error',
        defaultMessage: '优化提示词时发生错误'
      }));
    } finally {
      setOptimizing(false);
    }
  };

  const handleConfirmUpdate = () => {
    // 更新表单中的提示词
    if (tokenInfo?.content) {
      setPromptValue(tokenInfo.content);
      form.setFieldsValue({ prompt: tokenInfo.content });
    }
    setOptimizeModalVisible(false);
    message.success(intl.formatMessage({
      id: 'aiAgentModal.optimize.updated',
      defaultMessage: '已更新提示词'
    }));
  };

  return (
    <>
      <Modal
        title={intl.formatMessage({ id: 'aiAgentModal.create.title', defaultMessage: '新增AI助手' })}
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
          <Row gutter={16}>
            <Col span={16}>
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
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label={intl.formatMessage({ id: 'aiAgentModal.form.gender', defaultMessage: '性别' })}
              >
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={true} style={{ borderRadius: '20px 0 0 20px' }}>
                    <Space>
                      <ManOutlined style={{ color: '#4096ff' }} />
                      {intl.formatMessage({ id: 'aiAgentModal.form.gender.male', defaultMessage: '男' })}
                    </Space>
                  </Radio.Button>
                  <Radio.Button value={false} style={{ borderRadius: '0' }}>
                    <Space>
                      <WomanOutlined style={{ color: '#ff7875' }} />
                      {intl.formatMessage({ id: 'aiAgentModal.form.gender.female', defaultMessage: '女' })}
                    </Space>
                  </Radio.Button>
                  <Radio.Button value={null} style={{ borderRadius: '0 20px 20px 0' }}>
                    <Space>
                      <QuestionOutlined style={{ color: '#bfbfbf' }} />
                      {intl.formatMessage({ id: 'aiAgentModal.form.gender.unknown', defaultMessage: '未知' })}
                    </Space>
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

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

          <StyledFormItem
            name="prompt"
            label={
              <Space>
                {intl.formatMessage({ id: 'aiAgentModal.form.prompt', defaultMessage: '预设提示词' })}
                <Tooltip title={intl.formatMessage({ id: 'aiAgentModal.form.prompt.tooltip', defaultMessage: '定义AI助手的行为和专业领域' })}>
                  <InfoCircleOutlined />
                </Tooltip>
                <Button 
                  type="primary" 
                  icon={<RobotOutlined />} 
                  size="small"
                  onClick={handleOptimizePrompt}
                  loading={optimizing}
                >
                  {intl.formatMessage({ id: 'aiAgentModal.optimize.button', defaultMessage: 'AI优化' })}
                </Button>
              </Space>
            }
            rules={[{ required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.prompt.required', defaultMessage: '请输入预设提示词' }) }]}
          >
            <div className="prompt-container">
              <Input.TextArea
                value={promptValue}
                onChange={handlePromptChange}
                placeholder={intl.formatMessage({ id: 'aiAgentModal.form.prompt.placeholder', defaultMessage: '请输入预设提示词，定义AI助手的行为和专业领域' })}
                maxLength={2000}
                showCount
                autoSize={{ minRows: 6, maxRows: 12 }}
              />
            </div>
          </StyledFormItem>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="temperature"
                label={intl.formatMessage({ id: 'aiAgentModal.form.temperature', defaultMessage: '随机性' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.temperature.required', defaultMessage: '请输入随机性参数' }) },
                  { type: 'number', min: 0, max: 1, message: intl.formatMessage({ id: 'aiAgentModal.form.temperature.range', defaultMessage: '随机性参数必须在0-1之间' }) }
                ]}
                tooltip={intl.formatMessage({ id: 'aiAgentModal.form.temperature.tooltip', defaultMessage: '值越大，回答越具有创造性；值越小，回答越确定性' })}
              >
                <InputNumber
                  placeholder={intl.formatMessage({ id: 'aiAgentModal.form.temperature.placeholder', defaultMessage: '请输入随机性参数' })}
                  step={0.1}
                  min={0}
                  max={1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxTokens"
                label={intl.formatMessage({ id: 'aiAgentModal.form.maxTokens', defaultMessage: '最大Token数' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'aiAgentModal.form.maxTokens.required', defaultMessage: '请输入最大Token数' }) },
                  { type: 'number', min: 1, message: intl.formatMessage({ id: 'aiAgentModal.form.maxTokens.min', defaultMessage: '最大Token数必须大于0' }) }
                ]}
                tooltip={intl.formatMessage({ id: 'aiAgentModal.form.maxTokens.tooltip', defaultMessage: '限制每次回答的最大长度，1个汉字约等于2个token' })}
              >
                <InputNumber
                  placeholder={intl.formatMessage({ id: 'aiAgentModal.form.maxTokens.placeholder', defaultMessage: '请输入最大Token数' })}
                  min={1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      
      <OptimizeResultModal
        title={
          <div className="optimize-modal-title">
            <RobotOutlined />
            <span>{intl.formatMessage({ id: 'aiAgentModal.optimize.title', defaultMessage: 'AI优化提示词' })}</span>
          </div>
        }
        open={optimizeModalVisible}
        onCancel={() => setOptimizeModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setOptimizeModalVisible(false)}>
            {intl.formatMessage({ id: 'aiAgentModal.optimize.cancel', defaultMessage: '取消' })}
          </Button>,
          <Button key="apply" type="primary" onClick={handleConfirmUpdate}>
            {intl.formatMessage({ id: 'aiAgentModal.optimize.apply', defaultMessage: '应用' })}
          </Button>
        ]}
        width={600}
        destroyOnClose
      >
        <Paragraph>
          {intl.formatMessage({ id: 'aiAgentModal.optimize.confirm', defaultMessage: '已为您生成优化后的提示词，是否应用？' })}
        </Paragraph>
        
        <div className="optimized-content">
          {tokenInfo?.content}
        </div>
        
        <div className="stats-card">
          <div className="stats-header">
            <h4 className="stats-title">
              {intl.formatMessage({ id: 'aiAgentModal.optimize.statsTitle', defaultMessage: '优化统计信息' })}
            </h4>
          </div>
          <div className="stats-content">
            <div className="stat-item">
              <div className="stat-number">
                {tokenInfo?.contextTokens?.toLocaleString() || 0}
              </div>
              <div className="stat-label">
                <DatabaseOutlined className="stat-icon" />
                {intl.formatMessage({ id: 'aiAgentModal.optimize.inputTokens', defaultMessage: '输入tokens' })}
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">
                {tokenInfo?.contentTokens?.toLocaleString() || 0}
              </div>
              <div className="stat-label">
                <ThunderboltOutlined className="stat-icon" />
                {intl.formatMessage({ id: 'aiAgentModal.optimize.outputTokens', defaultMessage: '输出tokens' })}
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number cost-number">
                {tokenInfo?.promptCost && tokenInfo?.completionCost ? 
                  `${(tokenInfo.promptCost + tokenInfo.completionCost).toFixed(6)} ${tokenInfo.unit || '$'}` : 
                  intl.formatMessage({ id: 'aiAgentModal.optimize.unknown', defaultMessage: '未知' })}
              </div>
              <div className="stat-label">
                <DollarOutlined className="stat-icon" />
                {intl.formatMessage({ id: 'aiAgentModal.optimize.cost', defaultMessage: '花费' })}
              </div>
            </div>
          </div>
        </div>
      </OptimizeResultModal>
    </>
  );
};

export default CreateAIAgentModal; 