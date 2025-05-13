import React, { useState, useEffect, useCallback } from 'react';
// 热更新测试注释 - 可以删除
import { Modal, Tabs, Card, Button, Row, Col, Typography, Table, Tag, Space, Radio, InputNumber, message, Statistic } from 'antd';
import { CreditCardOutlined, HistoryOutlined, ThunderboltOutlined, CalendarOutlined, CheckCircleFilled } from '@ant-design/icons';
import styled from 'styled-components';
import axios from '../../api/axios';
import { useIntl } from 'react-intl';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    overflow: hidden;
  }
  
  .ant-modal-body {
    padding: 20px 24px;
  }
`;

const PackageCard = styled(Card)`
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;
  height: 100%;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
  
  ${props => props.selected && `
    border: 2px solid var(--ant-color-primary);
    transform: translateY(-5px);
    
    .ant-card-head {
      background: var(--ant-color-primary-bg);
    }
  `}
  
  .ant-card-head {
    border-bottom: 1px solid var(--ant-color-border);
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  
  .package-price {
    font-size: 28px;
    font-weight: 600;
    color: var(--ant-color-primary);
    margin-right: 5px;
  }
  
  .package-original-price {
    font-size: 16px;
    color: var(--ant-color-text-secondary);
    text-decoration: line-through;
  }
  
  .package-discount {
    font-size: 14px;
    color: #ff4d4f;
    margin-left: 8px;
  }
  
  .package-feature {
    margin-bottom: 8px;
    display: flex;
    align-items: flex-start;
    
    .anticon {
      margin-right: 8px;
      margin-top: 4px;
      color: var(--ant-color-primary);
    }
  }
  
  .check-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    color: var(--ant-color-primary);
    font-size: 18px;
  }
`;

const CustomAmountSection = styled.div`
  background: var(--ant-color-bg-container);
  border: 1px solid var(--ant-color-border);
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  
  .input-group {
    display: flex;
    align-items: center;
    margin-top: 12px;
  }
`;

const PaymentButton = styled(Button)`
  margin-top: 24px;
  height: 46px;
  border-radius: 8px;
  font-size: 16px;
`;

const TabContent = styled.div`
  padding: 16px 0;
