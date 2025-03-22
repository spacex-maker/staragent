import React, { useState, useEffect, useRef, useCallback, PropsWithChildren } from 'react';
import { Layout, message } from 'antd';
import styled from 'styled-components';
import SimpleHeader from '../../components/headers/simple';
import ProjectList from './components/ProjectList';
import ChatArea from './components/ChatArea';
import { Message, Project } from './types';
import axios from '../../api/axios';
import { IndustryProvider } from './contexts/IndustryContext';

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

interface SidebarProps extends PropsWithChildren<{ collapsed: boolean }> {}
interface SidebarContentProps extends PropsWithChildren<{ collapsed: boolean }> {}
interface SidebarResizerProps extends PropsWithChildren<{ 
  $collapsed: boolean;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
}> {}
interface MaskProps extends PropsWithChildren<{ 
  visible: boolean;
  onClick?: () => void;
}> {}

const Sidebar = styled.div<SidebarProps>`
  width: ${props => props.collapsed ? '0' : '300px'};
  height: 100%;
  background: ${props => props.theme.token?.colorBgContainer};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.2s ease-in-out;
  position: relative;
  flex-shrink: 0;
  overflow: visible;
  z-index: 2;
  
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

const SidebarContent = styled.div<SidebarContentProps>`
  width: 300px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateX(${props => props.collapsed ? '-300px' : '0'});
  transition: transform 0.2s ease-in-out;
`;

const SidebarResizer = styled.div<SidebarResizerProps>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -12px;
  width: 4px;
  height: 80px;
  background-color: ${props => props.theme.mode === 'dark' ? '#ffffff' : '#000000'};
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.2s ease-in-out;
  opacity: 0.8;
  pointer-events: auto;
  
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

const Mask = styled.div<MaskProps>`
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

interface ChatAreaProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  activeProject: Project | undefined;
  handleSend: (sessionId?: string) => Promise<string | undefined>;
  sendLoading?: boolean;
  onCancelRequest?: () => void;
  onClearMessages?: () => void;
  activeSessionId: string | null;
  setActiveSessionId: (sessionId: string | null) => void;
  onSendMessage: (sessionId?: string) => Promise<string | undefined>;
}

