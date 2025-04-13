import React from 'react';
import { Layout, Typography, Tabs, Steps, Card, Button, Timeline } from 'antd';
import styled from 'styled-components';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Step } = Steps;

export const PageContainer = styled(Layout)`
  min-height: 100vh;
  background: var(--ant-color-bg-container);
`;

export const ContentContainer = styled(Content)`
  padding: 40px 50px;
  margin-top: 64px;
  max-width: 1200px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

export const HeaderTitle = styled(Title)`
  margin-bottom: 40px !important;
  text-align: center;
  font-weight: 600 !important;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--ant-color-primary);
    border-radius: 2px;
    width: 80px;
    margin: 0 auto;
  }
`;

export const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 12px 36px rgba(59, 130, 246, 0.12);
    transform: translateY(-5px);
  }
`;

export const ImageContainer = styled.div`
  margin: 24px 0;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--ant-color-border);
  
  img {
    width: 100%;
    object-fit: cover;
    border-radius: 20px;
  }
`;

export const GradientButton = styled(Button)`
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  
  &:hover {
    background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
    color: white;
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 32px;
  }
  
  .ant-tabs-tab {
    padding: 12px 24px;
    margin: 0 16px 0 0;
    transition: all 0.3s;
    border-radius: 8px 8px 0 0;
  }
  
  .ant-tabs-tab-active {
    background-color: var(--ant-color-primary-1);
  }
  
  .ant-tabs-ink-bar {
    height: 4px;
    border-radius: 2px 2px 0 0;
  }
`;

export const StyledSteps = styled(Steps)`
  margin: 20px 0 40px;
  
  .ant-steps-item-icon {
    background: var(--ant-color-primary);
    border-color: var(--ant-color-primary);
  }
  
  .ant-steps-item-title {
    font-weight: 600;
  }
  
  .ant-steps-item-description {
    max-width: 180px;
  }
`;

export const FlowCard = styled(Card)`
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-top: 4px solid var(--ant-color-primary);
  
  &:hover {
    box-shadow: 0 12px 36px rgba(59, 130, 246, 0.1);
    transform: translateY(-3px);
  }
  
  .ant-card-head {
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    min-height: 60px;
  }
  
  .ant-card-head-title {
    font-weight: 600;
    font-size: 18px;
  }
`;

export const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ant-color-primary);
  color: white;
  font-weight: 600;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  margin-right: 16px;
  flex-shrink: 0;
`;

export const StepAction = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed var(--ant-color-border);
`;

export const ActionStep = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--ant-color-text-secondary);
  
  .anticon {
    margin-right: 8px;
    color: var(--ant-color-primary);
    font-size: 16px;
  }
`;

export const StyledTimeline = styled(Timeline)`
  .ant-timeline-item-tail {
    border-left: 2px solid var(--ant-color-primary-3);
  }
  
  .ant-timeline-item-head {
    background-color: var(--ant-color-primary);
    border-color: var(--ant-color-primary);
  }
  
  .ant-timeline-item-content {
    margin-bottom: 20px;
  }
`;

export const TimelineTitle = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  display: block;
  margin-bottom: 8px;
`; 