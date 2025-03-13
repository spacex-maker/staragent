import React, { useEffect } from 'react';
import { List, message, Spin } from 'antd';
import styled from 'styled-components';
import { Project } from '../../types';
import axios from '../../../../api/axios';
import ProjectListHeader from './ProjectListHeader';
import ProjectItem from './ProjectItem';
import ProjectModal from './ProjectModal';

const ProjectListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--ant-color-bg-container);
`;

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  
  .ant-list-item {
    padding: 0;
    border: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
`;

interface ProjectListProps {
  projects: Project[];
  activeProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onProjectCreate: (project: Project) => void;
  onProjectUpdate: (projectId: string, project: Partial<Project>) => void;
  onProjectDelete: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects: externalProjects,
  activeProjectId,
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [fetchLoading, setFetchLoading] = React.useState(true);

  // 获取项目列表
  const fetchProjects = async () => {
    try {
      const response = await axios.get('/productx/sa-project/list');
      if (response.data.success) {
        const formattedProjects = response.data.data.map((project: any) => ({
          id: project.id.toString(),
          name: project.name,
          description: project.description,
          visibility: project.visibility,
          isActive: project.status === 'active',
          createdAt: project.createTime,
          updatedAt: project.updateTime
        }));
        setProjects(formattedProjects);
      } else {
        message.error(response.data.message || '获取项目列表失败');
      }
    } catch (error) {
      console.error('获取项目列表错误:', error);
      message.error('获取项目列表失败，请稍后重试');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalVisible(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalVisible(true);
  };

  const handleModalSuccess = () => {
    fetchProjects();
  };

  if (fetchLoading) {
    return (
      <ProjectListContainer>
        <ProjectListHeader onCreateProject={handleCreateProject} />
        <LoadingContainer>
          <Spin tip="加载中..." />
        </LoadingContainer>
      </ProjectListContainer>
    );
  }

  return (
    <ProjectListContainer>
      <ProjectListHeader onCreateProject={handleCreateProject} />

      <ListContainer>
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
      </ListContainer>

      <ProjectModal
        visible={isModalVisible}
        editingProject={editingProject}
        onSuccess={handleModalSuccess}
        onCancel={() => setIsModalVisible(false)}
        onProjectCreate={onProjectCreate}
        onProjectUpdate={onProjectUpdate}
      />
    </ProjectListContainer>
  );
};

export default ProjectList; 