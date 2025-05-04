import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import {
  CalculatorOutlined,
  ToolOutlined,
  ScheduleOutlined,
  TranslationOutlined,
  FormatPainterOutlined,
  SettingOutlined
} from '@ant-design/icons';
import SimpleHeader from '../../components/headers/simple';

const { Sider, Content } = Layout;
const { Title } = Typography;

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--ant-color-bg-layout);
`;

const StyledLayout = styled(Layout)`
  min-height: calc(100vh - 64px);
  background-color: var(--ant-color-bg-layout);
  padding-top: 64px;
`;

const StyledSider = styled(Sider)`
  background-color: var(--ant-color-bg-container);
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  
  .ant-menu {
    background-color: transparent;
    border-right: none;
  }
  
  .ant-menu-item {
    border-radius: 0 20px 20px 0;
    margin: 8px 0;
  }
  
  .ant-menu-item-selected {
    background-color: var(--ant-color-primary-bg);
  }
`;

// 定义ContentWrapper的props接口
interface ContentWrapperProps {
  collapsed: boolean;
}

const ContentWrapper = styled.div<ContentWrapperProps>`
  padding: 24px;
  margin-left: ${props => props.collapsed ? '80px' : '200px'};
  transition: all 0.2s;
  width: calc(100% - ${props => props.collapsed ? '80px' : '200px'});
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
    width: 100%;
  }
`;

const ContentHeader = styled.div`
  margin-bottom: 24px;
`;

const ContentCard = styled.div`
  background-color: var(--ant-color-bg-container);
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  width: 100%;
`;

const Toolkit: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // 工具菜单项配置
  const menuItems = [
    {
      key: 'loan-payment',
      icon: <CalculatorOutlined />,
      label: intl.formatMessage({ id: 'toolkit.menu.loanPayment', defaultMessage: '贷款还款计划表' }),
      path: '/toolkit/loan-payment'
    },
    {
      key: 'code-formatter',
      icon: <FormatPainterOutlined />,
      label: intl.formatMessage({ id: 'toolkit.menu.codeFormatter', defaultMessage: '代码格式化' }),
      path: '/toolkit/code-formatter'
    },
    {
      key: 'text-translator',
      icon: <TranslationOutlined />,
      label: intl.formatMessage({ id: 'toolkit.menu.textTranslator', defaultMessage: '文本翻译' }),
      path: '/toolkit/text-translator'
    },
    {
      key: 'date-calculator',
      icon: <ScheduleOutlined />,
      label: intl.formatMessage({ id: 'toolkit.menu.dateCalculator', defaultMessage: '日期计算器' }),
      path: '/toolkit/date-calculator'
    },
    {
      key: 'other-tools',
      icon: <ToolOutlined />,
      label: intl.formatMessage({ id: 'toolkit.menu.otherTools', defaultMessage: '其他工具' }),
      path: '/toolkit/other-tools'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: intl.formatMessage({ id: 'toolkit.menu.settings', defaultMessage: '工具设置' }),
      path: '/toolkit/settings'
    }
  ];
  
  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    const menuItem = menuItems.find(item => path.includes(item.key));
    return menuItem ? [menuItem.key] : ['loan-payment'];
  };
  
  // 处理菜单项点击
  const handleMenuClick = ({ key }: { key: string }) => {
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };
  
  return (
    <PageContainer>
      <Helmet>
        <title>{intl.formatMessage({ id: 'toolkit.page.title', defaultMessage: '工具箱 - AIMateX' })}</title>
        <meta name="description" content={intl.formatMessage({ id: 'toolkit.page.description', defaultMessage: '多功能工具箱，提供各种实用工具' })} />
      </Helmet>
      
      <SimpleHeader />
      
      <StyledLayout>
        <StyledSider 
          width={200} 
          collapsible 
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="md"
        >
          <Menu
            mode="inline"
            selectedKeys={getSelectedKey()}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </StyledSider>
        
        <ContentWrapper collapsed={collapsed}>
          <ContentHeader>
            <Title level={3}>
              {menuItems.find(item => getSelectedKey()[0] === item.key)?.label || 
               intl.formatMessage({ id: 'toolkit.title', defaultMessage: '工具箱' })}
            </Title>
          </ContentHeader>
          
          <ContentCard>
            <Outlet />
          </ContentCard>
        </ContentWrapper>
      </StyledLayout>
    </PageContainer>
  );
};

export default Toolkit; 