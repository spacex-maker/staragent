import React, { useState } from 'react';
import { List } from 'antd';
import styled from 'styled-components';
import { Project } from '../../types';
import ProjectListHeader from './ProjectListHeader';
import ProjectItem from './ProjectItem';
import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';
import { FormattedMessage, useIntl } from 'react-intl';

const ListContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const ListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  min-height: 0;
  
  .ant-list {
    height: 100%;
    min-height: 0;
    
    .ant-list-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ant-list-item {
      padding: 0;
      border: none;
      margin: 8px 0;
    }
  }

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--ant-color-border);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--ant-color-border-hover);
  }

  /* 确保滚动条不占用内容区域宽度 */
  padding-right: 20px;
  margin-right: -20px;
`;

interface ProjectListTabProps {
  projects: Project[];
  activeProjectId: string | null;
  onProjectSelect: (project: Project) => void;
  onProjectCreate: (values: any) => Promise<void>;
  onProjectUpdate: (projectId: string, values: any) => Promise<void>;
  onProjectDelete: (projectId: string) => Promise<void>;
  loading?: boolean;
}

const ProjectListTab: React.FC<ProjectListTabProps> = ({
  projects,
  activeProjectId,
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
  loading = false,
}) => {
  const intl = useIntl();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = () => {
    setIsCreateModalVisible(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditModalVisible(true);
  };

  const handleCreateModalSuccess = () => {
    setIsCreateModalVisible(false);
  };

  const handleEditModalSuccess = () => {
    setIsEditModalVisible(false);
    setEditingProject(null);
  };

  return (
    <ListContainer>
      <ProjectListHeader 
        onCreateProject={handleCreateProject}
      />
      
      <ListContent>
        <List
          itemLayout="horizontal"
          dataSource={projects}
          loading={loading}
          renderItem={(project: Project) => (
            <ProjectItem
              project={project}
              isActive={project.id === activeProjectId}
              onSelect={onProjectSelect}
              onEdit={handleEditProject}
              onDelete={onProjectDelete}
            />
          )}
          locale={{ 
            emptyText: loading 
              ? intl.formatMessage({ id: 'project.loading', defaultMessage: '加载中...' }) 
              : intl.formatMessage({ id: 'project.empty', defaultMessage: '暂无项目，点击上方按钮创建' }),
          }}
        />
      </ListContent>

      <CreateProjectModal
        visible={isCreateModalVisible}
        onSuccess={handleCreateModalSuccess}
        onCancel={() => setIsCreateModalVisible(false)}
        onProjectCreate={onProjectCreate}
      />

      {editingProject && (
        <EditProjectModal
          visible={isEditModalVisible}
          project={editingProject}
          onSuccess={handleEditModalSuccess}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingProject(null);
          }}
          onProjectUpdate={onProjectUpdate}
        />
      )}
    </ListContainer>
  );
};

export default ProjectListTab; 