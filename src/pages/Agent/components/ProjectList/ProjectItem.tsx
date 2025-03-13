import React from 'react';
import { List, Button, Typography, Tooltip, Space } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Project } from '../../types';

const { Text, Paragraph } = Typography;

const ProjectItemWrapper = styled(List.Item)`
  margin: 8px 0;
  padding: 12px 16px !important;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-radius: 8px !important;
  background: var(--ant-color-bg-container);
  border: 1px solid var(--ant-color-border) !important;
  
  &:hover {
    background: var(--ant-color-bg-elevated);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  &.active {
    background: var(--ant-color-primary-bg);
    border-color: var(--ant-color-primary) !important;
  }

  .ant-list-item-meta {
    align-items: center;
    margin-bottom: 0;
  }

  .ant-list-item-meta-title {
    margin-bottom: 4px;
  }

  .ant-list-item-action {
    margin-left: 16px;
  }
`;

const ProjectTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProjectDescription = styled(Paragraph)`
  margin-bottom: 0 !important;
  color: var(--ant-color-text-secondary);
  font-size: 12px;
`;

const ActionButtons = styled(Space)`
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  
  ${ProjectItemWrapper}:hover & {
    opacity: 1;
  }
`;

const VisibilityIcon = styled.span`
  color: var(--ant-color-text-secondary);
  margin-right: 8px;
  font-size: 14px;
`;

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: (projectId: string) => void;
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
  return (
    <ProjectItemWrapper
      className={isActive ? 'active' : ''}
      onClick={() => onSelect(project.id)}
    >
      <List.Item.Meta
        title={
          <ProjectTitle>
            <VisibilityIcon>
              {project.visibility === 'private' ? <LockOutlined /> : <GlobalOutlined />}
            </VisibilityIcon>
            <Text strong>{project.name}</Text>
            {project.description && (
              <Tooltip title={project.description}>
                <InfoCircleOutlined style={{ color: 'var(--ant-color-text-secondary)' }} />
              </Tooltip>
            )}
          </ProjectTitle>
        }
        description={
          project.description && (
            <ProjectDescription ellipsis={{ rows: 2 }}>
              {project.description}
            </ProjectDescription>
          )
        }
      />
      <ActionButtons>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
        />
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
        />
      </ActionButtons>
    </ProjectItemWrapper>
  );
};

export default ProjectItem; 