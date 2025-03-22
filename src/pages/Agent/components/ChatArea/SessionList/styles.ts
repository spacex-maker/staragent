import styled from 'styled-components';
import { Typography, Button } from 'antd';
import { PropsWithChildren, ForwardedRef } from 'react';

const { Text } = Typography;

interface ContainerProps extends PropsWithChildren {
  ref?: ForwardedRef<HTMLDivElement>;
}

interface LoadMoreProps extends PropsWithChildren {
  onClick?: () => void;
}

export const SessionListContainer = styled.div<ContainerProps>`
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
export const SessionListHeaderContainer = styled.div<PropsWithChildren>`
  padding: 12px 16px;
  border-bottom: 1px solid var(--ant-color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SessionListTitle = styled.div<PropsWithChildren>`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TitleText = styled(Text)<PropsWithChildren>`
  font-size: 16px;
  font-weight: 500;
`;

export const NewSessionButton = styled(Button)<PropsWithChildren>`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Content Styles
export const SessionListContentContainer = styled.div<ContainerProps>`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  position: relative;
`;

export const LoadingContainer = styled.div<PropsWithChildren>`
  padding: 20px 0;
  text-align: center;
`;

export const LoadMoreText = styled.div<LoadMoreProps>`
  text-align: center;
  padding: 12px;
  color: var(--ant-color-text-secondary);
  cursor: pointer;
  
  &:hover {
    color: var(--ant-color-primary);
  }
`;

export const NoMoreText = styled.div<PropsWithChildren>`
  text-align: center;
  padding: 12px;
  color: var(--ant-color-text-secondary);
  font-size: 12px;
`; 