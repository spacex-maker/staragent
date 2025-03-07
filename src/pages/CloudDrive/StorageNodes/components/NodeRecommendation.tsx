import React, { useState, useMemo } from 'react';
import { Typography, Card, Table, Tag, Space, Row, Col, Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';
import { CloudServerOutlined, LineChartOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Container = styled.div`
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  background: ${props => props.theme.mode === 'dark' ? '#141414' : '#f0f2f5'};
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#fff'};
  border-radius: 12px;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
    : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${props => props.theme.mode === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)'};
  }

  .ant-card-head {
    border-bottom: 1px solid ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)'};
    padding: 16px 24px;
  }

  .ant-card-body {
    padding: 24px;
  }
`;

const RegionTag = styled(Tag)`
  margin: 4px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.02)'};
    font-weight: 600;
  }

  .ant-table-tbody > tr > td {
    padding: 16px;
  }

  .ant-table-tbody > tr:hover > td {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.04)'
      : 'rgba(0, 0, 0, 0.02)'};
  }
`;

const TipsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.02)'};
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: ${props => props.theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.04)'};
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const RegionTitle = styled(Title)`
  margin-bottom: 24px !important;
  color: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.85)'
    : 'rgba(0, 0, 0, 0.85)'} !important;
  font-weight: 600 !important;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 20px;
    background: #1677ff;
    border-radius: 2px;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 24px;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.04)' 
    : '#fff'};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${props => props.theme.mode === 'dark'
    ? '0 2px 8px rgba(0, 0, 0, 0.2)'
    : '0 2px 8px rgba(0, 0, 0, 0.05)'};
`;

const SearchHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const SearchTitle = styled(Title)`
  margin: 0 0 8px 0 !important;
  font-size: 20px !important;
  color: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.85)'
    : 'rgba(0, 0, 0, 0.85)'} !important;
`;

const SearchHelp = styled(Text)`
  color: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.45)'
    : 'rgba(0, 0, 0, 0.45)'};
  font-size: 14px;
`;

const SearchForm = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
  align-items: center;

  .ant-select {
    width: 200px;
    flex-shrink: 0;
  }
`;

const RegionSelect = styled(Select)`
  height: 48px;
  border-radius: 24px;
  background: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(0, 0, 0, 0.02)'};
  transition: all 0.3s ease;

  &:hover, &:focus {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.06)'
      : 'rgba(0, 0, 0, 0.04)'};
  }

  .ant-select-selector {
    height: 48px !important;
    background: transparent !important;
    border: 1px solid ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)'} !important;
    border-radius: 24px !important;
    transition: all 0.3s ease !important;

    &:hover, &:focus {
      border-color: #1677ff !important;
    }
  }

  .ant-select-selection-item {
    line-height: 48px !important;
    font-size: 16px;
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #1677ff !important;
    box-shadow: none !important;
  }
`;

const ProvinceSelect = styled(Select)`
  height: 48px;
  border-radius: 24px;
  background: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(0, 0, 0, 0.02)'};
  transition: all 0.3s ease;

  &:hover, &:focus {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.06)'
      : 'rgba(0, 0, 0, 0.04)'};
  }

  .ant-select-selector {
    height: 48px !important;
    background: transparent !important;
    border: 1px solid ${props => props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)'} !important;
    border-radius: 24px !important;
    transition: all 0.3s ease !important;

    &:hover, &:focus {
      border-color: #1677ff !important;
    }
  }

  .ant-select-selection-item {
    line-height: 48px !important;
    font-size: 16px;
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #1677ff !important;
    box-shadow: none !important;
  }
`;

const SearchTips = styled.div`
  margin-top: 16px;
  padding: 12px 24px;
  background: ${props => props.theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.02)'
    : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .anticon {
    color: #1677ff;
  }
