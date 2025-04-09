import React, { useEffect, useState } from 'react';
import { Select, Space, Typography, Tooltip, Spin } from 'antd';
import styled from 'styled-components';
import axios from '../../../../api/axios';
import { AICompany, AIModel } from '../../types';

const { Text } = Typography;

const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
`;

const CompanySelect = styled(Select)`
  width: 180px !important;
  flex-shrink: 0;
  
  .ant-select-selector {
    border-radius: 20px !important;
  }
  
  .ant-select-selection-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ModelSelect = styled(Select)`
  flex: 1;
  min-width: 0; // 防止flex子元素溢出
  
  .ant-select-selector {
    border-radius: 20px !important;
  }

  // 确保下拉菜单宽度与选择框一致
  &.ant-select .ant-select-dropdown {
    min-width: 100% !important;
    width: 100% !important;
  }
`;

const StyledOption = styled(Select.Option)`
  &&& {
    padding: 8px 12px;
  }
`;

const CompanyLogo = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

const CompanyOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

const ModelOption = styled.div`
  padding: 4px 0;
  max-width: 100%;
`;

const ModelName = styled(Text)`
  font-weight: 500;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ModelDescription = styled(Text)`
  color: var(--ant-color-text-secondary);
  font-size: 12px;
  display: block;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ModelInfo = styled.div`
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const InfoItem = styled.span`
  color: var(--ant-color-text-secondary);
  font-size: 12px;
  white-space: nowrap;
`;

const LoadingContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 32px;
`;

interface ModelSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  dropdownMatchSelectWidth?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  value, 
  onChange,
  dropdownMatchSelectWidth = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<AICompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/productx/sa-ai-companies/company-and-model-tree');
      if (response.data.success) {
        setCompanies(response.data.data);
        
        // 如果有value，自动选择对应的公司
        if (value) {
          const company = response.data.data.find(
            (c: AICompany) => c.models.some(m => m.modelCode === value)
          );
          if (company) {
            setSelectedCompany(company.id);
          }
        }
      }
    } catch (error) {
      console.error('获取AI公司列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (companyId: number) => {
    setSelectedCompany(companyId);
    // 清空已选择的模型
    onChange?.(undefined);
  };

  const handleModelChange = (modelCode: string) => {
    onChange?.(modelCode);
  };

  const selectedCompanyData = companies.find(c => c.id === selectedCompany);
  const availableModels = selectedCompanyData?.models || [];

  const formatNumber = (num: number | null) => {
    if (num === null) return '不限';
    return num.toLocaleString();
  };


  if (loading) {
    return (
      <LoadingContainer>
        <Spin />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <CompanySelect
        placeholder="选择AI公司"
        value={selectedCompany}
        onChange={handleCompanyChange}
        optionLabelProp="label"
        dropdownMatchSelectWidth={180}
        listHeight={256}
      >
        {companies.map(company => (
          <Select.Option 
            key={company.id} 
            value={company.id}
            label={
              <CompanyOption>
                <CompanyLogo src={company.logoPath} alt={company.companyName} />
                <span>{company.companyName}</span>
              </CompanyOption>
            }
          >
            <CompanyOption>
              <CompanyLogo src={company.logoPath} alt={company.companyName} />
              <span>{company.companyName}</span>
            </CompanyOption>
          </Select.Option>
        ))}
      </CompanySelect>

      <ModelSelect
        placeholder="选择模型"
        value={value}
        onChange={handleModelChange}
        disabled={!selectedCompany}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        listHeight={400}
        optionLabelProp="label"
      >
        {availableModels.map(model => (
          <Select.Option 
            key={model.id} 
            value={model.modelCode}
            label={model.modelName}
          >
            <ModelOption>
              <ModelName>{model.modelName}</ModelName>
              <ModelDescription>{model.description}</ModelDescription>
              <ModelInfo>
                <Tooltip title="上下文长度">
                  <InfoItem>📝 {formatNumber(model.contextLength)}</InfoItem>
                </Tooltip>
                {model.thoughtChainLength && (
                  <Tooltip title="思维链长度">
                    <InfoItem>🔄 {formatNumber(model.thoughtChainLength)}</InfoItem>
                  </Tooltip>
                )}
                {model.outputLength && (
                  <Tooltip title="输出长度">
                    <InfoItem>📤 {formatNumber(model.outputLength)}</InfoItem>
                  </Tooltip>
                )}
              </ModelInfo>
            </ModelOption>
          </Select.Option>
        ))}
      </ModelSelect>
    </Container>
  );
};

export default ModelSelector; 