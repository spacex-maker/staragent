import React from 'react';
import { Form, Input, Radio, Space } from 'antd';
import { LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { BasicInfoFormProps } from './types';

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ form, initialValues }) => {
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

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