import React, { useEffect } from 'react';
import { Form, Input, Radio, Space, Tooltip, Tag, Select } from 'antd';
import { LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { BasicInfoFormProps } from './types';
import { useIndustries } from '../../../../contexts/IndustryContext';
import { StyledCascader } from './styles';

const { Option } = Select;

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
        <StyledCascader
          options={industries}
          placeholder="请选择所属行业"
          loading={loading}
          multiple
          maxTagCount="responsive"
          tagRender={({ label, value, closable, onClose }) => {
            const option = industries.find(item => item.value === value);
            return (
              <Tag
                closable={closable}
                onClose={onClose}
                style={{
                  borderRadius: '9999px',
                  padding: '0 2px 0 8px',
                  height: '24px',
                  lineHeight: '22px',
                  margin: '2px 2px',
                  backgroundColor: 'var(--ant-color-primary-bg)',
                  border: '1px solid var(--ant-color-primary-border)',
                  color: 'var(--ant-color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {option?.icon && (
                  <i className={option.icon} style={{ width: 16, textAlign: 'center', color: option.iconColor || 'var(--ant-color-text-secondary)', marginRight: 4 }} />
                )}
                {label}
              </Tag>
            );
          }}
          showSearch={{
            filter: (inputValue, path) => {
              return path.some(option => 
                option.name?.toLowerCase().includes(inputValue.toLowerCase())
              );
            }
          }}
          displayRender={(labels, selectedOptions) => {
            if (!selectedOptions) return '';
            const lastOption = selectedOptions[selectedOptions.length - 1];
            
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {lastOption?.icon && (
                  <i className={lastOption.icon} style={{ width: 16, textAlign: 'center', color: lastOption.iconColor || 'var(--ant-color-text-secondary)' }} />
                )}
                <span>{lastOption?.name || ''}</span>
              </div>
            );
          }}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        name="status"
        label="项目状态"
        rules={[{ required: true, message: '请选择项目状态' }]}
        initialValue="active"
      >
        <Select>
          <Option value="active">启用</Option>
          <Option value="inactive">禁用</Option>
          <Option value="archived">归档</Option>
        </Select>
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