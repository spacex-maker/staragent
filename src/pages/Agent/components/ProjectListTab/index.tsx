import React, { useState } from 'react';
import { List } from 'antd';
import styled from 'styled-components';
import { Project } from '../../types';
import ProjectListHeader from './ProjectListHeader';
import ProjectItem from './ProjectItem';
import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';

const ListContainer = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  
  .ant-list {
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
`;

interface ProjectListTabProps {
  projects: Project[];
  activeProjectId: string | null;
  onProjectSelect: (project: Project) => void;
  onProjectCreate: (values: any) => Promise<void>;
  onProjectUpdate: (projectId: string, values: any) => Promise<void>;
  onProjectDelete: (projectId: string) => Promise<void>;
}

const ProjectListTab: React.FC<ProjectListTabProps> = ({
  projects,
  activeProjectId,
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
}) => {
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
          renderItem={(project: Project) => (
            <ProjectItem
              project={project}
              isActive={project.id === activeProjectId}
              onSelect={onProjectSelect}
              onEdit={handleEditProject}
              onDelete={onProjectDelete}
            />
          )}
          locale={{ emptyText: '暂无项目，点击上方按钮创建' }}
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