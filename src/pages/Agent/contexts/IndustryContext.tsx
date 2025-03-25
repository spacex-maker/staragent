import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../../../api/axios';
import type { DefaultOptionType } from 'antd/es/cascader';
import { Industry } from '../types';

interface IndustryTreeNode extends Industry {
  children?: IndustryTreeNode[];
}

interface CascaderOption extends DefaultOptionType {
  value: number;
  label: React.ReactNode;
  children?: CascaderOption[];
  isLeaf?: boolean;
  name?: string;
  icon?: string;
  iconColor?: string;
}

interface IndustryContextType {
  industries: CascaderOption[];
  loading: boolean;
}

const IndustryContext = createContext<IndustryContextType>({
  industries: [],
  loading: false
});

export const useIndustries = () => useContext(IndustryContext);

const formatIndustryData = (data: IndustryTreeNode[]): CascaderOption[] => {
  return data.map(item => ({
    value: item.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <i className={item.icon} style={{ width: 16, textAlign: 'center', color: item.iconColor || '#8c8c8c' }} />
        <span>{item.name}</span>
      </div>
    ),
    children: item.children ? formatIndustryData(item.children) : undefined,
    isLeaf: !item.children || item.children.length === 0,
    name: item.name,
    icon: item.icon,
    iconColor: item.iconColor || '#8c8c8c',
  }));
};

export const IndustryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [industries, setIndustries] = useState<CascaderOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIndustries = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/base/industry/tree');
        if (response.data.success) {
          const formattedData = formatIndustryData(response.data.data);
          setIndustries(formattedData);
        }
      } catch (error) {
        console.error('获取行业列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  return (
    <IndustryContext.Provider value={{ industries, loading }}>
      {children}
    </IndustryContext.Provider>
  );
};

export default IndustryContext; 