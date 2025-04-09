import React, { useEffect, useState } from 'react';
import { Select, Spin, Tag } from 'antd';
import styled from 'styled-components';
import axios from '../../../../api/axios';
import { useLocale } from '../../../../contexts/LocaleContext';

interface Role {
  id: number;
  name: string;
  description: string;
  category: string;
  parentId: number | null;
  icon: string;
  sortOrder: number;
}

interface GroupedRoles {
  [key: string]: Role[];
}

const Container = styled.div`
  width: 300px;
  max-width: 100%;
  .ant-select {
    width: 100%;
  }
`;

const StyledSelect = styled(Select)`
  .ant-select {
    width: 100%;
  }

  .ant-select-selector {
    border-radius: 20px;
    padding: 4px 8px;
    min-height: 40px;
    max-height: 40px;
    max-width: 100%;
    
    .ant-select-selection-overflow {
      flex-wrap: wrap;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      max-width: 100%;
      max-height: 32px;
      align-content: flex-start;
      
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      
      &::-webkit-scrollbar-thumb {
        background-color: var(--ant-color-split);
        border-radius: 4px;
      }
      
      &:hover::-webkit-scrollbar-thumb {
        background-color: var(--ant-color-text-quaternary);
      }
      
      .ant-select-selection-overflow-item {
        flex-shrink: 0;
      }
    }
  }
  
  .ant-select-multiple .ant-select-selector {
    padding: 4px 8px;
    height: 40px !important;
    overflow: hidden;
  }
  
  .ant-select-multiple .ant-select-selection-item {
    background: var(--ant-color-primary-bg);
    border-color: var(--ant-color-primary);
    color: var(--ant-color-primary);
    border-radius: 20px;
    margin: 2px 4px;
    padding: 2px 8px;
    height: 24px;
    line-height: 20px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    
    .ant-select-selection-item-content {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-right: 0;
      white-space: nowrap;
      font-size: 12px;
    }
    
    .ant-select-selection-item-remove {
      color: var(--ant-color-primary);
      margin-left: 2px;
      padding: 0;
      border-radius: 50%;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 10px;
      
      &:hover {
        color: var(--ant-color-primary-hover);
        background: rgba(0, 0, 0, 0.06);
      }
    }
  }
  
  .ant-select-selection-search {
    position: relative !important;
    margin-inline-start: 0 !important;
    margin-inline-end: 0 !important;
    max-width: 100%;
    
    input {
      min-width: 60px;
    }
  }
`;

const CategoryTag = styled(Tag)`
  margin: 4px 0;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--ant-color-bg-elevated);
  border: 1px solid var(--ant-color-border);
  color: var(--ant-color-text-secondary);
  font-size: 12px;
`;

const RoleOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    object-fit: cover;
  }
`;

const RoleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RoleName = styled.span`
  font-size: 14px;
  color: var(--ant-color-text);
`;

const RoleDescription = styled.span`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
`;

interface RoleSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  dropdownMatchSelectWidth?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  value, 
  onChange,
  dropdownMatchSelectWidth = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [groupedRoles, setGroupedRoles] = useState<GroupedRoles>({});
  const { locale } = useLocale();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/productx/sa-ai-agent-role/list?lang=${locale}`);
        if (response.data.success) {
          const rolesData = response.data.data;
          setRoles(rolesData);
          
          // 按分类分组
          const grouped = rolesData.reduce((acc: GroupedRoles, role: Role) => {
            if (!acc[role.category]) {
              acc[role.category] = [];
            }
            acc[role.category].push(role);
            return acc;
          }, {});
          
          setGroupedRoles(grouped);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [locale]);

  const handleChange = (selectedValues: string[]) => {
    onChange?.(selectedValues);
  };

  const renderSelectedRole = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    if (!role) return null;

    return (
      <>
        {role.icon ? (
          <img 
            src={role.icon} 
            alt={role.name}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              objectFit: 'cover',
              flexShrink: 0
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const iconElement = document.createElement('i');
                iconElement.className = 'bi bi-person-circle';
                iconElement.style.fontSize = '24px';
                parent.insertBefore(iconElement, parent.firstChild);
              }
            }}
          />
        ) : (
          <i className="bi bi-person-circle" style={{ fontSize: '24px', flexShrink: 0 }} />
        )}
        <span style={{ fontSize: '14px' }}>{role.name}</span>
      </>
    );
  };

  if (loading) {
    return <Spin size="small" />;
  }

  return (
    <Container>
      <StyledSelect
        mode="multiple"
        value={value}
        onChange={handleChange}
        placeholder="请选择角色"
        optionFilterProp="children"
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        tagRender={({ label, value: roleName, closable, onClose }) => (
          <div
            style={{
              background: 'var(--ant-color-primary-bg)',
              borderColor: 'var(--ant-color-primary)',
              border: '1px solid',
              color: 'var(--ant-color-primary)',
              borderRadius: '20px',
              margin: '2px 4px',
              padding: '4px 8px',
              height: '28px',
              lineHeight: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            {renderSelectedRole(roleName)}
            {closable && (
              <span
                onClick={onClose}
                style={{
                  cursor: 'pointer',
                  color: 'var(--ant-color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                  marginLeft: 'auto'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.06)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </span>
            )}
          </div>
        )}
      >
        {Object.entries(groupedRoles).map(([category, categoryRoles]) => (
          <Select.OptGroup
            key={category}
            label={
              <CategoryTag>
                {category}
              </CategoryTag>
            }
          >
            {categoryRoles.map(role => (
              <Select.Option key={role.id} value={role.name}>
                <RoleOption>
                  <img src={role.icon} alt={role.name} />
                  <RoleInfo>
                    <RoleName>{role.name}</RoleName>
                    <RoleDescription>{role.description}</RoleDescription>
                  </RoleInfo>
                </RoleOption>
              </Select.Option>
            ))}
          </Select.OptGroup>
        ))}
      </StyledSelect>
    </Container>
  );
};

export default RoleSelector; 