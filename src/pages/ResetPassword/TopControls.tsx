import React from 'react';
import { Dropdown } from 'antd';
import { GlobalOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { TopControlsProps } from './types';
import { TopRightControls, IconButton } from './styles';

const TopControls: React.FC<TopControlsProps> = ({
  isDark,
  onThemeToggle,
  locale,
  languages,
  onLocaleChange,
}) => {
  const items = languages.map(language => ({
    key: language.languageCode,
    label: language.languageNameNative
  }));

  return (
    <TopRightControls>
      <IconButton onClick={onThemeToggle}>
        {isDark ? <SunOutlined /> : <MoonOutlined />}
      </IconButton>
      <Dropdown
        menu={{
          items,
          selectedKeys: [locale],
          onClick: ({ key }) => onLocaleChange(key),
        }}
        placement="bottomRight"
      >
        <IconButton>
          <GlobalOutlined />
        </IconButton>
      </Dropdown>
    </TopRightControls>
  );
};

export default TopControls; 