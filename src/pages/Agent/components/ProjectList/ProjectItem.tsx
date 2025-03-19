import React from 'react';
import { List, Button, Typography, Tooltip, Space, Modal, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Project, Industry } from '../../types';
import axios from '../../../../api/axios';

const { Text, Paragraph } = Typography;

const ProjectItemWrapper = styled(List.Item)`
  padding: 12px !important;
  margin: 6px 0;
  border-radius: 6px !important;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  position: relative;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
    box-shadow: 0 2px 8px ${({ theme }) => theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.32)' : 'rgba(0, 0, 0, 0.08)'};
  }
`;

const ProjectContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionButton = styled(Button)`
  padding: 2px 6px;
  height: 24px;
  
  &:hover {
    background: var(--ant-color-primary-bg);
    color: var(--ant-color-primary);
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ProjectName = styled(Text)`
  font-size: 15px;
  font-weight: 600;
  flex: 1;
  margin: 0;
`;

const VisibilityTag = styled(Tag)`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0 6px;
  height: 20px;
  line-height: 20px;
  border-radius: 4px;
  
  .anticon {
    font-size: 12px;
  }
`;

const ProjectDescription = styled(Paragraph)`
  color: var(--ant-color-text-secondary);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 !important;
`;

const IndustryTags = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
  
  /* 隐藏滚动条但保持功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  /* 防止标签换行 */
  white-space: nowrap;
  flex-wrap: nowrap;
`;

const IndustryTag = styled(Tag)`
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
  flex-shrink: 0;
  
  i {
    font-size: 12px;
  }
`;

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const handleSelect = () => {
    onSelect(project);
  };

  const handleEdit = () => {
    onEdit(project);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目 "${project.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => onDelete(project.id),
    });
  };

  const getIndustryColor = (code: string) => {
    const colorMap: { [key: string]: string } = {
      'IT': 'blue',
      'FINANCE': 'gold',
      'EDUCATION': 'green',
      'HEALTHCARE': 'red',
      'MANUFACTURING': 'purple',
      'RETAIL': 'orange',
      'ENERGY': 'cyan',
      'TRANSPORTATION': 'geekblue',
      'AGRICULTURE': 'lime',
      'CONSTRUCTION': 'volcano'
    };
    return colorMap[code] || 'default';
  };

  return (
    <ProjectItemWrapper
      className={isActive ? 'active' : ''}
      onClick={handleSelect}
      style={isActive ? {
        background: 'var(--ant-color-primary-bg)',
        borderColor: 'var(--ant-color-primary)'
      } : {}}
    >
      <ProjectContent>
        {/* 第一行：项目图标和操作按钮 */}
        <HeaderRow>
          <ProjectIcon>
            {project.visibility === 'private' ? <LockOutlined /> : <GlobalOutlined />}
          </ProjectIcon>
          <ActionButtons>
            <ActionButton
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            />
            <ActionButton
              type="text"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            />
          </ActionButtons>
        </HeaderRow>

        {/* 第二行：项目名称和可见性标签 */}
        <TitleRow>
          <ProjectName ellipsis={{ tooltip: true }}>
            {project.name}
          </ProjectName>
          {project.visibility === 'private' ? (
            <VisibilityTag color="default">
              <LockOutlined /> 私有
            </VisibilityTag>
          ) : (
            <VisibilityTag color="blue">
              <GlobalOutlined /> 公开
            </VisibilityTag>
          )}
        </TitleRow>

        {/* 第三行：项目描述 */}
        {project.description && (
          <ProjectDescription ellipsis={{ rows: 2, tooltip: true }}>
            {project.description}
          </ProjectDescription>
        )}

        {/* 第四行：行业标签 */}
        {project.industries && project.industries.length > 0 && (
          <IndustryTags>
            {project.industries.map((industry: Industry) => (
              <Tooltip key={industry.id} title={industry.description}>
                <IndustryTag color={getIndustryColor(industry.code)}>
                  <i className={industry.icon} style={{ width: 16, textAlign: 'center' }} />
                  {industry.name}
                </IndustryTag>
              </Tooltip>
            ))}
          </IndustryTags>
        )}
      </ProjectContent>
    </ProjectItemWrapper>
  );
};

export default ProjectItem; 