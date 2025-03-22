import { Button, Layout, Input } from 'antd';
import styled from 'styled-components';

const { Footer } = Layout;
const { TextArea } = Input;

// 使用普通样式组件替代全局样式
export const GlobalMentionsStyle = styled.div`
  .ant-mentions-dropdown {
    border-radius: 20px !important;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
    padding: 2px !important;
    border: 1px solid var(--ant-color-border) !important;
    overflow: hidden;
    
    .ant-mentions-dropdown-menu {
      max-height: 250px;
    }
    
    .ant-mentions-dropdown-menu-item {
      padding: 2px 8px;
      border-radius: 10px;
      transition: all 0.2s;
      margin: 0;
      
      &:hover, &-active {
        background-color: rgba(var(--ant-color-primary-rgb), 0.1);
      }
      
      &-selected {
        background-color: rgba(var(--ant-color-primary-rgb), 0.2);
        font-weight: 500;
      }
    }
  }
  
  /* 添加全局样式覆盖，确保文本区域可以自动调整高度 */
  .ant-input-textarea {
    height: auto !important;
    
    textarea.ant-input {
      height: auto !important;
      min-height: 20px !important;
      max-height: 120px !important;
      overflow-y: auto !important;
      resize: none !important;
    }
  }
`;

export const StyledFooter = styled(Footer)`
  background: var(--ant-color-bg-container);
  border-top: 1px solid var(--ant-color-border);
  padding: 8px;
  width: 100%;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  position: relative;
`;

export const SendButton = styled(Button)`
  height: 36px;
  width: 80px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .anticon {
    font-size: 16px;
    margin-right: 4px;
  }
`;

export const MentionDropdown = styled.div`
  position: absolute;
  left: 12px;
  bottom: 100%;
  margin-bottom: 4px;
  background: ${props => props.theme.mode === 'dark' ? '#1f1f1f' : '#ffffff'};
  border-radius: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.mode === 'dark' ? '#303030' : '#d9d9d9'};
  padding: 2px;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1050;
  width: 280px;
  max-width: 80%;
`;

export const MentionItem = styled.div<{ onClick?: () => void }>`
  padding: 0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  margin: 0;
  
  &:hover {
    background-color: ${props => props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
` as any;

export const MentionOption = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 10px;
  
  .agent-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${props => props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
    color: ${props => props.theme.mode === 'dark' ? '#3b82f6' : '#3b82f6'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    flex-shrink: 0;
  }
  
  .agent-name {
    font-weight: 500;
    font-size: 14px;
  }
  
  .agent-role {
    color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'};
    margin-left: 6px;
    font-size: 12px;
    background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f5f5f5'};
    padding: 1px 6px;
    border-radius: 10px;
    flex-shrink: 0;
  }
`;

export const CustomTextArea = styled(TextArea)`
  flex: 1;
  min-width: 0;
  padding: 7px 12px;
  resize: none;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--ant-color-border);
  transition: all 0.3s ease;
  min-height: 36px;
  max-height: 120px;
  overflow-y: auto;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(var(--ant-color-primary-rgb), 0.2);
    border-color: var(--ant-color-primary);
  }
  
  &:hover {
    border-color: var(--ant-color-primary);
  }
`;

export const LoadingContainer = styled.div`
  flex: 1;
  min-width: 0;
  padding: 0 12px;
  border-radius: 20px;
  border: 1px solid var(--ant-color-border);
  background: var(--ant-color-bg-container);
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`; 