import React from 'react';
import { Typography } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Project } from '../../types';

const { Title, Text } = Typography;

const ProjectTitleBar = styled.div`
  padding: 16px 24px;
  background: var(--ant-color-bg-container);
  border-bottom: 1px solid var(--ant-color-border);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProjectIcon = styled.div`
  font-size: 20px;
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProjectTitle = styled(Title)`
  margin: 0 !important;
  font-size: 18px !important;
  line-height: 1.5 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectDescription = styled(Text)`
  color: var(--ant-color-text-secondary);
  font-size: 14px;
  display: block;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  return (
    <ProjectTitleBar>
      <ProjectIcon>
        <ProjectOutlined />
      </ProjectIcon>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <ProjectTitle level={4}>{project.name}</ProjectTitle>
        {project.description && (
          <ProjectDescription>
            {project.description}
          </ProjectDescription>
        )}
      </div>
    </ProjectTitleBar>
  );
};

export default ProjectHeader; 