import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Divider, Row, Col, Statistic, Card, Avatar, Typography, Upload, Tabs, Radio, Button, Spin } from 'antd';
import styled from 'styled-components';
import instance from 'api/axios';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserOutlined, CameraOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';

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

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  padding: 16px;
  max-height: 320px;
  overflow-y: auto;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)'};
  border-radius: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--ant-color-split);
    border-radius: 3px;
  }
`;

const AvatarOption = styled.div`
  cursor: pointer;
  border-radius: 50%;
  padding: 2px;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? 'var(--ant-color-primary)' : 'transparent'};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const AvatarSelectionModal = styled(Modal)`
  .ant-modal-body {
    max-height: 70vh;
    overflow-y: auto;
  }
`;

const AvatarActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: flex-end;
`;

const UploadWrapper = styled.div`
  position: relative;
  display: inline-block;
  
  .upload-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    border-radius: 6px;
  }
`;

const StyledSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: var(--ant-color-primary);
  }
`;

const PREDEFINED_AVATARS = {
  female: [
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/70703158abc1a7a168cafa664f660f3ddac44374af437c6d8c12e79c2af74a47.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/57f798ea08f28582d837e85bb770635542acd4ef711aa38835611315fd7c538c(1).png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/0e280ecd0bef6563aa03e9bdcb014d2d413f846df3223ecf5141599e982458ad.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/40c291125c6bbaf70dbb4d1c725316a37bbd6f0b72a7f27f60d32750ba2e4982.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/eb05020639b9e22c83ae8c3e213b0c3b048df98ba8c4d3709c8a6de2e43e2a98.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/d175ecfad18f42d6b702f1ce388286e28f97328076dfea786b917eeebe7d515f.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/944903b87f388784831e93c3e7d0991b4588561030d3b3ead46c5a1224d4a23a.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/a4cfee32c5db9f285b3d4cc01a43ebaec6f04269fd52af364e896dd9376d9eec.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/24e7d9bf4a7acc051515f231befddc73838b4bb9955c007f0f5f9c7e4d48ec85.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/323af755098e3e2ef3d5958ea56d588766cde9f6ea59c989b3344de05125f0c5.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/3e7adf7cbbbc4c063098780c7df746d12dd19a49b235ab637055f6aefbe3bbce.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/d6fd8ef88ec5c50e74d6e30c226ec768c5120e375ad31388a533c9333a4c2e1c.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/b252aa7df9d2a1c70849015bb8dd3fde252cac0752105d5a090168a68cc61d84.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/05d1e0bdd876ef942702f3476ebc05b2055471887cb7ea3ef7ce30b664afac3d.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/c3586daee0fcbc3101133ed22a2a365a3ae02fdb1f35d42ab8c1faf48e4da2ef.png'
  ],
  male: [
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/7957cbbcd1c695cb76fc29514f1d421f95b834b6db497b272a35c429a96a8e10.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/b39caf8744e260433553817c4ff1f003c8b5ea171a3dc38d933ad8ca7b30c5bb.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/4cf88ec54d0a71468ea14c9b449645a271d00cbedb0b60df899c132db0276122.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/2e7715f5ed56c7d0864e9b801206553766e72608faba29ee57f1c4530586af49.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/55604c690bba51f296fa335d0820cca470d62cd45554d603e53e1e21d3c34217.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/91d3b590842db94f638fec348cafa060721b38e2993e02b8070752c6bc3265a6.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/c0cc130ea3a9126856a788bd73d81bbc85967be3f3214f273880baa3476f9ec7.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/73027dfd2d0663aca8cb47c24f434d0e50c425a8654850cb219d2ff9b2dd872a.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/b6a6e9babc2accfed11b83c7397c656edaa461933bb85eb9b634e41b3a8d983c.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/d39b076fa2d6f9792eedecf9afbbe519612a97117eceb166d73f8029396d400a.png',
    'https://anakki-1258150206.cos.ap-nanjing.myqcloud.com/images/e58b3f6462eb0f7eb1f82c0aa630aef39fbfbf8208ef07e85d1dc0de42f11959.png'
  ]
};

// 图片压缩工具函数
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 如果图片大于800px，按比例缩小
        if (width > 800) {
          height = Math.round((height * 800) / width);
          width = 800;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // 压缩图片，调整quality直到大小小于200KB
        let quality = 0.9;
        let compressedFile;
        
        const compress = () => {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const binaryData = atob(dataUrl.split(',')[1]);
          const uint8Array = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }
          compressedFile = new Blob([uint8Array], { type: 'image/jpeg' });
          
          if (compressedFile.size > 200 * 1024 && quality > 0.1) {
            quality -= 0.1;
            compress();
          } else {
            const compressedImageFile = new File([compressedFile], file.name, {
              type: 'image/jpeg',
            });
            resolve(compressedImageFile);
          }
        };
        
        compress();
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const UserSettingsModal = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
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

  const handleAvatarSelect = async (avatarUrl) => {
    try {
      setLoading(true);
      const response = await instance.post('/productx/user/update', {
        ...form.getFieldsValue(),
        avatar: avatarUrl
      });
      
      if (response.data.success) {
        message.success(intl.formatMessage({ id: 'avatar.update.success', defaultMessage: '头像更新成功' }));
        await fetchUserDetails();
        onSuccess?.();
        setShowAvatarModal(false);
      } else {
        message.error(response.data.message || intl.formatMessage({ id: 'avatar.update.error', defaultMessage: '头像更新失败' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'avatar.update.error', defaultMessage: '头像更新失败' }));
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
      message.loading(intl.formatMessage({ id: 'avatar.upload.compressing', defaultMessage: '正在处理图片...' }), 0);
      
      // 压缩图片
      const compressedFile = await compressImage(file);
      
      const formData = new FormData();
      formData.append('file', compressedFile);

      message.loading(intl.formatMessage({ id: 'avatar.upload.uploading', defaultMessage: '正在上传...' }), 0);
      const response = await instance.post('/productx/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        message.destroy();
        message.success(intl.formatMessage({ id: 'avatar.upload.success', defaultMessage: '头像上传成功' }));
        await fetchUserDetails();
        onSuccess?.();
      } else {
        message.destroy();
        message.error(response.data.message || intl.formatMessage({ id: 'avatar.upload.error', defaultMessage: '头像上传失败' }));
      }
    } catch (error) {
      message.destroy();
      message.error(intl.formatMessage({ id: 'avatar.upload.error', defaultMessage: '头像上传失败' }));
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  const renderAvatarOptions = (avatars) => (
    <>
      <AvatarGrid>
        {avatars.map((avatar, index) => (
          <AvatarOption
            key={index}
            selected={selectedAvatar === avatar}
            onClick={() => setSelectedAvatar(avatar)}
          >
            <img src={avatar} alt={`Avatar option ${index + 1}`} />
          </AvatarOption>
        ))}
      </AvatarGrid>
      <AvatarActions>
        <UploadWrapper>
          <Upload
            name="avatar"
            showUploadList={false}
            beforeUpload={handleAvatarUpload}
            accept="image/png,image/jpeg"
            disabled={uploadLoading}
          >
            <Button icon={<UploadOutlined />} disabled={uploadLoading}>
              <FormattedMessage id="avatar.upload" defaultMessage="上传头像" />
            </Button>
          </Upload>
          {uploadLoading && (
            <div className="upload-loading">
              <StyledSpin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
          )}
        </UploadWrapper>
        <Button 
          type="primary"
          onClick={() => handleAvatarSelect(selectedAvatar)}
          disabled={!selectedAvatar || uploadLoading}
          loading={loading}
        >
          <FormattedMessage id="avatar.confirm" defaultMessage="确认选择" />
        </Button>
      </AvatarActions>
    </>
  );

  return (
    <>
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
                <AvatarWrapper onClick={() => setShowAvatarModal(true)}>
                  <UserAvatar 
                    size={64} 
                    src={userDetails.avatar}
                    icon={<UserOutlined />}
                  />
                  <AvatarOverlay className="avatar-overlay">
                    <CameraOutlined style={{ fontSize: '20px' }} />
                  </AvatarOverlay>
                </AvatarWrapper>
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

      <AvatarSelectionModal
        title={<FormattedMessage id="modal.avatarSelection.title" defaultMessage="选择头像" />}
        open={showAvatarModal}
        onCancel={() => {
          setShowAvatarModal(false);
          setSelectedAvatar(null);
        }}
        footer={null}
        width={600}
      >
        <Tabs
          items={[
            {
              key: 'female',
              label: <FormattedMessage id="avatar.category.female" defaultMessage="女生头像" />,
              children: renderAvatarOptions(PREDEFINED_AVATARS.female)
            },
            {
              key: 'male',
              label: <FormattedMessage id="avatar.category.male" defaultMessage="男生头像" />,
              children: renderAvatarOptions(PREDEFINED_AVATARS.male)
            }
          ]}
        />
      </AvatarSelectionModal>
    </>
  );
};

export default UserSettingsModal; 