import React, { useState } from 'react';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { CloudServerOutlined, LineChartOutlined, DollarOutlined } from '@ant-design/icons';
import NodeRecommendation from './components/NodeRecommendation';
import NodeComparison from './components/NodeComparison';
import CloudPriceComparison from './components/CloudPriceComparison';

const { TabPane } = Tabs;

const StyledTabs = styled(Tabs)`
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-tabs-nav {
    margin: 0;
    padding: 16px 24px 0;
    background: ${props => props.theme.mode === 'dark' ? '#141414' : '#f0f2f5'};
    border-bottom: 1px solid ${props => props.theme.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.06)'};
  }

  .ant-tabs-tab {
    padding: 12px 24px;
    margin: 0 24px 0 0;
    font-size: 16px;
    transition: all 0.3s;

    &:hover {
      color: #1677ff;
    }

    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: #1677ff;
      }
    }
  }

  .ant-tabs-ink-bar {
    height: 3px;
    border-radius: 3px;
    background: #1677ff;
  }

  .ant-tabs-content-holder {
    flex: 1;
    overflow: hidden;
  }

  .ant-tabs-content {
    height: 100%;
  }

  .ant-tabs-tabpane {
    height: 100%;
  }
`;

const StorageNodes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recommendation');

  return (
    <StyledTabs activeKey={activeTab} onChange={setActiveTab}>
      <TabPane
        tab={
          <span>
            <CloudServerOutlined style={{ marginRight: 8 }} />
            <FormattedMessage id="storageNodes.tab.recommendation" defaultMessage="节点推荐" />
          </span>
        }
        key="recommendation"
      >
        <NodeRecommendation />
      </TabPane>
      <TabPane
        tab={
          <span>
            <LineChartOutlined style={{ marginRight: 8 }} />
            <FormattedMessage id="storageNodes.tab.comparison" defaultMessage="节点对比" />
          </span>
        }
        key="comparison"
      >
        <NodeComparison />
      </TabPane>
      <TabPane
        tab={
          <span>
            <DollarOutlined style={{ marginRight: 8 }} />
            <FormattedMessage id="storageNodes.tab.price" defaultMessage="价格对比" />
          </span>
        }
        key="price"
      >
        <CloudPriceComparison />
      </TabPane>
    </StyledTabs>
  );
};

export default StorageNodes; 