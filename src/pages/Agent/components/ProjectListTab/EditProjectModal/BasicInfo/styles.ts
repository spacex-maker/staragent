import styled from 'styled-components';
import { Cascader } from 'antd';

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