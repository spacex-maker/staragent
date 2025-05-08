import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Card, Typography, Tag, Spin, Empty, Tooltip, Badge } from 'antd';
import { 
  DollarOutlined, 
  FileTextOutlined,
  RetweetOutlined,
  ExportOutlined,
  StarOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import instance from '../../api/axios';
import { FormattedMessage, useIntl } from 'react-intl';

const { Text, Title, Paragraph } = Typography;

// 样式定义
const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    overflow: hidden;
  }

  .ant-modal-body {
    padding: 24px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
`;

const CompanyContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const CompanyLogo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin-right: 12px;
  border-radius: 8px;
`;

const CompanyTitle = styled(Title)`
  margin: 0 !important;
  font-size: 18px !important;
`;

const ModelsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const ModelCard = styled(Card)`
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
  
  .ant-card-body {
    padding: 16px;
  }
`;

const ModelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ModelName = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
`;

const ModelDescription = styled(Paragraph)`
  margin-bottom: 12px !important;
  color: var(--ant-color-text-secondary);
  font-size: 14px;
  
  // 最多显示3行，超出显示省略号
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const InfoList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const InfoItem = styled(Tag)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 0;
  font-size: 12px;
  
  .anticon {
    font-size: 14px;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
`;

const PriceItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--ant-color-success-bg);
  font-size: 12px;
  color: var(--ant-color-success);
  
  .anticon {
    font-size: 14px;
  }
`;

const StyledBadge = styled(Badge)`
  .ant-badge-count {
    background-color: var(--ant-color-primary);
    box-shadow: none;
    font-weight: normal;
    font-size: 12px;
    padding: 0 6px;
  }
`;

const TokenHelpIcon = styled(QuestionCircleOutlined)`
  color: var(--ant-color-primary);
  font-size: 14px;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SupportedModelsModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    if (open) {
      fetchCompanies();
    }
  }, [open]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await instance.get('/productx/sa-ai-companies/company-and-model-tree');
      if (response.data.success) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      console.error('获取AI公司和模型数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num === null) return intl.formatMessage({ id: 'common.unlimited', defaultMessage: '不限' });
    return num.toLocaleString();
  };

  const formatPrice = (price, unit) => {
    return `${unit}${price.toFixed(2)}`;
  };

  const CurrencyIcon = ({ unit }) => {
    return unit === '$' ? <DollarOutlined /> : <span style={{ fontFamily: '-apple-system' }}>¥</span>;
  };

  const renderModels = (models) => {
    if (!models || models.length === 0) {
      return <Empty description={intl.formatMessage({ id: 'supportedModels.empty', defaultMessage: '暂无模型' })} />;
    }

    return (
      <ModelsContainer>
        {models.map(model => (
          <ModelCard key={model.id}>
            <ModelHeader>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ModelName>{model.modelName}</ModelName>
                {model.isHot && (
                  <StyledBadge count={intl.formatMessage({ id: 'supportedModels.hot', defaultMessage: '热门' })} />
                )}
              </div>
            </ModelHeader>
            
            <ModelDescription title={model.description}>
              {model.description}
            </ModelDescription>
            
            <PriceContainer>
              {model.inputPrice && model.outputPrice && model.unit && (
                <>
                  <PriceItem>
                    <CurrencyIcon unit={model.unit} />
                    <span>
                      {intl.formatMessage(
                        { id: 'modelPrice.inputFormat', defaultMessage: '输入: {price}/百万token' },
                        { price: formatPrice(model.inputPrice, model.unit) }
                      )}
                    </span>
                  </PriceItem>
                  <PriceItem>
                    <CurrencyIcon unit={model.unit} />
                    <span>
                      {intl.formatMessage(
                        { id: 'modelPrice.outputFormat', defaultMessage: '输出: {price}/百万token' },
                        { price: formatPrice(model.outputPrice, model.unit) }
                      )}
                    </span>
                  </PriceItem>
                  <Tooltip 
                    title={
                      <div style={{ maxWidth: '300px', lineHeight: '1.5' }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                          {intl.formatMessage({ id: 'token.explanation.title', defaultMessage: 'Token解释：' })}
                        </p>
                        <p style={{ margin: '0 0 4px 0' }}>
                          {intl.formatMessage({ id: 'token.explanation.input', defaultMessage: 'Token输入：一般由对话记录、助手记忆、上下文信息、短期记忆、长期记忆、关键记忆等信息组成。' })}
                        </p>
                        <p style={{ margin: '0' }}>
                          {intl.formatMessage({ id: 'token.explanation.output', defaultMessage: 'Token输出：一般是助手的回复数据。' })}
                        </p>
                      </div>
                    } 
                    color="var(--ant-color-primary-bg)"
                    placement="top"
                    overlayInnerStyle={{ borderRadius: '12px' }}
                  >
                    <TokenHelpIcon />
                  </Tooltip>
                </>
              )}
            </PriceContainer>
            
            <InfoList>
              <Tooltip title={intl.formatMessage({ id: 'supportedModels.contextLength', defaultMessage: '上下文长度' })}>
                <InfoItem color="processing">
                  <FileTextOutlined />
                  {formatNumber(model.contextLength)}
                </InfoItem>
              </Tooltip>
              
              {model.thoughtChainLength && (
                <Tooltip title={intl.formatMessage({ id: 'supportedModels.thoughtChainLength', defaultMessage: '思维链长度' })}>
                  <InfoItem color="warning">
                    <RetweetOutlined />
                    {formatNumber(model.thoughtChainLength)}
                  </InfoItem>
                </Tooltip>
              )}
              
              {model.outputLength && (
                <Tooltip title={intl.formatMessage({ id: 'supportedModels.outputLength', defaultMessage: '输出长度' })}>
                  <InfoItem color="success">
                    <ExportOutlined />
                    {formatNumber(model.outputLength)}
                  </InfoItem>
                </Tooltip>
              )}
              
              <Tooltip title={intl.formatMessage({ id: 'supportedModels.recommendLevel', defaultMessage: '推荐等级' })}>
                <InfoItem color="purple">
                  <StarOutlined />
                  {model.recommendLevel || 3}
                </InfoItem>
              </Tooltip>
            </InfoList>
          </ModelCard>
        ))}
      </ModelsContainer>
    );
  };

  const renderCompanyTab = (company) => {
    if (!company) return null;
    
    return {
      key: company.id.toString(),
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src={company.logoPath} 
            alt={company.companyName} 
            style={{ width: '16px', height: '16px', objectFit: 'contain' }}
          />
          {company.companyName}
        </span>
      ),
      children: (
        <>
          <CompanyContainer>
            <CompanyLogo src={company.logoPath} alt={company.companyName} />
            <div>
              <CompanyTitle level={4}>{company.companyName}</CompanyTitle>
              <Text type="secondary">{company.models?.length || 0} 个模型</Text>
            </div>
          </CompanyContainer>
          {renderModels(company.models)}
        </>
      )
    };
  };

  return (
    <StyledModal
      title={<FormattedMessage id="modal.supportedModels.title" defaultMessage="支持的模型" />}
      open={open}
      onCancel={onClose}
      width={900}
      centered
      footer={null}
    >
      {loading ? (
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      ) : (
        <Tabs 
          type="card"
          items={companies.map(company => renderCompanyTab(company))}
          destroyInactiveTabPane
        />
      )}
    </StyledModal>
  );
};

export default SupportedModelsModal; 