export interface Project {
  id: string;
  name: string;
  description?: string;
  visibility: 'private' | 'public';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  visibility: 'private' | 'public';
}

export interface Message {
  id: number;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createTime: string;
  updateTime: string;
  agentName?: string | null;
  agentId?: number | null;
  model?: string | null;
  sending?: boolean;
  error?: boolean;
}

// 聊天会话接口
export interface ChatSession {
  id: string;
  projectId: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createTime?: string;
  updateTime?: string;
}

// 分页请求参数
export interface PaginationParams {
  pageSize: number;
  currentPage: number;
}

// 分页响应数据
export interface PaginationResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface AIAgent {
  id: number;
  name: string;
  modelType: string;
  role: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
  status: string;
  createTime: string;
  updateTime: string | null;
}

export interface ProjectAgent {
  id: number;
  agentId: number;
  projectId: number;
  priority: number;
  enableMemory: boolean;
  enableRag: boolean;
  enableExternal: boolean;
  temperature: number | null;
  maxTokens: number | null;
  createTime: string;
  updateTime: string | null;
  agentName: string;
  modelType: string;
  role: string;
  status: string;
} 