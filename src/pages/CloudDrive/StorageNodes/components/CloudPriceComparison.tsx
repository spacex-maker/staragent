import React from 'react';
import { Typography, Card, Table, Tag, Space, Row, Col, List, Alert } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { InfoCircleOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

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

const PriceTag = styled(Tag)`
  margin: 4px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const CloudPriceComparison: React.FC = () => {
  const storageColumns = [
    {
      title: <FormattedMessage id="cloudPrice.provider" defaultMessage="厂商" />,
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: <FormattedMessage id="cloudPrice.standard" defaultMessage="标准存储" />,
      dataIndex: 'standard',
      key: 'standard',
      render: (text: string) => <PriceTag color="blue">{text}</PriceTag>,
    },
    {
      title: <FormattedMessage id="cloudPrice.lowFreq" defaultMessage="低频存储" />,
      dataIndex: 'lowFreq',
      key: 'lowFreq',
      render: (text: string) => <PriceTag color="green">{text}</PriceTag>,
    },
    {
      title: <FormattedMessage id="cloudPrice.archive" defaultMessage="归档存储" />,
      dataIndex: 'archive',
      key: 'archive',
      render: (text: string) => <PriceTag color="orange">{text}</PriceTag>,
    },
    {
      title: <FormattedMessage id="cloudPrice.note" defaultMessage="备注" />,
      dataIndex: 'note',
      key: 'note',
    },
  ];

  const requestColumns = [
    {
      title: <FormattedMessage id="cloudPrice.provider" defaultMessage="厂商" />,
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: <FormattedMessage id="cloudPrice.getRequest" defaultMessage="GET请求" />,
      dataIndex: 'getRequest',
      key: 'getRequest',
      render: (text: string) => <PriceTag color="blue">{text}</PriceTag>,
    },
    {
      title: <FormattedMessage id="cloudPrice.putRequest" defaultMessage="PUT请求" />,
      dataIndex: 'putRequest',
      key: 'putRequest',
      render: (text: string) => <PriceTag color="green">{text}</PriceTag>,
    },
    {
      title: <FormattedMessage id="cloudPrice.note" defaultMessage="备注" />,
      dataIndex: 'note',
      key: 'note',
    },
  ];

  const trafficColumns = [
    {
      title: <FormattedMessage id="cloudPrice.provider" defaultMessage="厂商" />,
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: <FormattedMessage id="cloudPrice.traffic0to1" defaultMessage="0-1TB" />,
      dataIndex: 'traffic0to1',
      key: 'traffic0to1',
      render: (text: string) => <PriceTag color="blue">{text}</PriceTag>,
    },
    {
      title: <FormattedMessage id="cloudPrice.traffic1to50" defaultMessage="1-50TB" />,
      dataIndex: 'traffic1to50',
      key: 'traffic1to50',
      render: (text: string) => <PriceTag color="green">{text}</PriceTag>,
    },
    {
      title: <FormattedMessage id="cloudPrice.traffic50to100" defaultMessage="50-100TB" />,
      dataIndex: 'traffic50to100',
      key: 'traffic50to100',
      render: (text: string) => <PriceTag color="orange">{text}</PriceTag>,
    },
    {
      title: <FormattedMessage id="cloudPrice.trafficOver100" defaultMessage=">100TB" />,
      dataIndex: 'trafficOver100',
      key: 'trafficOver100',
      render: (text: string) => <PriceTag color="red">{text}</PriceTag>,
    },
  ];

  const storageData = [
    {
      provider: '阿里云 OSS',
      standard: '0.12',
      lowFreq: '0.08',
      archive: '0.033',
      note: '华东1（杭州）',
    },
    {
      provider: '腾讯云 COS',
      standard: '0.118',
      lowFreq: '0.08',
      archive: '0.033',
      note: '华南（广州）',
    },
    {
      provider: '华为云 OBS',
      standard: '0.12',
      lowFreq: '0.08',
      archive: '0.033',
      note: '华东（上海）',
    },
    {
      provider: '百度云 BOS',
      standard: '0.119',
      lowFreq: '0.079',
      archive: '0.032',
      note: '华北（北京）',
    },
    {
      provider: '七牛云 Kodo',
      standard: '0.098',
      lowFreq: '0.05',
      archive: '0.019',
      note: '华东（浙江）',
    },
    {
      provider: '又拍云 USS',
      standard: '0.11',
      lowFreq: '0.07',
      archive: '0.035',
      note: '价格较稳定',
    },
  ];

  const requestData = [
    {
      provider: '阿里云 OSS',
      getRequest: '0.01',
      putRequest: '0.01',
      note: '读写请求',
    },
    {
      provider: '腾讯云 COS',
      getRequest: '0.01',
      putRequest: '0.01',
      note: '读写请求',
    },
    {
      provider: '华为云 OBS',
      getRequest: '0.01',
      putRequest: '0.01',
      note: '读写请求',
    },
    {
      provider: '百度云 BOS',
      getRequest: '0.01',
      putRequest: '0.01',
      note: '读写请求',
    },
    {
      provider: '七牛云 Kodo',
      getRequest: '0.007',
      putRequest: '0.007',
      note: '较便宜',
    },
    {
      provider: '又拍云 USS',
      getRequest: '0.01',
      putRequest: '0.01',
      note: '标准价格',
    },
  ];

  const trafficData = [
    {
      provider: '阿里云 OSS',
      traffic0to1: '0.50',
      traffic1to50: '0.48',
      traffic50to100: '0.45',
      trafficOver100: '0.42',
    },
    {
      provider: '腾讯云 COS',
      traffic0to1: '0.50',
      traffic1to50: '0.48',
      traffic50to100: '0.45',
      trafficOver100: '0.42',
    },
    {
      provider: '华为云 OBS',
      traffic0to1: '0.50',
      traffic1to50: '0.48',
      traffic50to100: '0.45',
      trafficOver100: '0.42',
    },
    {
      provider: '百度云 BOS',
      traffic0to1: '0.49',
      traffic1to50: '0.47',
      traffic50to100: '0.44',
      trafficOver100: '0.41',
    },
    {
      provider: '七牛云 Kodo',
      traffic0to1: '0.29',
      traffic1to50: '0.27',
      traffic50to100: '0.25',
      trafficOver100: '协商',
    },
    {
      provider: '又拍云 USS',
      traffic0to1: '0.45',
      traffic1to50: '0.43',
      traffic50to100: '0.41',
      trafficOver100: '协商',
    },
  ];

  return (
    <Container>
      <StyledCard>
        <Title level={4}>
          <FormattedMessage id="cloudPrice.title" defaultMessage="云存储价格对比" />
        </Title>
        <Text type="secondary">
          <FormattedMessage id="cloudPrice.description" defaultMessage="以下价格仅供参考，实际价格可能会有所变动" />
        </Text>
      </StyledCard>

      <StyledCard>
        <Title level={5}>
          <FormattedMessage id="cloudPrice.storage.title" defaultMessage="存储费用（元/GB/月）" />
        </Title>
        <StyledTable
          columns={storageColumns}
          dataSource={storageData}
          pagination={false}
          rowKey="provider"
        />
      </StyledCard>

      <StyledCard>
        <Title level={5}>
          <FormattedMessage id="cloudPrice.request.title" defaultMessage="请求费用（元/万次）" />
        </Title>
        <StyledTable
          columns={requestColumns}
          dataSource={requestData}
          pagination={false}
          rowKey="provider"
        />
      </StyledCard>

      <StyledCard>
        <Title level={5}>
          <FormattedMessage id="cloudPrice.traffic.title" defaultMessage="外网流出流量费用（元/GB）" />
        </Title>
        <StyledTable
          columns={trafficColumns}
          dataSource={trafficData}
          pagination={false}
          rowKey="provider"
        />
      </StyledCard>

      <StyledCard>
        <Title level={5}>
          <FormattedMessage id="cloudPrice.special.title" defaultMessage="特殊说明" />
        </Title>
        <List
          dataSource={[
            <FormattedMessage id="cloudPrice.special.internalIn" defaultMessage="内网流入流量：所有厂商都免费" />,
            <FormattedMessage id="cloudPrice.special.internalOut" defaultMessage="内网流出流量：所有厂商都免费" />,
            <FormattedMessage id="cloudPrice.special.cdn" defaultMessage="CDN回源流量：一般比外网流出流量便宜" />,
            <FormattedMessage id="cloudPrice.special.retrieval" defaultMessage="数据取回费用：低频和归档存储会收取" />,
            <FormattedMessage id="cloudPrice.special.minStorage" defaultMessage="最小存储单元：标准存储一般无最小限制，低频和归档存储为64KB" />,
          ]}
          renderItem={item => (
            <List.Item>
              <Space>
                <InfoCircleOutlined style={{ color: '#1677ff' }} />
                {item}
              </Space>
            </List.Item>
          )}
        />
      </StyledCard>

      <StyledCard>
        <Title level={5}>
          <FormattedMessage id="cloudPrice.promotion.title" defaultMessage="优惠政策" />
        </Title>
        <List
          dataSource={[
            <FormattedMessage id="cloudPrice.promotion.aliyun" defaultMessage="阿里云：新用户有免费试用额度" />,
            <FormattedMessage id="cloudPrice.promotion.tencent" defaultMessage="腾讯云：新用户有免费试用额度" />,
            <FormattedMessage id="cloudPrice.promotion.huawei" defaultMessage="华为云：新用户有免费试用额度" />,
            <FormattedMessage id="cloudPrice.promotion.qiniu" defaultMessage="七牛云：新用户送存储空间和流量" />,
            <FormattedMessage id="cloudPrice.promotion.upyun" defaultMessage="又拍云：新用户送储存空间" />,
          ]}
          renderItem={item => (
            <List.Item>
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                {item}
              </Space>
            </List.Item>
          )}
        />
      </StyledCard>

      <StyledCard>
        <Title level={5}>
          <FormattedMessage id="cloudPrice.recommendation.title" defaultMessage="选择建议" />
        </Title>
        <List
          dataSource={[
            {
              title: <FormattedMessage id="cloudPrice.recommendation.large.title" defaultMessage="大规模使用" />,
              content: [
                <FormattedMessage id="cloudPrice.recommendation.large.point1" defaultMessage="一线云厂商（稳定性好）" />,
                <FormattedMessage id="cloudPrice.recommendation.large.point2" defaultMessage="可以谈合同价格" />,
                <FormattedMessage id="cloudPrice.recommendation.large.point3" defaultMessage="建议同时使用CDN" />,
              ],
            },
            {
              title: <FormattedMessage id="cloudPrice.recommendation.small.title" defaultMessage="小规模使用" />,
              content: [
                <FormattedMessage id="cloudPrice.recommendation.small.point1" defaultMessage="七牛云（性价比高）" />,
                <FormattedMessage id="cloudPrice.recommendation.small.point2" defaultMessage="又拍云（服务好）" />,
                <FormattedMessage id="cloudPrice.recommendation.small.point3" defaultMessage="可以利用新用户优惠" />,
              ],
            },
            {
              title: <FormattedMessage id="cloudPrice.recommendation.image.title" defaultMessage="图片存储为主" />,
              content: [
                <FormattedMessage id="cloudPrice.recommendation.image.point1" defaultMessage="七牛云（图片处理功能强）" />,
                <FormattedMessage id="cloudPrice.recommendation.image.point2" defaultMessage="又拍云（CDN覆盖好）" />,
              ],
            },
            {
              title: <FormattedMessage id="cloudPrice.recommendation.archive.title" defaultMessage="数据归档为主" />,
              content: [
                <FormattedMessage id="cloudPrice.recommendation.archive.point1" defaultMessage="阿里云（归档功能完善）" />,
                <FormattedMessage id="cloudPrice.recommendation.archive.point2" defaultMessage="华为云（安全性好）" />,
              ],
            },
          ]}
          renderItem={item => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>{item.title}</Text>
                <List
                  dataSource={item.content}
                  renderItem={content => (
                    <List.Item>
                      <Space>
                        <WarningOutlined style={{ color: '#faad14' }} />
                        {content}
                      </Space>
                    </List.Item>
                  )}
                />
              </Space>
            </List.Item>
          )}
        />
      </StyledCard>
    </Container>
  );
};

export default CloudPriceComparison; 