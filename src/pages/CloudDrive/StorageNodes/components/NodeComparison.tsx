import React from 'react';
import { Typography, Card, Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

const { Title } = Typography;

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

const NodeComparison: React.FC = () => {
  return (
    <Container>
      <StyledCard>
        <Title level={4}>
          <FormattedMessage id="storageNodes.comparison.title" defaultMessage="节点对比" />
        </Title>
        <StyledTable
          columns={[
            {
              title: <FormattedMessage id="storageNodes.comparison.node" defaultMessage="节点" />,
              dataIndex: 'node',
              key: 'node',
            },
            {
              title: <FormattedMessage id="storageNodes.comparison.advantages" defaultMessage="优势" />,
              dataIndex: 'advantages',
              key: 'advantages',
            },
            {
              title: <FormattedMessage id="storageNodes.comparison.disadvantages" defaultMessage="劣势" />,
              dataIndex: 'disadvantages',
              key: 'disadvantages',
            },
          ]}
          dataSource={[
            {
              node: '北京',
              advantages: '覆盖华北地区，网络质量好',
              disadvantages: '价格相对较高',
            },
            {
              node: '上海',
              advantages: '覆盖华东地区，带宽充足',
              disadvantages: '高峰期可能拥堵',
            },
            {
              node: '广州',
              advantages: '覆盖华南地区，价格适中',
              disadvantages: '部分地区访问延迟较高',
            },
            {
              node: '成都',
              advantages: '覆盖西南地区，价格较低',
              disadvantages: '带宽资源相对较少',
            },
            {
              node: '重庆',
              advantages: '覆盖西南地区，价格适中',
              disadvantages: '高峰期可能拥堵',
            },
            {
              node: '南京',
              advantages: '覆盖华东地区，价格适中',
              disadvantages: '部分地区访问延迟较高',
            },
            {
              node: '呼和浩特',
              advantages: '覆盖内蒙古地区，价格较低',
              disadvantages: '带宽资源相对较少',
            },
            {
              node: '香港',
              advantages: '国际访问速度快，带宽充足',
              disadvantages: '价格较高，国内部分地区访问延迟高',
            }
          ]}
          pagination={false}
          rowKey="node"
        />
      </StyledCard>
    </Container>
  );
};

export default NodeComparison; 