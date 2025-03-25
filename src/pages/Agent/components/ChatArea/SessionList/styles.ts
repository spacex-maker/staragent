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

// Header Styles
export const SessionListHeaderContainer = styled.div<PropsWithChildren>`
  padding: 16px;
  border-bottom: 1px solid var(--ant-color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  width: 280px;
  min-width: 280px;
`;

// Content Styles
export const SessionListContentContainer = styled.div<ContainerProps>`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  position: relative;
  min-height: 0;
  width: 280px;
  min-width: 280px;

  /* 滚动条样式 */
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
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--ant-color-border-hover);
  }
`;

export const SessionListContainer = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid var(--ant-color-border);
  width: 280px;
  background: var(--ant-color-bg-container);
  position: relative;
  z-index: 1;
  transition: width 0.3s ease-in-out;
  overflow: visible;

  /* 收起时的样式 */
  &[style*="width: 0px"] {
    width: 0 !important;
    padding: 0;
    margin: 0;
    border-right: none;
  }

  /* 当宽度小于完全展开时隐藏内容 */
  &[style*="width:"] {
    ${SessionListHeaderContainer},
    ${SessionListContentContainer} {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0s, visibility 0s;
    }
  }

  /* 当完全展开时显示内容 */
  &[style*="width: 280px"] {
    ${SessionListHeaderContainer},
    ${SessionListContentContainer} {
      opacity: 1;
      visibility: visible;
      transition: opacity 0.2s ease-in-out 0.3s, visibility 0.2s ease-in-out 0.3s;
    }
  }
`;

export const SessionListResizer = styled.div<{ $collapsed: boolean }>`
  position: absolute;
  top: 30%;
  transform: translateY(-50%);
  right: -12px;
  width: 4px;
  height: 80px;
  background-color: ${props => props.theme.mode === 'dark' ? '#ffffff' : '#000000'};
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.2s ease-in-out;
  opacity: 0.8;
  pointer-events: auto;
  display: block !important;
  
  &:hover {
    opacity: 1;
  }

  &:after {
    content: '';
    position: absolute;
    left: -4px;
    right: -4px;
    top: 0;
    bottom: 0;
  }

  /* 确保收起按钮始终可见 */
  &[style*="width: 0px"] {
    display: block !important;
    opacity: 0.8;
    pointer-events: auto;
  }
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