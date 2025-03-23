export interface Industry {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  visibility: 'public' | 'private';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  industries?: Industry[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  visibility: 'private' | 'public';
}

export interface Message {
  id: number;
  userId: number;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentName: string | null;
  agentId: number | null;
  model: string | null;
  createTime: string;
  updateTime: string;
}

// 前端消息类型，扩展基础消息接口
export interface FrontendMessage extends Partial<Message> {
  id: number;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createTime: string;
  updateTime: string;
  sending?: boolean;
  error?: boolean;
}

// 聊天会话接口
export interface ChatSession {
  id: number;
  userId: number;
  projectId: number;
  title: string;
  lastMessage: string | null;
  messageCount: number;
  createTime: string;
  updateTime: string;
}

// 分页请求参数
export interface PaginationParams {
  currentPage: number;
  pageSize: number;
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

export interface AIModel {
  id: number;
  companyId: number;
  modelName: string;
  modelCode: string;
  releaseYear: string;
  description: string;
  status: boolean;
  contextLength: number | null;
  thoughtChainLength: number | null;
  outputLength: number | null;
  createTime: string;
  updateTime: string | null;
}

export interface AICompany {
  id: number;
  companyName: string;
  apiUrl: string;
  websiteUrl: string;
  description: string;
  logoPath: string;
  defaultModel: string;
  models: AIModel[];
}

export interface CompanyModelTree {
  success: boolean;
  message: string;
  data: AICompany[];
} 