`;

const TransactionInfo = styled.div`
  .transaction-time {
    color: var(--ant-color-text-secondary);
    font-size: 12px;
    margin-top: 4px;
  }
  
  .transaction-main {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .transaction-amount {
    margin-left: 8px;
    font-weight: bold;
  }
  
  .transaction-currency {
    margin-left: 4px;
    font-weight: normal;
    color: var(--ant-color-text-secondary);
  }
`;

const RechargeModal = ({ open, onClose }) => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('1');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customAmount, setCustomAmount] = useState(100);
  const [accountChangeLogs, setAccountChangeLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0
  });
  const [changeType, setChangeType] = useState('');
  const [coinType, setCoinType] = useState('');

  const packages = [
    {
      id: 'monthly',
      title: intl.formatMessage({ id: 'rechargeModal.package.monthly', defaultMessage: '月卡套餐' }),
      price: 99,
      originalPrice: 129,
      discount: '7.7折',
      tokensPerDay: 5000,
      period: '30天',
      features: [
        intl.formatMessage({ id: 'rechargeModal.feature.dailyTokens', defaultMessage: '每日{tokens}Tokens' }, { tokens: '5,000' }),
        intl.formatMessage({ id: 'rechargeModal.feature.validPeriod', defaultMessage: '有效期{days}天' }, { days: 30 }),
        intl.formatMessage({ id: 'rechargeModal.feature.priority', defaultMessage: '优先响应请求' }),
        intl.formatMessage({ id: 'rechargeModal.feature.support', defaultMessage: '标准客户支持' })
      ]
    },
    {
      id: 'quarterly',
      title: intl.formatMessage({ id: 'rechargeModal.package.quarterly', defaultMessage: '季度卡套餐' }),
      price: 269,
      originalPrice: 387,
      discount: '7折',
      tokensPerDay: 5000,
      period: '90天',
      features: [
        intl.formatMessage({ id: 'rechargeModal.feature.dailyTokens', defaultMessage: '每日{tokens}Tokens' }, { tokens: '5,000' }),
        intl.formatMessage({ id: 'rechargeModal.feature.validPeriod', defaultMessage: '有效期{days}天' }, { days: 90 }),
        intl.formatMessage({ id: 'rechargeModal.feature.priority', defaultMessage: '优先响应请求' }),
        intl.formatMessage({ id: 'rechargeModal.feature.support', defaultMessage: '高级客户支持' })
      ]
    },
    {
      id: 'yearly',
      title: intl.formatMessage({ id: 'rechargeModal.package.yearly', defaultMessage: '年卡套餐' }),
      price: 899,
      originalPrice: 1548,
      discount: '5.8折',
      tokensPerDay: 5000,
      period: '365天',
      features: [
        intl.formatMessage({ id: 'rechargeModal.feature.dailyTokens', defaultMessage: '每日{tokens}Tokens' }, { tokens: '5,000' }),
        intl.formatMessage({ id: 'rechargeModal.feature.validPeriod', defaultMessage: '有效期{days}天' }, { days: 365 }),
        intl.formatMessage({ id: 'rechargeModal.feature.priority', defaultMessage: '最高优先响应请求' }),
        intl.formatMessage({ id: 'rechargeModal.feature.support', defaultMessage: 'VIP客户支持' }),
        intl.formatMessage({ id: 'rechargeModal.feature.exclusive', defaultMessage: '专属功能体验' })
      ]
    }
  ];

  const fetchAccountChangeLogs = useCallback(async (params = {}) => {
    if (loading) return;
    
    setLoading(true);
    try {
      // 构建请求参数
      const requestParams = {
        currentPage: params.currentPage || pagination.currentPage,
        pageSize: params.pageSize || pagination.pageSize,
      };
      
      // 只有当值不为空字符串时才添加到请求参数中
      if ('changeType' in params) {
        if (params.changeType !== '') {
          requestParams.changeType = params.changeType;
        }
      } else if (changeType !== '') {
        requestParams.changeType = changeType;
      }
      
      if ('coinType' in params) {
        if (params.coinType !== '') {
          requestParams.coinType = params.coinType;
        }
      } else if (coinType !== '') {
        requestParams.coinType = coinType;
      }
      
      const response = await axios.get('/productx/user-account-change-log/aimatex-list', { 
        params: requestParams
      });
      
      if (response.data.success) {
        setAccountChangeLogs(response.data.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.totalNum || 0,
          currentPage: params.currentPage || prev.currentPage
        }));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('获取账变记录失败:', error);
      message.error(intl.formatMessage({ id: 'rechargeModal.error.fetchFailed', defaultMessage: '获取账变记录失败' }));
    } finally {
      setLoading(false);
    }
  }, [changeType, coinType, pagination, intl, loading]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open && activeTab === '2') {
      // 仅在打开模态框并且是账变记录标签时加载数据
      fetchAccountChangeLogs({
        currentPage: 1 // 重置为第一页
      });
    }
  }, [open, activeTab]); // 故意省略fetchAccountChangeLogs以避免无限循环

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === '2') {
      fetchAccountChangeLogs({
        currentPage: 1
      });
    }
  };

  const handlePackageSelect = (packageId) => {
    if (selectedPackage === packageId) {
      setSelectedPackage(null);
    } else {
      setSelectedPackage(packageId);
    }
  };

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value);
    // 如果用户输入了自定义金额，取消套餐选择
    if (value > 0 && selectedPackage) {
      setSelectedPackage(null);
    }
  };

  const handlePayment = () => {
    if (selectedPackage) {
      const selectedPkg = packages.find(p => p.id === selectedPackage);
      message.success(intl.formatMessage(
        { id: 'rechargeModal.message.packageSelected', defaultMessage: '您已选择{package}，即将跳转支付...' },
        { package: selectedPkg.title }
      ));
      // 这里添加实际的支付逻辑
      // ...
    } else if (customAmount > 0) {
      message.success(intl.formatMessage(
        { id: 'rechargeModal.message.customAmount', defaultMessage: '您将充值{amount}元，即将跳转支付...' },
        { amount: customAmount }
      ));
      // 这里添加实际的支付逻辑
      // ...
    } else {
      message.warning(intl.formatMessage({ id: 'rechargeModal.message.selectRequired', defaultMessage: '请选择套餐或输入充值金额' }));
    }
  };

  const handleTableChange = (paginationParams, filters) => {
    // 只在页码或每页数量变化时才请求新数据
    if (paginationParams.current !== pagination.currentPage || 
        paginationParams.pageSize !== pagination.pageSize) {
      fetchAccountChangeLogs({
        currentPage: paginationParams.current,
        pageSize: paginationParams.pageSize,
        ...filters
      });
    }
  };

  const handleFilterChange = (type, value) => {
    // 只有当值实际改变时才更新状态和请求数据
    if (type === 'changeType') {
      setChangeType(value);
    } else if (type === 'coinType') {
      setCoinType(value);
    } else {
      // 如果类型无效，直接返回，不触发新的请求
      return;
    }
    
    // 重置到第一页并搜索
    fetchAccountChangeLogs({
      currentPage: 1,
      [type]: value
    });
  };

  const getChangeTypeDisplay = (type) => {
    if (type === 'AI_MODEL_FEE') {
      return intl.formatMessage({ id: 'rechargeModal.changeType.aiModelFee', defaultMessage: '模型调用费用' });
    }
    return type;
  };

  const getChangeTypeColor = (type) => {
    switch (type) {
      case 'AI_MODEL_FEE':
        return 'orange';
      case 'RECHARGE':
        return 'green';
      case 'REFUND':
        return 'blue';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'rechargeModal.table.transactionInfo', defaultMessage: '交易信息' }),
      dataIndex: 'createTime',
      key: 'transactionInfo',
      render: (_, record) => (
        <TransactionInfo>
          <div className="transaction-main">
            <Tag color={getChangeTypeColor(record.changeType)}>
              {getChangeTypeDisplay(record.changeType)}
            </Tag>
            <span 
              className="transaction-amount"
              style={{ color: record.amount < 0 ? '#ff4d4f' : '#52c41a' }}
            >
              {record.amount < 0 ? '' : '+'}
              {parseFloat(record.amount).toFixed(6)}
              <span className="transaction-currency">{record.coinType}</span>
            </span>
          </div>
          <div className="transaction-time">{record.createTime}</div>
        </TransactionInfo>
      )
    },
    {
      title: intl.formatMessage({ id: 'rechargeModal.table.balance', defaultMessage: '变更后余额' }),
      dataIndex: 'balanceAfterChange',
      key: 'balanceAfterChange',
      width: 150,
      align: 'center',
      render: (text) => (
        <span style={{ fontWeight: 'bold' }}>
          {parseFloat(text).toFixed(6)}
        </span>
      )
    },
    {
      title: intl.formatMessage({ id: 'rechargeModal.table.remark', defaultMessage: '备注' }),
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      render: (text) => (
        <span>{text || '-'}</span>
      )
    }
  ];

  return (
    <StyledModal
      title={intl.formatMessage({ id: 'rechargeModal.title', defaultMessage: '账户充值' })}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <span>
              <CreditCardOutlined />
              {intl.formatMessage({ id: 'rechargeModal.tab.recharge', defaultMessage: '充值' })}
            </span>
          }
          key="1"
        >
          <TabContent>
            <Title level={4}>
              {intl.formatMessage({ id: 'rechargeModal.packages.title', defaultMessage: '选择充值套餐' })}
            </Title>
            <Row gutter={[16, 16]}>
              {packages.map(pkg => (
                <Col xs={24} md={8} key={pkg.id}>
                  <PackageCard
                    title={pkg.title}
                    selected={selectedPackage === pkg.id}
                    onClick={() => handlePackageSelect(pkg.id)}
                    hoverable
                  >
                    <div>
                      <span className="package-price">¥{pkg.price}</span>
                      <span className="package-original-price">¥{pkg.originalPrice}</span>
                      <span className="package-discount">{pkg.discount}</span>
                    </div>
                    <Statistic 
                      title={
                        <Space>
                          <ThunderboltOutlined />
                          {intl.formatMessage({ id: 'rechargeModal.dailyLimit', defaultMessage: '每日配额' })}
                        </Space>
                      }
                      value={pkg.tokensPerDay}
                      suffix="Tokens"
                      valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                    />
                    <Statistic 
                      title={
                        <Space>
                          <CalendarOutlined />
                          {intl.formatMessage({ id: 'rechargeModal.period', defaultMessage: '有效期' })}
                        </Space>
                      }
                      value={pkg.period}
                      valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                    />
                    <div style={{ marginTop: '16px' }}>
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="package-feature">
                          <CheckCircleFilled />
                          <div>{feature}</div>
                        </div>
                      ))}
                    </div>
                    {selectedPackage === pkg.id && (
                      <CheckCircleFilled className="check-icon" />
                    )}
                  </PackageCard>
                </Col>
              ))}
            </Row>
            
            <CustomAmountSection>
              <Title level={5}>
                {intl.formatMessage({ id: 'rechargeModal.customAmount.title', defaultMessage: '自定义充值金额' })}
              </Title>
              <Paragraph type="secondary">
                {intl.formatMessage({ id: 'rechargeModal.customAmount.description', defaultMessage: '根据您的需求自定义充值金额，充值金额越多，赠送比例越高' })}
              </Paragraph>
              <div className="input-group">
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={100000}
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  addonBefore="¥"
                  placeholder={intl.formatMessage({ id: 'rechargeModal.customAmount.placeholder', defaultMessage: '请输入充值金额' })}
                />
                {!!selectedPackage && (
                  <Button 
                    type="link" 
                    onClick={() => setSelectedPackage(null)} 
                    style={{ marginLeft: '8px' }}
                  >
                    {intl.formatMessage({ 
                      id: 'rechargeModal.customAmount.switchToCustom', 
                      defaultMessage: '切换到自定义金额' 
                    })}
                  </Button>
                )}
              </div>
            </CustomAmountSection>
            
            <PaymentButton type="primary" block onClick={handlePayment}>
              {intl.formatMessage({ id: 'rechargeModal.button.pay', defaultMessage: '立即支付' })}
            </PaymentButton>
          </TabContent>
        </TabPane>
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              {intl.formatMessage({ id: 'rechargeModal.tab.history', defaultMessage: '账变记录' })}
            </span>
          }
          key="2"
        >
          <TabContent>
            <Space style={{ marginBottom: 16 }}>
              <Radio.Group
                value={changeType}
                onChange={(e) => handleFilterChange('changeType', e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="">
                  {intl.formatMessage({ id: 'rechargeModal.filter.allTypes', defaultMessage: '全部类型' })}
                </Radio.Button>
                <Radio.Button value="AI_MODEL_FEE">
                  {intl.formatMessage({ id: 'rechargeModal.changeType.aiModelFee', defaultMessage: '模型调用费用' })}
                </Radio.Button>
                <Radio.Button value="RECHARGE">
                  {intl.formatMessage({ id: 'rechargeModal.changeType.recharge', defaultMessage: '充值' })}
                </Radio.Button>
              </Radio.Group>
              
              <Radio.Group
                value={coinType}
                onChange={(e) => handleFilterChange('coinType', e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="">
                  {intl.formatMessage({ id: 'rechargeModal.filter.allCurrencies', defaultMessage: '全部币种' })}
                </Radio.Button>
                <Radio.Button value="CNY">CNY</Radio.Button>
                <Radio.Button value="USD">USD</Radio.Button>
              </Radio.Group>
            </Space>
            
            <Table
              columns={columns}
              dataSource={accountChangeLogs}
              rowKey="id"
              loading={loading}
              pagination={{
                current: pagination.currentPage,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `${total} ${intl.formatMessage({ id: 'rechargeModal.table.total', defaultMessage: '条记录' })}`
              }}
              onChange={handleTableChange}
              locale={{
                emptyText: intl.formatMessage({ id: 'rechargeModal.table.empty', defaultMessage: '暂无数据' })
              }}
            />
          </TabContent>
        </TabPane>
      </Tabs>
    </StyledModal>
  );
};

export default RechargeModal; 