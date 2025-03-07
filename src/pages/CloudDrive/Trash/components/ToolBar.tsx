import React from 'react';
import { Space, Button, Typography, Input } from 'antd';
import { SearchOutlined, ReloadOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { RoundedButton, RoundedSearch } from '../../components/styles/StyledComponents';
import { ToolBarWrapper, MobileActionBar } from './styles';
import { useMediaQuery } from 'react-responsive';

const { Text } = Typography;

interface ToolBarProps {
  loading: boolean;
  searchText: string;
  selectedCount: number;
  onSearch: (value: string) => void;
  onRefresh: () => void;
  onBatchRestore: () => void;
  onBatchDelete: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  loading,
  searchText,
  selectedCount,
  onSearch,
  onRefresh,
  onBatchRestore,
  onBatchDelete
}) => {
  const intl = useIntl();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const actionButtons = selectedCount > 0 && (
    <>
      <RoundedButton
        icon={<UndoOutlined />}
        onClick={onBatchRestore}
        block={isMobile}
        size={isMobile ? "large" : "middle"}
      >
        还原
      </RoundedButton>
      <RoundedButton
        danger
        icon={<DeleteOutlined />}
        onClick={onBatchDelete}
        block={isMobile}
        size={isMobile ? "large" : "middle"}
      >
        永久删除
      </RoundedButton>
      <Text type="secondary">
        已选择 {selectedCount} 项
      </Text>
    </>
  );

  return (
    <>
      <ToolBarWrapper>
        <Space size={8}>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
            size={isMobile ? "middle" : "middle"}
          >
            <FormattedMessage id="filelist.action.refresh" />
          </Button>
          {!isMobile && actionButtons}
        </Space>
        <RoundedSearch
          placeholder={intl.formatMessage({ id: 'filelist.action.search' })}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => onSearch(e.target.value)}
          allowClear
          style={{ width: isMobile ? 160 : 200 }}
        />
      </ToolBarWrapper>
      {isMobile && selectedCount > 0 && (
        <MobileActionBar>
          <Space size={8}>
            {actionButtons}
          </Space>
        </MobileActionBar>
      )}
    </>
  );
};

export default ToolBar; 