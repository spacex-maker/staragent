import React, { useEffect } from 'react';
import { Form, Input, Radio, Space, Cascader, Tooltip } from 'antd';
import { LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { BasicInfoFormProps } from './types';
import { useIndustries } from '../../../../contexts/IndustryContext';

interface SpaceProps {
  children: [React.ReactElement, React.ReactElement];
}

interface SpanProps {
  children: string;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ form, initialValues }) => {
  const { industries, loading } = useIndustries();

  // 处理初始行业数据
  useEffect(() => {
    if (initialValues?.industries && industries.length > 0) {
      const industryPaths = initialValues.industries.map(industry => {
        const path = findIndustryPath(industry.id, industries);
        return path || [industry.id];
      }).filter(Boolean);

      if (industryPaths.length > 0) {
        form.setFieldValue('industryIds', industryPaths);
      }
    }
  }, [initialValues, industries, form]);

  const findIndustryPath = (targetId: number, options: any[]): number[] | null => {
    for (const option of options) {
      if (option.value === targetId) {
        return [option.value];
      }
      if (option.children) {
        const childPath = findIndustryPath(targetId, option.children);
        if (childPath) {
          return [option.value, ...childPath];
        }
      }
    }
    return null;
  };

  return (
    <Form
      form={form}
      layout="vertical"
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
          loading={loading}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {lastOption?.icon && (
                    <i className={lastOption.icon} style={{ width: 16, textAlign: 'center' }} />
                  )}
                  <span>{lastOption?.name || ''}</span>
                </div>
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
  );
};

export default BasicInfoForm; 