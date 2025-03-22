import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Divider, Row, Col, Statistic, Card, Avatar, Typography, Upload } from 'antd';
import styled from 'styled-components';
import instance from 'api/axios';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }

  .ant-modal-body {
    padding: 24px;
  }

  .ant-modal-header {
    border-bottom: 1px solid var(--ant-color-split);
  }

  .ant-form-item-label > label {
    color: var(--ant-color-text-secondary);
  }

  textarea.ant-input {
    min-height: 100px;
  }
`;

const UserInfoCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  
  .ant-card-body {
    padding: 24px;
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const UserAvatar = styled(Avatar)`
  width: 100% !important;
  height: 100% !important;
  position: relative;
  z-index: 2;
  border: 2px solid transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled(Title)`
  margin: 0 !important;
  font-size: 1.5rem !important;
`;

const Email = styled(Text)`
  color: var(--ant-color-text-secondary);
`;

const StyledDivider = styled(Divider)`
  margin: 24px 0;
`;

const StatisticCard = styled(Card)`
  border-radius: 8px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  height: 100%;

  .ant-statistic-title {
    color: var(--ant-color-text-secondary);
    font-size: 0.875rem;
    margin-bottom: 8px;
  }

  .ant-statistic-content {
    font-size: 1.25rem;
    color: var(--ant-color-text);
  }
`;

const ReadOnlyField = styled.div`
  margin-bottom: 16px;

  .label {
    font-size: 0.875rem;
    color: var(--ant-color-text-secondary);
    margin-bottom: 4px;
  }

  .value {
    font-size: 1rem;
    color: var(--ant-color-text);
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-radius: 50%;
  overflow: visible;
  width: 64px;
  height: 64px;
  margin-right: 16px;
  
  &:hover .avatar-overlay {
    opacity: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(
      45deg,
      var(--ant-color-primary) 0%,
      #40a9ff 25%,
      #69c0ff 50%,
      #40a9ff 75%,
      var(--ant-color-primary) 100%
    );
    border-radius: 50%;
    z-index: 0;
    animation: rotate 3s linear infinite;
    filter: drop-shadow(0 0 6px var(--ant-color-primary));
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.mode === 'dark' ? '#141414' : '#ffffff'};
    border-radius: 50%;
    z-index: 1;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  z-index: 3;
  border-radius: 50%;
`;

