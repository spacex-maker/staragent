import React, { useEffect, useState } from 'react';
import { Form, Input, Space, Tooltip, Tag, Typography, Row, Col } from 'antd';
import { LockOutlined, GlobalOutlined, CalendarOutlined } from '@ant-design/icons';
import * as AntdIcons from '@ant-design/icons';
import CIcon from '@coreui/icons-react';
import * as icons from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { BasicInfoFormProps } from './types';
import { useIndustries } from '../../../../contexts/IndustryContext';
import { StyledCascader, StyledSelect, StyledSwitch } from './styles';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';

// 添加所有 solid 图标到库中
library.add(fas);

const { Option } = StyledSelect;
const { Text } = Typography;

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ form, initialValues }) => {
  const { industries, loading } = useIndustries();
  const intl = useIntl();
  const [isPublic, setIsPublic] = useState(initialValues?.visibility === 'public');

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

  // 处理可见性变化
  const handleVisibilityChange = (checked: boolean) => {
    setIsPublic(checked);
    form.setFieldValue('visibility', checked ? 'public' : 'private');
  };

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

  const renderIcon = (iconName: string) => {
    if (!iconName) return null;

    if (iconName.startsWith('cil')) {
      return <CIcon icon={icons[iconName]} style={{ width: '20px', height: '20px' }} />;
    }

    if (iconName.endsWith('Outlined')) {
      const AntIcon = AntdIcons[iconName];
      return <AntIcon style={{ fontSize: '20px' }} />;
    }

    if (iconName.startsWith('fa')) {
      return <FontAwesomeIcon icon={fas[iconName]} style={{ fontSize: '16px' }} />;
    }

    return null;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
    >
      <Row gutter={16}>
        <Col span={16}>
          <Form.Item
            name="name"
            label={<FormattedMessage id="project.name" defaultMessage="项目名称" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'project.name.required', defaultMessage: '请输入项目名称' }) }]}
          >
            <Input 
              placeholder={intl.formatMessage({ id: 'project.name.placeholder', defaultMessage: '请输入项目名称' })} 
              maxLength={50} 
              showCount 
              style={{ borderRadius: '20px' }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="status"
            label={<FormattedMessage id="project.status" defaultMessage="项目状态" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'project.status.required', defaultMessage: '请选择项目状态' }) }]}
          >
            <StyledSelect
              data-testid="project-status-select"
            >
              <Option value="active">{intl.formatMessage({ id: 'project.status.active', defaultMessage: '启用' })}</Option>
              <Option value="inactive">{intl.formatMessage({ id: 'project.status.inactive', defaultMessage: '禁用' })}</Option>
              <Option value="archived">{intl.formatMessage({ id: 'project.status.archived', defaultMessage: '归档' })}</Option>
            </StyledSelect>
          </Form.Item>
        </Col>
      </Row>
      
      {initialValues?.createdAt && (
        <Form.Item>
          <Space align="center">
            <CalendarOutlined style={{ color: 'var(--ant-color-text-secondary)' }} />
            <Text type="secondary">
              <FormattedMessage 
                id="project.createdAt" 
                defaultMessage="创建时间：{time}" 
                values={{
                  time: dayjs(initialValues.createdAt).format('YYYY-MM-DD HH:mm:ss')
                }}
              />
            </Text>
          </Space>
        </Form.Item>
      )}
      
      <Form.Item
        name="description"
        label={<FormattedMessage id="project.description" defaultMessage="项目描述" />}
      >
        <Input.TextArea 
          placeholder={intl.formatMessage({ id: 'project.description.placeholder', defaultMessage: '请输入项目描述' })} 
          maxLength={200} 
          showCount 
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ borderRadius: '20px' }}
        />
      </Form.Item>
      
      <Row gutter={16} align="middle">
        <Col span={16}>
          <Form.Item
            name="industryIds"
            label={<FormattedMessage id="project.industry" defaultMessage="所属行业" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'project.industry.required', defaultMessage: '请选择所属行业' }) }]}
          >
            <StyledCascader
              options={industries}
              placeholder={intl.formatMessage({ id: 'project.industry.placeholder', defaultMessage: '请选择所属行业' })}
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
                    {option && (
                      <span style={{ color: option.iconColor || '#8c8c8c' }}>
                        {option.icon && renderIcon(option.icon)}
                      </span>
                    )}
                    <span style={{ marginLeft: option?.icon ? '4px' : 0 }}>{label}</span>
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
                    <span style={{ color: lastOption?.iconColor || '#8c8c8c' }}>
                      {lastOption?.icon && renderIcon(lastOption.icon)}
                    </span>
                    <span>{lastOption?.name || ''}</span>
                  </div>
                );
              }}
              style={{ width: '100%' }}
              dropdownRender={(menus) => {
                return React.cloneElement(menus as React.ReactElement, {
                  style: { 
                    maxHeight: '400px',
                    overflow: 'auto'
                  }
                });
              }}
              expandIcon={<AntdIcons.RightOutlined />}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ paddingLeft: 0 }}>
          <Form.Item
            name="visibility"
            label={<FormattedMessage id="project.visibility" defaultMessage="可见性" />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'project.visibility.required', defaultMessage: '请选择可见性' }) }]}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <StyledSwitch 
                checkedChildren={<GlobalOutlined />} 
                unCheckedChildren={<LockOutlined />} 
                checked={isPublic}
                onChange={handleVisibilityChange}
              />
              {isPublic ? (
                <span style={{ color: 'var(--ant-color-info)', whiteSpace: 'nowrap' }}>
                  <FormattedMessage id="project.visibility.public" defaultMessage="公开" />
                </span>
              ) : (
                <span style={{ color: 'var(--ant-color-warning)', whiteSpace: 'nowrap' }}>
                  <FormattedMessage id="project.visibility.private" defaultMessage="私有" />
                </span>
              )}
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoForm;