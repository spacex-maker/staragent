import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import SimpleHeader from "components/headers/simple";
import { message } from 'antd';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import AllFiles from './AllFiles';
import Starred from './Starred';
import Folders from './Folders';
import Trash from './Trash';
import StorageNodes from './StorageNodes';

const { Content, Sider } = Layout;

const CloudDrivePage = () => {
  const [selectedKeys, setSelectedKeys] = useState(['all']);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 769);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const intl = useIntl();

  // Add login check
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    setUserInfo(JSON.parse(storedUserInfo));
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 769;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuSelect = (key) => {
    setSelectedKeys([key]);
  };

  // 根据选中的菜单项渲染对应的内容
  const renderContent = () => {
    switch (selectedKeys[0]) {
      case 'all':
        return <AllFiles />;
      case 'starred':
        return <Starred />;
      case 'folders':
        return <Folders />;
      case 'trash':
        return <Trash />;
      case 'storageNodes':
        return <StorageNodes />;
      default:
        return <AllFiles />;
    }
  };

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'page.cloudDrive.title', defaultMessage: '我的云盘' })} - MyStorageX</title>
        <meta name="description" content={intl.formatMessage({ id: 'page.cloudDrive.description', defaultMessage: 'MyStorageX 云盘 - 安全存储和管理您的文件' })} />
      </Helmet>
      <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
        <SimpleHeader />
        <Layout style={{ marginTop: 64, height: 'calc(100vh - 64px)' }}>
          <SideMenu
            selectedKeys={selectedKeys}
            onSelect={handleMenuSelect}
            collapsed={collapsed}
            onCollapse={setCollapsed}
          />
          <Layout style={{ 
            marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
            transition: 'margin-left 0.2s',
            height: '100%',
            overflow: 'hidden'
          }}>
            {renderContent()}
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default CloudDrivePage;