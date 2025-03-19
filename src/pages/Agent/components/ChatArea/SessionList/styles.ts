import styled from 'styled-components';
import { Typography, Button } from 'antd';

const { Text } = Typography;

export const SessionListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid var(--ant-color-border);
  width: 280px;
  background: var(--ant-color-bg-container);
  position: relative;
  z-index: 1;
`;

// Header Styles
export const SessionListHeaderContainer = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid var(--ant-color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SessionListTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TitleText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
`;

export const NewSessionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Content Styles
export const SessionListContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  position: relative;
`;

export const LoadingContainer = styled.div`
  padding: 20px 0;
  text-align: center;
`;

export const LoadMoreText = styled.div`
  text-align: center;
  padding: 12px;
  color: var(--ant-color-text-secondary);
  cursor: pointer;
  
  &:hover {
    color: var(--ant-color-primary);
  }
`;

export const NoMoreText = styled.div`
  text-align: center;
  padding: 12px;
  color: var(--ant-color-text-secondary);
  font-size: 12px;
`; 