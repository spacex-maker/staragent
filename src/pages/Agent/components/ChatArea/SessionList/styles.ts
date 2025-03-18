import styled from 'styled-components';
import { Typography, Button, List } from 'antd';

const { Text, Paragraph } = Typography;

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

export const SessionListHeader = styled.div`
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

export const SessionListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  position: relative;
`;

export const SessionItem = styled(List.Item)<{ active: boolean }>`
  padding: 12px !important;
  margin: 8px 0;
  border-radius: 8px !important;
  background: ${({ active, theme }) => 
    active 
      ? 'var(--ant-color-primary-bg)' 
      : theme.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.04)' 
        : 'rgba(0, 0, 0, 0.02)'};
  position: relative;
  border: 1px solid ${({ active }) => 
    active 
      ? 'var(--ant-color-primary)' 
      : 'var(--ant-color-border)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ active, theme }) => 
      active 
        ? 'var(--ant-color-primary-bg)' 
        : theme.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.08)' 
          : 'rgba(0, 0, 0, 0.04)'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

export const SessionTitle = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LastMessage = styled(Paragraph)`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MessageCount = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--ant-color-primary);
  color: white;
  border-radius: 10px;
  padding: 0 6px;
  font-size: 12px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TimeText = styled(Text)`
  font-size: 10px;
  color: var(--ant-color-text-quaternary);
  position: absolute;
  bottom: 4px;
  right: 12px;
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

export const NewSessionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
`; 