const AgentPage: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = React.useState(true);
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null);
  const [activeProject, setActiveProject] = React.useState<Project | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const projectsRef = React.useRef<Project[]>([]);
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [sendLoading, setSendLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const [projectListKey, setProjectListKey] = useState<string>('projects');
  const [shouldTriggerAddAgent, setShouldTriggerAddAgent] = useState(false);

  // 获取项目列表
  const fetchProjects = React.useCallback(async () => {
    try {
      setProjectsLoading(true);
      const response = await axios.get('/productx/sa-project/list');
      if (response.data.success) {
        const formattedProjects = response.data.data.map((project: any) => ({
          id: project.id.toString(),
          name: project.name,
          description: project.description,
          visibility: project.visibility,
          isActive: project.status === 'active',
          createdAt: project.createTime,
          updatedAt: project.updateTime,
          industries: project.industries || []
        }));
        setProjects(formattedProjects);
        projectsRef.current = formattedProjects;
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
  }, []);

  // 只在组件挂载时获取一次项目列表
  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 监听导航到AI员工标签的事件
  useEffect(() => {
    const handleNavigateToAgents = () => {
      setProjectListKey('agents');
      setShouldTriggerAddAgent(true);
    };

    window.addEventListener('navigateToAgents', handleNavigateToAgents);
    return () => {
      window.removeEventListener('navigateToAgents', handleNavigateToAgents);
    };
  }, []);

  // 取消发送消息的请求
  const cancelSendRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setSendLoading(false);
      message.info('已取消请求');
    }
  };

  // 处理项目选择
  const handleProjectSelect = (project: Project) => {
    // 如果点击的是当前已选中的项目，不做任何操作
    if (activeProjectId === project.id) {
      return;
    }
    
    console.log('选择项目:', project.id);
    // 使用批量更新，避免多次渲染
    const updateState = () => {
      setActiveProjectId(project.id);
      setActiveProject(project);
      setInputValue('');
      setActiveSessionId(null);
      setMessages([]);
    };
    
    updateState();
  };

  // 处理项目创建
  const handleProjectCreate = async (values: any) => {
    try {
      const response = await axios.post('/productx/sa-project/create', values);
      if (response.data.success) {
        message.success('创建项目成功');
        fetchProjects();
      } else {
        message.error(response.data.message || '创建项目失败');
      }
    } catch (error) {
      console.error('创建项目错误:', error);
      message.error('创建项目失败，请稍后重试');
    }
  };

  // 处理项目更新
  const handleProjectUpdate = async (projectId: string, values: any) => {
    try {
      const response = await axios.post('/productx/sa-project/update', {
        id: projectId,
        ...values
      });
      if (response.data.success) {
        message.success('更新项目成功');
        fetchProjects();
      } else {
        message.error(response.data.message || '更新项目失败');
      }
    } catch (error) {
      console.error('更新项目错误:', error);
      message.error('更新项目失败，请稍后重试');
    }
  };

  // 处理项目删除
  const handleProjectDelete = async (projectId: string) => {
    try {
      const response = await axios.delete(`/productx/sa-project/${projectId}`);
      if (response.data.success) {
        message.success('删除项目成功');
        if (activeProject?.id === projectId) {
          setActiveProject(null);
          setActiveProjectId(null);
        }
        fetchProjects();
      } else {
        message.error(response.data.message || '删除项目失败');
      }
    } catch (error) {
      console.error('删除项目错误:', error);
      message.error('删除项目失败，请稍后重试');
    }
  };

  const handleSend = async (sessionId?: string): Promise<string | undefined> => {
    if (!inputValue.trim() || !activeProjectId) return undefined;

    // 如果有正在进行的请求，先取消
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // 保存用户消息并清空输入框
    const userMessage = inputValue;
    setInputValue('');
    
    // 发送消息到服务器
    setSendLoading(true);
    try {
      // 如果没有sessionId，先创建一个新的session
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const createSessionResponse = await axios.post('/chat/createSession', {
          projectId: parseInt(activeProjectId),
          name: userMessage.substring(0, 50) // 使用消息的前50个字符作为session名称
        });
        
        if (createSessionResponse.data.success) {
          currentSessionId = createSessionResponse.data.data.id;
          setActiveSessionId(currentSessionId);
        } else {
          throw new Error('创建会话失败');
        }
      }

      // 发送到服务器
      const response = await axios.post('/chat/send', {
        projectId: parseInt(activeProjectId),
        sessionId: currentSessionId,
        content: userMessage
      }, {
        timeout: 120000,
        signal
      });
      
      if (response.data.success) {
        const responseData = response.data.data;
        console.log('服务器返回的消息:', responseData);
        
        if (Array.isArray(responseData) && responseData.length > 0) {
          setMessages(prev => {
            // 保留所有消息，并添加新消息
            const newMessages = [...prev];
            responseData.forEach(msg => {
              // 检查消息是否已存在
              const existingIndex = newMessages.findIndex(m => m.id === msg.id);
              if (existingIndex === -1) {
                newMessages.push(msg);
              }
            });
            console.log('更新后的消息列表:', newMessages);
            return newMessages;
          });
        }
      } else {
        message.error(response.data.message || '发送消息失败');
      }
    } catch (error) {
      console.error('发送消息错误:', error);
      if (!(error instanceof Error && error.name === 'CanceledError')) {
        message.error('发送消息失败，请稍后重试');
        const errorMessage: Message = {
          id: Date.now(),
          userId: 0,
          sessionId: sessionId || '',
          role: 'assistant',
          content: '抱歉，发送消息时出现错误，请稍后重试。',
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          agentName: '系统',
          agentId: 0,
          model: null
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setSendLoading(false);
      abortControllerRef.current = null;
    }
    
    return undefined;
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // 在移动端点击遮罩时收起侧边栏
  const handleMaskClick = () => {
    setCollapsed(true);
  };

  // 清空当前项目的消息
  const clearProjectMessages = () => {
    if (activeProjectId) {
      setMessages([]); // 直接清空所有消息
    }
  };

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setProjectListKey(key);
    // 如果不是从导航事件触发的切换，不要自动打开新增员工弹窗
    if (key !== 'agents') {
      setShouldTriggerAddAgent(false);
    }
  };

  return (
    <IndustryProvider>
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
                activeKey={projectListKey}
                onTabChange={handleTabChange}
                autoTriggerAddAgent={shouldTriggerAddAgent}
              />
            </SidebarContent>
            <SidebarResizer 
              $collapsed={collapsed} 
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              title={collapsed ? "展开侧边栏" : "收起侧边栏"}
            />
          </Sidebar>
          
          <Mask visible={!collapsed && window.innerWidth <= 768} onClick={handleMaskClick} />

          <ChatArea 
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            activeProject={activeProject}
            handleSend={handleSend}
            sendLoading={sendLoading}
            onCancelRequest={cancelSendRequest}
            onClearMessages={clearProjectMessages}
            activeSessionId={activeSessionId}
            setActiveSessionId={setActiveSessionId}
            onSendMessage={handleSend}
          />
        </MainContainer>
      </StyledLayout>
    </IndustryProvider>
  );
};

export default AgentPage; 