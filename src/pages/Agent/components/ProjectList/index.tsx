import React, { useEffect } from 'react';
import { List, message, Spin, Tabs } from 'antd';
import styled from 'styled-components';
import { Project } from '../../types';
import axios from '../../../../api/axios';
import ProjectListHeader from './ProjectListHeader';
import ProjectItem from './ProjectItem';
import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';
import AIAgentList from '../AIAgentList';

const ProjectListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--ant-color-bg-container);
  border-right: 1px solid var(--ant-color-border);
`;

const TabContainer = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .ant-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .ant-tabs-nav {
    margin: 0;
    padding: 0;
    background: var(--ant-color-bg-container);
    border-bottom: 1px solid var(--ant-color-border);
    
    &::before {
      display: none;
    }

    .ant-tabs-nav-list {
      padding: 0 16px;
      gap: 24px;
    }

    .ant-tabs-tab {
      padding: 12px 0;
      margin: 0;
      font-size: 14px;
      
      &:hover {
        color: var(--ant-color-primary);
      }
      
      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        font-weight: 600;
      }
    }

    .ant-tabs-ink-bar {
      height: 2px;
    }
  }

  .ant-tabs-content-holder {
    flex: 1;
    overflow: hidden;
  }

  .ant-tabs-content {
    height: 100%;
  }

  .ant-tabs-tabpane {
    height: 100%;
    overflow-y: auto;
    padding: 0;
  }
`;

const ListContainer = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  
  .ant-list {
    .ant-list-item {
      padding: 0;
      border: none;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
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
  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
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
    setIsCreateModalVisible(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditModalVisible(true);
  };

  const handleCreateModalSuccess = () => {
    console.log('创建项目成功，刷新项目列表');
    // 延迟一点时间再刷新，确保服务器数据已更新
    setTimeout(() => {
      fetchProjects();
    }, 500);
  };

  const handleEditModalSuccess = () => {
    console.log('编辑项目成功，刷新项目列表');
    // 延迟一点时间再刷新，确保服务器数据已更新
    setTimeout(() => {
      fetchProjects();
    }, 500);
  };

  // 处理删除项目
  const handleProjectDelete = (projectId: string) => {
    // 先调用父组件的删除回调
    onProjectDelete(projectId);
    // 然后刷新项目列表
    fetchProjects();
  };

  // 处理员工列表变化
  const handleAgentsChange = () => {
    // 触发一个自定义事件，通知 InputArea 组件刷新员工列表
    window.dispatchEvent(new CustomEvent('projectAgentsChanged'));
  };

  if (fetchLoading) {
    return (
      <ProjectListContainer>
        <TabContainer>
          <Tabs
            items={[
              {
                key: 'projects',
                label: '项目列表',
                children: (
                  <ListContainer>
                    <Spin tip="加载中..." />
                  </ListContainer>
                ),
              },
              {
                key: 'agents',
                label: 'AI员工',
                children: <AIAgentList />,
              },
            ]}
            defaultActiveKey="projects"
          />
        </TabContainer>
      </ProjectListContainer>
    );
  }

  const items = [
    {
      key: 'projects',
      label: '项目列表',
      children: (
        <ListContainer>
          <ProjectListHeader onCreateProject={handleCreateProject} />
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
                  onDelete={handleProjectDelete}
                />
              )}
              locale={{ emptyText: '暂无项目，点击上方按钮创建' }}
            />
          </ListContent>
        </ListContainer>
      ),
    },
    {
      key: 'agents',
      label: 'AI员工',
      children: <AIAgentList />,
    },
  ];

  return (
    <ProjectListContainer>
      <TabContainer>
        <Tabs
          items={items}
          defaultActiveKey="projects"
          animated={{ tabPane: true }}
        />
      </TabContainer>

      {/* 创建项目模态框 */}
      <CreateProjectModal
        visible={isCreateModalVisible}
        onSuccess={handleCreateModalSuccess}
        onCancel={() => setIsCreateModalVisible(false)}
        onProjectCreate={onProjectCreate}
      />

      {/* 编辑项目模态框 */}
      {editingProject && (
        <EditProjectModal
          visible={isEditModalVisible}
          project={editingProject}
          onSuccess={handleEditModalSuccess}
          onCancel={() => setIsEditModalVisible(false)}
          onProjectUpdate={onProjectUpdate}
          onAgentsChange={handleAgentsChange}
        />
      )}
    </ProjectListContainer>
  );
};

export default ProjectList; 