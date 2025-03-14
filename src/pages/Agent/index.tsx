import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import styled from 'styled-components';
import SimpleHeader from '../../components/headers/simple';
import ProjectList from './components/ProjectList';
import ChatArea from './components/ChatArea';
import { Message, Project } from './types';
import axios from '../../api/axios';

const StyledLayout = styled(Layout)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const MainContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  margin-top: 64px;
  position: relative;
  overflow: hidden;
`;

const Sidebar = styled.div<{ collapsed: boolean }>`
  width: ${props => props.collapsed ? '0' : '300px'};
  height: 100%;
  background: ${props => props.theme.token?.colorBgContainer};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.2s ease-in-out;
  position: relative;
  flex-shrink: 0;
  overflow: visible;
  
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 64px;
    bottom: 0;
    z-index: 1000;
    width: 300px;
    transform: translateX(${props => props.collapsed ? '-100%' : '0'});
  }
`;

const SidebarContent = styled.div<{ collapsed: boolean }>`
  width: 300px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateX(${props => props.collapsed ? '-300px' : '0'});
  transition: transform 0.2s ease-in-out;
`;

const SidebarResizer = styled.div<{ $collapsed: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -12px;
  width: 4px;
  height: 80px;
  background-color: ${props => props.theme.mode === 'dark' ? '#ffffff' : '#000000'};
  border-radius: 4px;
  cursor: pointer;
  z-index: 10000;
  transition: all 0.2s ease-in-out;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }

  &:after {
    content: '';
    position: absolute;
    left: -4px;
    right: -4px;
    top: 0;
    bottom: 0;
  }
`;

const Mask = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
  display: ${props => props.visible ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const AgentPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // 加载项目列表
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
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
          console.log('加载的项目列表:', formattedProjects);
        } else {
          message.error(response.data.message || '获取项目列表失败');
        }
      } catch (error) {
        console.error('获取项目列表错误:', error);
        message.error('获取项目列表失败，请稍后重试');
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim() || !activeProjectId) return;

    const newMessage: Message = {
      type: 'user',
      content: inputValue,
      projectId: activeProjectId,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse: Message = {
        type: 'assistant',
        content: '这是一个模拟的AI响应消息。在实际应用中，这里应该调用真实的AI API。',
        projectId: activeProjectId,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleProjectCreate = (project: Project) => {
    setProjects(prev => [...prev, project]);
    setActiveProjectId(project.id);
  };

  const handleProjectUpdate = (projectId: string, project: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, ...project, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const handleProjectDelete = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    console.log('选择项目:', projectId);
    setActiveProjectId(projectId);
    
    // 查找并记录选中的项目信息
    const selectedProject = projects.find(p => p.id === projectId);
    console.log('选中的项目信息:', selectedProject);
  };

  const filteredMessages = messages.filter(msg => msg.projectId === activeProjectId);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // 在移动端点击遮罩时收起侧边栏
  const handleMaskClick = () => {
    setCollapsed(true);
  };

  // 获取当前选中的项目
  const activeProject = projects.find(p => p.id === activeProjectId);
  console.log('当前选中的项目:', activeProject, '项目ID:', activeProjectId);

  return (
    <StyledLayout>
      <SimpleHeader />
      
      <MainContainer>
        <Sidebar collapsed={collapsed}>
          <SidebarContent collapsed={collapsed}>
            <ProjectList
              projects={projects}
              activeProjectId={activeProjectId}
              onProjectSelect={handleProjectSelect}
              onProjectCreate={handleProjectCreate}
              onProjectUpdate={handleProjectUpdate}
              onProjectDelete={handleProjectDelete}
            />
          </SidebarContent>
          <SidebarResizer 
            $collapsed={collapsed} 
            onClick={toggleSidebar}
            title={collapsed ? "展开侧边栏" : "收起侧边栏"}
          />
        </Sidebar>
        
        <Mask visible={!collapsed && window.innerWidth <= 768} onClick={handleMaskClick} />

        <ChatArea 
          messages={filteredMessages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          activeProject={activeProject}
          handleSend={handleSend}
        />
      </MainContainer>
    </StyledLayout>
  );
};

export default AgentPage; 