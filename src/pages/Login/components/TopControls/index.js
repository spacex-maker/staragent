import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';
import { 
  HomeOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { TopRightControls, IconButton } from './styles';

export const TopControls = ({ 
  isDark, 
  toggleTheme, 
  locale, 
  languages, 
  changeLocale 
}) => {
  const languageItems = languages.map(language => ({
    key: language.languageCode,
    label: language.languageNameNative
  }));

  return (
    <TopRightControls>
      <IconButton as={Link} to="/welcome" title="返回官网">
        <HomeOutlined />
      </IconButton>
      <IconButton onClick={toggleTheme}>
        {isDark ? <SunOutlined /> : <MoonOutlined />}
      </IconButton>
      <Dropdown
        menu={{
          items: languageItems,
          selectedKeys: [locale],
          onClick: ({ key }) => {
            changeLocale(key);
          },
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