import React from 'react';
import { Button, Popconfirm, Space, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Project } from '../../types';

interface ProjectItemContainerProps {
  $isActive: boolean;
  theme: {
    mode: 'light' | 'dark';
  };
}

const ProjectItemContainer = styled.div<ProjectItemContainerProps>`
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme, $isActive }) => {
    if ($isActive) {
      return theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff';
    }
    return theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)';
  }};
  border: 1px solid ${({ theme, $isActive }) => 
    $isActive ? '#3b82f6' : 
    theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
  };
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme, $isActive }) => {
      if ($isActive) {
        return theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe';
      }
      return theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
    }};
    box-shadow: 0 2px 8px ${({ theme }) => 
      theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.32)' : 'rgba(0, 0, 0, 0.08)'
    };
  }
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ProjectContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProjectName = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: var(--ant-color-text);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
`;

const ProjectDescription = styled.div`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProjectMetaWrapper = styled.div`
  margin: 0 -12px -12px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => 
      theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'
    };
  }
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  padding: 8px 12px;
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }

  .ant-space {
    flex-wrap: nowrap;
    overflow: visible;
  }

  .ant-tag {
    margin: 0 8px 0 0;
    flex-shrink: 0;
    border-radius: 4px;
    background: ${({ theme }) => 
      theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
    };
    border: 1px solid ${({ theme }) => 
      theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
    };
    color: ${({ theme }) => 
      theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.9)' : '#3b82f6'
    };

    &:last-child {
      margin-right: 12px;
    }
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => Promise<void>;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const handleDelete = async () => {
    await onDelete(project.id);
  };

  return (
    <ProjectItemContainer
      $isActive={isActive}
      onClick={() => onSelect(project)}
    >
      <ProjectInfo>
        <TopSection>
          <ProjectContent>
            <ProjectHeader>
              <ProjectName>
                {project.name}
                {project.visibility === 'private' ? (
                  <LockOutlined style={{ color: 'var(--ant-color-warning)' }} />
                ) : (
                  <GlobalOutlined style={{ color: 'var(--ant-color-info)' }} />
                )}
              </ProjectName>
              <ActionButtons onClick={e => e.stopPropagation()}>
                <Tooltip title="编辑项目">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(project)}
                  />
                </Tooltip>
                <Popconfirm
                  title="确定要删除此项目吗？"
                  onConfirm={handleDelete}
                  okText="确定"
                  cancelText="取消"
                >
                  <Tooltip title="删除项目">
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Tooltip>
                </Popconfirm>
              </ActionButtons>
            </ProjectHeader>
            {project.description && (
              <ProjectDescription>
                {project.description}
              </ProjectDescription>
            )}
          </ProjectContent>
        </TopSection>

        <ProjectMetaWrapper>
          <ProjectMeta>
            <Space size={4}>
              {project.industries.map(industry => (
                <Tag key={industry.id} color="blue">
                  {industry.name}
                </Tag>
              ))}
            </Space>
          </ProjectMeta>
        </ProjectMetaWrapper>
      </ProjectInfo>
    </ProjectItemContainer>
  );
};

export default ProjectItem; 