import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, Space, Cascader, message, Tooltip } from 'antd';
import { LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { Project, Industry } from '../../types';
import axios from '../../../../api/axios';
import styled from 'styled-components';
import type { DefaultOptionType } from 'antd/es/cascader';

interface IndustryTreeNode extends Industry {
  children?: IndustryTreeNode[];
}

interface CascaderOption extends DefaultOptionType {
  value: number;
  label: React.ReactNode;
  children?: CascaderOption[];
  isLeaf?: boolean;
  name?: string;
  icon?: string;
}

interface SpaceProps {
  children: [React.ReactElement, React.ReactElement];
}

interface SpanProps {
  children: string;
}

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
  const [industries, setIndustries] = useState<CascaderOption[]>([]);
  const [fetchingIndustries, setFetchingIndustries] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({ visibility: 'private' });
      fetchIndustries();
    }
  }, [visible, form]);

  const fetchIndustries = async () => {
    setFetchingIndustries(true);
    try {
      const response = await axios.get('/base/industry/tree');
      if (response.data.success) {
        const formattedData = formatIndustryData(response.data.data);
        setIndustries(formattedData);
      }
    } catch (error) {
      console.error('获取行业列表失败:', error);
    } finally {
      setFetchingIndustries(false);
    }
  };

  const formatIndustryData = (data: IndustryTreeNode[]): CascaderOption[] => {
    return data.map(item => ({
      value: item.id,
      label: (
        <Space>
          <i className={item.icon} style={{ width: 16, textAlign: 'center' }} />
          <span>{item.name}</span>
        </Space>
      ),
      children: item.children ? formatIndustryData(item.children) : undefined,
      isLeaf: !item.children || item.children.length === 0,
      name: item.name,
      icon: item.icon,
    }));
  };

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

        const submitData = {
          name: values.name,
          description: values.description,
          visibility: values.visibility,
          industryIds: industryIds
        };

        console.log('开始创建项目:', submitData);
        const response = await axios.post('/productx/sa-project/create', submitData);
        console.log('项目创建响应:', response.data);
        
        if (response.data.success) {
          message.success('项目创建成功');
          onSuccess();
          onCancel();
        } else {
          console.error('项目创建失败:', response.data);
          message.error(response.data.message || '项目创建失败');
        }
      } catch (error: any) {
        console.error('创建项目错误:', error);
        message.error('创建项目失败，请稍后重试');
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
          name="industryIds"
          label="所属行业"
          rules={[{ required: true, message: '请选择所属行业' }]}
        >
          <Cascader
            options={industries}
            placeholder="请选择所属行业"
            loading={fetchingIndustries}
            multiple
            showSearch={{
              filter: (inputValue, path) => {
                const option = path[path.length - 1];
                if (React.isValidElement(option.label)) {
                  const label = option.label as React.ReactElement<SpaceProps>;
                  const spanElement = label.props.children[1] as React.ReactElement<SpanProps>;
                  return spanElement.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
                }
                return false;
              }
            }}
            displayRender={(labels, selectedOptions) => {
              if (!selectedOptions) return '';
              const lastOption = selectedOptions[selectedOptions.length - 1];
              const fullPath = selectedOptions
                .map(option => option?.name || '')
                .filter(Boolean)
                .join(' / ');
              
              return (
                <Tooltip title={fullPath}>
                  <span>{lastOption?.name || ''}</span>
                </Tooltip>
              );
            }}
            style={{ width: '100%' }}
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