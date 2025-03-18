import React, { useState, useEffect, useRef } from 'react';
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
}

const AgentPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  // 添加一个AbortController的引用，用于取消请求
  const abortControllerRef = useRef<AbortController | null>(null);

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

  // 取消发送消息的请求
  const cancelSendRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setSendLoading(false);
      message.info('已取消请求');
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
      // 发送到服务器
      const response = await axios.post('/chat/send', {
        projectId: parseInt(activeProjectId),
        sessionId: sessionId || null,
        content: userMessage
      }, {
        timeout: 120000,
        signal
      });
      
      if (response.data.success) {
        const responseData = response.data.data;
        console.log('服务器返回的消息:', responseData);
        
        if (Array.isArray(responseData) && responseData.length > 0) {
          // 如果是新会话
          if (!sessionId) {
            const newSessionId = responseData[0].sessionId;
            setMessages(responseData);
            return newSessionId;
          } 
          // 如果是现有会话
          else {
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
          sessionId: sessionId || '',
          role: 'assistant',
          content: '抱歉，发送消息时出现错误，请稍后重试。',
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          agentName: '系统',
          agentId: 0
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setSendLoading(false);
      abortControllerRef.current = null;
    }
    
    return undefined;
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
    
    // 如果选择了不同的项目，清空输入框、消息和会话ID
    if (activeProjectId !== projectId) {
      setInputValue('');
      setActiveSessionId(null);
    }
    
    setActiveProjectId(projectId);
    
    // 查找并记录选中的项目信息
    const selectedProject = projects.find(p => p.id === projectId);
    console.log('选中的项目信息:', selectedProject);
  };

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

  // 清空当前项目的消息
  const clearProjectMessages = () => {
    if (activeProjectId) {
      setMessages([]); // 直接清空所有消息
    }
  };

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
          activeProject={activeProject || null}
          handleSend={handleSend}
          sendLoading={sendLoading}
          onCancelRequest={cancelSendRequest}
          onClearMessages={clearProjectMessages}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
        />
      </MainContainer>
    </StyledLayout>
  );
};

export default AgentPage; 