import styled from 'styled-components';
import { Cascader, Select, Switch } from 'antd';

export const StyledCascader = styled(Cascader)`
  .ant-select-selector {
    border-radius: 20px !important;
  }

  .ant-select-multiple .ant-select-selector {
    padding: 4px 4px;
    height: auto !important;
    min-height: 32px;
  }

  .ant-select-multiple .ant-select-selector-content {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    height: 100%;
    padding: 2px 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .ant-select-multiple .ant-select-selector-content::-webkit-scrollbar {
    display: none;
  }

  .ant-select-dropdown {
    border-radius: 12px;
    padding: 4px;
  }

  .ant-cascader-menu {
    border-radius: 8px;
  }

  .ant-cascader-menu-item {
    border-radius: 6px;
    padding: 5px 12px;
    margin: 2px 0;
    
    i {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-right: 8px;
      font-size: 14px;
    }
  }

  .ant-cascader-menu-item:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .ant-cascader-menu-item-active:not(.ant-cascader-menu-item-disabled) {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .ant-cascader-menu-item-selected {
    background-color: var(--ant-color-primary-bg);
  }

  .ant-tag {
    margin: 2px 2px;
    flex-shrink: 0;
  }

  .ant-tag-close-icon {
    margin-left: 2px;
    color: var(--ant-color-primary);
    font-size: 12px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 50%;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ant-tag-close-icon:hover {
    background-color: var(--ant-color-primary);
    color: var(--ant-color-primary-bg);
  }
`;

export const StyledSelect = styled(Select)`
  .ant-select-selector {
    border-radius: 20px !important;
  }
  
  .ant-select-dropdown {
    border-radius: 12px;
    padding: 4px;
  }
  
  .ant-select-item {
    border-radius: 6px;
    padding: 5px 12px;
    margin: 2px 0;
  }
  
  .ant-select-item:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: var(--ant-color-primary-bg);
  }
`;

export const StyledSwitch = styled(Switch)`
  min-width: 56px;
  height: 24px;
  border-radius: 20px;
  
  .ant-switch-handle {
    width: 20px;
    height: 20px;
    top: 2px;
    left: 2px;
    border-radius: 50%;
  }
  
  &.ant-switch-checked .ant-switch-handle {
    left: calc(100% - 22px);
  }
  
  .ant-switch-inner {
    margin: 0 4px 0 24px;
  }
  
  &.ant-switch-checked .ant-switch-inner {
    margin: 0 24px 0 4px;
  }
`; 