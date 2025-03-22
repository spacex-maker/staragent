import React, { useEffect } from 'react';
import { List, message, Spin, Tabs } from 'antd';
import styled from 'styled-components';
import { Project } from '../../types';
import axios from '../../../../api/axios';
import ProjectListHeader from './ProjectListHeader';
import ProjectItem from './ProjectItem';
import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';
import AIAgentList, { AIAgentListRef } from '../AIAgentList';

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
  onProjectSelect: (project: Project) => void;
  onProjectCreate: (values: any) => Promise<void>;
  onProjectUpdate: (projectId: string, values: any) => Promise<void>;
  onProjectDelete: (projectId: string) => Promise<void>;
  defaultActiveKey?: string;
  activeKey?: string;
  onTabChange?: (key: string) => void;
  autoTriggerAddAgent?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects: externalProjects,
  activeProjectId,
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
  defaultActiveKey = 'projects',
  activeKey,
  onTabChange,
  autoTriggerAddAgent = false
}) => {
  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const aiAgentListRef = React.useRef<AIAgentListRef>(null);
  const [shouldTriggerAddAgent, setShouldTriggerAddAgent] = React.useState(false);

  // 监听是否需要自动触发添加员工
  React.useEffect(() => {
    if (autoTriggerAddAgent && activeKey === 'agents') {
      // 使用setTimeout确保在tab切换完成后再触发模态框
      setTimeout(() => {
        if (aiAgentListRef.current?.triggerAddAgent) {
          aiAgentListRef.current.triggerAddAgent();
        }
      }, 100);
    }
  }, [autoTriggerAddAgent, activeKey]);

  // 监听shouldTriggerAddAgent变化
  React.useEffect(() => {
    if (shouldTriggerAddAgent && activeKey === 'agents') {
      setTimeout(() => {
        if (aiAgentListRef.current?.triggerAddAgent) {
          aiAgentListRef.current.triggerAddAgent();
        }
      }, 100);
      setShouldTriggerAddAgent(false);
    }
  }, [shouldTriggerAddAgent, activeKey]);

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
  };

  // 处理员工列表变化
  const handleAgentsChange = () => {
    window.dispatchEvent(new CustomEvent('projectAgentsChanged'));
  };

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
              dataSource={externalProjects}
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
        </ListContainer>
      ),
    },
    {
      key: 'agents',
      label: 'AI员工',
      children: <AIAgentList 
        ref={aiAgentListRef} 
        onNavigateToAgents={() => {
          setShouldTriggerAddAgent(true);
          onTabChange?.('agents');
        }} 
      />,
    },
  ];

  return (
    <ProjectListContainer>
      <TabContainer>
        <Tabs
          items={items}
          activeKey={activeKey || defaultActiveKey}
          onChange={onTabChange}
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