const UserSettingsModal = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    if (open) {
      fetchUserDetails();
    }
  }, [open]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await instance.get('/productx/user/user-detail');
      if (response.data.success) {
        const userData = response.data.data;
        setUserDetails(userData);
        form.setFieldsValue({
          description: userData.description,
          nickname: userData.nickname,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          postalCode: userData.postalCode,
        });
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'error.fetchUserDetails', defaultMessage: '获取用户信息失败' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const response = await instance.post('/productx/user/update', values);
      
      if (response.data.success) {
        message.success(intl.formatMessage({ id: 'success.updateProfile', defaultMessage: '个人信息更新成功' }));
        onSuccess?.();
        onClose();
      } else {
        message.error(response.data.message || intl.formatMessage({ id: 'error.updateProfile', defaultMessage: '更新失败' }));
      }
    } catch (error) {
      if (error.errorFields) {
        return; // Form validation error
      }
      message.error(intl.formatMessage({ id: 'error.updateProfile', defaultMessage: '更新失败' }));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(intl.formatMessage({ id: 'avatar.upload.typeError', defaultMessage: '只支持 JPG/PNG 格式的图片' }));
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(intl.formatMessage({ id: 'avatar.upload.sizeError', defaultMessage: '图片大小不能超过2MB' }));
      return false;
    }

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await instance.post('/productx/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        message.success(intl.formatMessage({ id: 'avatar.upload.success', defaultMessage: '头像更新成功' }));
        await fetchUserDetails();
        onSuccess?.();
      } else {
        message.error(response.data.message || intl.formatMessage({ id: 'avatar.upload.error', defaultMessage: '头像上传失败' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'avatar.upload.error', defaultMessage: '头像上传失败' }));
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  return (
    <StyledModal
      title={<FormattedMessage id="modal.userSettings.title" defaultMessage="个人设置" />}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
    >
      {userDetails && (
        <>
          <UserInfoCard>
            <UserHeader>
              <Upload
                name="avatar"
                showUploadList={false}
                beforeUpload={handleAvatarUpload}
                accept="image/png,image/jpeg"
              >
                <AvatarWrapper>
                  <UserAvatar 
                    size={64} 
                    src={userDetails.avatar}
                    icon={<UserOutlined />}
                  />
                  <AvatarOverlay className="avatar-overlay">
                    <CameraOutlined style={{ fontSize: '20px' }} />
                  </AvatarOverlay>
                </AvatarWrapper>
              </Upload>
              <UserInfo>
                <Username level={4}>{userDetails.username}</Username>
                <Email>{userDetails.email}</Email>
              </UserInfo>
            </UserHeader>

            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8}>
                <StatisticCard>
                  <Statistic 
                    title={<FormattedMessage id="user.balance" defaultMessage="账户余额" />}
                    value={userDetails.balance}
                    precision={2}
                    prefix="¥"
                  />
                </StatisticCard>
              </Col>
              <Col xs={12} sm={8}>
                <StatisticCard>
                  <Statistic 
                    title={<FormattedMessage id="user.creditScore" defaultMessage="信用分" />}
                    value={userDetails.creditScore}
                    suffix="/100"
                  />
                </StatisticCard>
              </Col>
              <Col xs={12} sm={8}>
                <StatisticCard>
                  <Statistic 
                    title={<FormattedMessage id="user.level" defaultMessage="等级" />}
                    value={userDetails.level}
                    prefix="Lv."
                  />
                </StatisticCard>
              </Col>
            </Row>

            <StyledDivider />

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                <ReadOnlyField>
                  <div className="label">
                    <FormattedMessage id="user.phoneNumber" defaultMessage="手机号码" />
                  </div>
                  <div className="value">{userDetails.phoneNumber || '-'}</div>
                </ReadOnlyField>
              </Col>
              <Col xs={24} sm={12}>
                <ReadOnlyField>
                  <div className="label">
                    <FormattedMessage id="user.fullName" defaultMessage="真实姓名" />
                  </div>
                  <div className="value">{userDetails.fullName || '-'}</div>
                </ReadOnlyField>
              </Col>
              <Col xs={24} sm={12}>
                <ReadOnlyField>
                  <div className="label">
                    <FormattedMessage id="user.countryCode" defaultMessage="国家/地区" />
                  </div>
                  <div className="value">{userDetails.countryCode || '-'}</div>
                </ReadOnlyField>
              </Col>
              <Col xs={24} sm={12}>
                <ReadOnlyField>
                  <div className="label">
                    <FormattedMessage id="user.memberLevel" defaultMessage="会员等级" />
                  </div>
                  <div className="value">{userDetails.memberLevel || '-'}</div>
                </ReadOnlyField>
              </Col>
            </Row>
          </UserInfoCard>

          <Form
            form={form}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="nickname"
                  label={<FormattedMessage id="form.nickname" defaultMessage="昵称" />}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="validation.nickname.required" defaultMessage="请输入昵称" />,
                    },
                  ]}
                >
                  <Input maxLength={30} showCount />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="postalCode"
                  label={<FormattedMessage id="form.postalCode" defaultMessage="邮政编码" />}
                  rules={[
                    {
                      pattern: /^\d{6}$/,
                      message: <FormattedMessage id="validation.postalCode.format" defaultMessage="请输入正确的邮政编码" />,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label={<FormattedMessage id="form.description" defaultMessage="自我介绍" />}
            >
              <Input.TextArea maxLength={200} showCount />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="state"
                  label={<FormattedMessage id="form.state" defaultMessage="州/省" />}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="city"
                  label={<FormattedMessage id="form.city" defaultMessage="城市" />}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="address"
                  label={<FormattedMessage id="form.address" defaultMessage="详细地址" />}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </StyledModal>
  );
};

export default UserSettingsModal; 