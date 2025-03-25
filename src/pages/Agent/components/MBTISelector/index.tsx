import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import styled from 'styled-components';
import axios from '../../../../api/axios';
import { useLocale } from '../../../../contexts/LocaleContext';
import MBTIIcon from '../../../../components/icons/MBTIIcon';

interface MBTIType {
  typeCode: string;
  name: string;
  nickname: string;
  description: string;
  strengths: string;
  weaknesses: string;
  careerSuggestions: string;
  populationPercentage: number;
  icon: string;
  lang: string;
}

const MBTICard = styled(Card)<{ $selected?: boolean }>`
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 20px;
  height: 100%;
  position: relative;
  
  .ant-card-body {
    padding: 12px 8px;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.$selected && `
    border-color: var(--ant-color-primary);
    background: var(--ant-color-primary-bg);
    
    .ant-card-meta-title {
      color: var(--ant-color-primary);
    }
  `}
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
`;

const TextContent = styled.div`
  text-align: left;
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const TypeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TypeCode = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 1.2;
`;

const TypeName = styled.div`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TypeNickname = styled(TypeName)`
  color: var(--ant-color-text-quaternary);
`;

const Percentage = styled.div`
  font-size: 11px;
  color: var(--ant-color-text-secondary);
  line-height: 1;
  padding: 2px 6px;
  background: var(--ant-color-bg-elevated);
  border-radius: 10px;
  display: inline-block;
  align-self: flex-end;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardsContainer = styled.div`
  max-height: 360px;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--ant-color-border);
    border-radius: 2px;
  }
`;

const DetailSection = styled.div<{ $visible: boolean }>`
  background: var(--ant-color-bg-elevated);
  border-radius: 20px;
  padding: 20px;
  margin-top: 8px;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
  border: 1px solid var(--ant-color-border);
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const DetailTitle = styled.div`
  flex: 1;
`;

const DetailTypeName = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`;

const DetailTypeCode = styled.div`
  font-size: 14px;
  color: var(--ant-color-text-secondary);
`;

const DetailContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const DetailItem = styled.div`
  h4 {
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 8px 0;
    color: var(--ant-color-text-secondary);
  }
  
  p {
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
    color: var(--ant-color-text);
  }
`;

interface MBTISelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const MBTISelector: React.FC<MBTISelectorProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [mbtiTypes, setMbtiTypes] = useState<MBTIType[]>([]);
  const { locale } = useLocale();

  useEffect(() => {
    const fetchMBTITypes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/productx/sa-mbti-type/list?lang=${locale}`);
        if (response.data.success) {
          setMbtiTypes(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch MBTI types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMBTITypes();
  }, [locale]);

  const handleSelect = (typeCode: string) => {
    if (value === typeCode) {
      onChange?.('');  // 如果点击的是当前选中的类型，则取消选中
    } else {
      onChange?.(typeCode);  // 否则选中新的类型
    }
  };

  const selectedType = mbtiTypes.find(type => type.typeCode === value);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Container>
      <CardsContainer>
        <Row gutter={[8, 8]}>
          {mbtiTypes.map(type => (
            <Col xs={12} sm={8} md={6} lg={6} key={type.typeCode}>
              <MBTICard
                $selected={value === type.typeCode}
                onClick={() => handleSelect(type.typeCode)}
                hoverable
              >
                <CardContent>
                  <MBTIIcon type={type.typeCode} size={32} />
                  <TextContent>
                    <div>
                      <TypeInfo>
                        <TypeCode>{type.typeCode}</TypeCode>
                        <TypeName>{type.name}</TypeName>
                      </TypeInfo>
                      <TypeNickname>{type.nickname}</TypeNickname>
                    </div>
                    <Percentage>{type.populationPercentage}% 人群占比</Percentage>
                  </TextContent>
                </CardContent>
              </MBTICard>
            </Col>
          ))}
        </Row>
      </CardsContainer>

      <DetailSection $visible={!!selectedType}>
        {selectedType && (
          <>
            <DetailHeader>
              <MBTIIcon type={selectedType.typeCode} size={48} />
              <DetailTitle>
                <DetailTypeName>{selectedType.name} ({selectedType.nickname})</DetailTypeName>
                <DetailTypeCode>{selectedType.typeCode} · {selectedType.populationPercentage}% 人群占比</DetailTypeCode>
              </DetailTitle>
            </DetailHeader>
            <DetailContent>
              <DetailItem>
                <h4>性格描述</h4>
                <p>{selectedType.description}</p>
              </DetailItem>
              <DetailItem>
                <h4>性格优势</h4>
                <p>{selectedType.strengths}</p>
              </DetailItem>
              <DetailItem>
                <h4>性格劣势</h4>
                <p>{selectedType.weaknesses}</p>
              </DetailItem>
              <DetailItem>
                <h4>职业建议</h4>
                <p>{selectedType.careerSuggestions}</p>
              </DetailItem>
            </DetailContent>
          </>
        )}
      </DetailSection>
    </Container>
  );
};

export default MBTISelector; 