`;

const regionData = [
  {
    region: '华北地区',
    provinces: [
      { name: '北京市', nodes: ['北京'] },
      { name: '天津市', nodes: ['北京'] },
      { name: '河北省', nodes: ['北京'] },
      { name: '山西省', nodes: ['北京'] },
      { name: '内蒙古', nodes: ['北京', '呼和浩特'] }
    ]
  },
  {
    region: '华东地区',
    provinces: [
      { name: '上海市', nodes: ['上海'] },
      { name: '江苏省', nodes: ['南京', '上海'] },
      { name: '浙江省', nodes: ['上海', '南京'] },
      { name: '安徽省', nodes: ['南京', '上海'] },
      { name: '福建省', nodes: ['上海', '广州'] },
      { name: '江西省', nodes: ['南京', '上海'] },
      { name: '山东省', nodes: ['南京', '北京'] },
      { name: '台湾省', nodes: ['上海', '广州'] }
    ]
  },
  {
    region: '华中地区',
    provinces: [
      { name: '河南省', nodes: ['南京', '北京'] },
      { name: '湖北省', nodes: ['南京', '重庆'] },
      { name: '湖南省', nodes: ['广州', '南京'] }
    ]
  },
  {
    region: '华南地区',
    provinces: [
      { name: '广东省', nodes: ['广州'] },
      { name: '广西省', nodes: ['广州'] },
      { name: '海南省', nodes: ['广州'] },
      { name: '香港', nodes: ['广州', '香港'] },
      { name: '澳门', nodes: ['广州', '香港'] }
    ]
  },
  {
    region: '西南地区',
    provinces: [
      { name: '重庆市', nodes: ['重庆'] },
      { name: '四川省', nodes: ['成都'] },
      { name: '贵州省', nodes: ['重庆', '成都'] },
      { name: '云南省', nodes: ['成都', '重庆'] },
      { name: '西藏', nodes: ['成都'] }
    ]
  },
  {
    region: '西北地区',
    provinces: [
      { name: '陕西省', nodes: ['成都', '北京'] },
      { name: '甘肃省', nodes: ['成都', '北京'] },
      { name: '青海省', nodes: ['成都', '北京'] },
      { name: '宁夏', nodes: ['北京', '成都'] },
      { name: '新疆', nodes: ['北京', '成都'] }
    ]
  },
  {
    region: '东北地区',
    provinces: [
      { name: '辽宁省', nodes: ['北京'] },
      { name: '吉林省', nodes: ['北京'] },
      { name: '黑龙江省', nodes: ['北京'] }
    ]
  }
];

const NodeRecommendation: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const intl = useIntl();

  const columns = [
    {
      title: <FormattedMessage id="storageNodes.province" defaultMessage="省份" />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <FormattedMessage id="storageNodes.recommendedNodes" defaultMessage="推荐节点" />,
      dataIndex: 'nodes',
      key: 'nodes',
      render: (nodes: string[]) => (
        <Space>
          {nodes.map((node, index) => (
            <RegionTag key={node} color={index === 0 ? 'blue' : 'green'}>
              {node}
            </RegionTag>
          ))}
        </Space>
      ),
    },
  ];

  const regionOptions = useMemo(() => 
    regionData.map(region => ({
      label: region.region,
      value: region.region
    })), 
    []
  );

  const provinceOptions = useMemo(() => {
    const provinces = regionData.flatMap(region => 
      region.provinces.map(province => ({
        label: province.name,
        value: province.name
      }))
    );
    return provinces;
  }, []);

  const nodeOptions = useMemo(() => {
    const nodes = new Set<string>();
    regionData.forEach(region => {
      region.provinces.forEach(province => {
        province.nodes.forEach(node => nodes.add(node));
      });
    });
    return Array.from(nodes).map(node => ({
      label: node,
      value: node
    }));
  }, []);

  const filteredRegionData = useMemo(() => {
    return regionData
      .filter(region => !selectedRegion || region.region === selectedRegion)
      .map(region => ({
        ...region,
        provinces: region.provinces.filter(province => 
          (!selectedProvince || province.name === selectedProvince) &&
          (!selectedNode || province.nodes.includes(selectedNode))
        )
      }))
      .filter(region => region.provinces.length > 0);
  }, [selectedRegion, selectedProvince, selectedNode]);

  const handleRegionChange = (value: unknown) => {
    setSelectedRegion(value as string | null);
  };

  const handleProvinceChange = (value: unknown) => {
    setSelectedProvince(value as string | null);
  };

  const handleNodeChange = (value: unknown) => {
    setSelectedNode(value as string | null);
  };

  return (
    <Container>
      <StyledCard>
        <Title level={4}>
          <CloudServerOutlined style={{ marginRight: 8, color: '#1677ff' }} />
          <FormattedMessage id="storageNodes.recommendation.title" defaultMessage="节点选择建议" />
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text style={{ fontSize: 16, lineHeight: 1.8 }}>
              <FormattedMessage id="storageNodes.recommendation.description" defaultMessage="根据您的地理位置，我们为您推荐最适合的存储节点，以获得最佳的访问速度。" />
            </Text>
          </Col>
        </Row>
      </StyledCard>

      <SearchContainer>
        <SearchHeader>
          <SearchTitle level={4}>
            <SearchOutlined style={{ marginRight: 8, color: '#1677ff' }} />
            <FormattedMessage id="storageNodes.search.title" defaultMessage="搜索节点" />
          </SearchTitle>
          <SearchHelp>
            <FormattedMessage id="storageNodes.search.help" defaultMessage="选择地域、省份或节点" />
          </SearchHelp>
        </SearchHeader>

        <SearchForm>
          <RegionSelect
            placeholder={<FormattedMessage id="storageNodes.search.region" defaultMessage="选择地域" />}
            allowClear
            value={selectedRegion}
            onChange={handleRegionChange}
            options={regionOptions}
          />
          <ProvinceSelect
            placeholder={<FormattedMessage id="storageNodes.search.province" defaultMessage="选择省份" />}
            allowClear
            value={selectedProvince}
            onChange={handleProvinceChange}
            options={provinceOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          <ProvinceSelect
            placeholder={<FormattedMessage id="storageNodes.search.node" defaultMessage="选择节点" />}
            allowClear
            value={selectedNode}
            onChange={handleNodeChange}
            options={nodeOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </SearchForm>

        <SearchTips>
          <InfoCircleOutlined />
          <Text type="secondary">
            <FormattedMessage 
              id="storageNodes.search.tips" 
              defaultMessage="提示：选择地域、省份或节点" 
            />
          </Text>
        </SearchTips>
      </SearchContainer>

      {filteredRegionData.length > 0 ? (
        filteredRegionData.map((region) => (
          <StyledCard key={region.region}>
            <RegionTitle level={5}>{region.region}</RegionTitle>
            <StyledTable
              columns={columns}
              dataSource={region.provinces}
              pagination={false}
              rowKey="name"
            />
          </StyledCard>
        ))
      ) : (
        <StyledCard>
          <Text type="secondary" style={{ fontSize: 16, display: 'block', textAlign: 'center' }}>
            <FormattedMessage 
              id="storageNodes.search.noResults" 
              defaultMessage="没有找到匹配的结果" 
            />
          </Text>
        </StyledCard>
      )}

      <StyledCard>
        <Title level={4}>
          <LineChartOutlined style={{ marginRight: 8, color: '#1677ff' }} />
          <FormattedMessage id="storageNodes.recommendation.tips" defaultMessage="选择建议" />
        </Title>
        <TipsList>
          <li>
            <FormattedMessage id="storageNodes.recommendation.tip1" defaultMessage="优先选择表中排在前面的地域" />
          </li>
          <li>
            <FormattedMessage id="storageNodes.recommendation.tip2" defaultMessage="如有多个地域可选,建议实际测试后选择延迟最低的" />
          </li>
          <li>
            <FormattedMessage id="storageNodes.recommendation.tip3" defaultMessage="特殊情况下可以选择第二选择的地域" />
          </li>
        </TipsList>
      </StyledCard>
    </Container>
  );
};

export default NodeRecommendation; 