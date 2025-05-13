export interface Industry {
  id: number;
  name: string;
  code: string;
  icon: string;
  iconColor?: string;
  description?: string;
  children?: Industry[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  visibility: 'public' | 'private';
  status: 'active' | 'inactive' | 'archived';
  isActive: boolean;
  industries: Industry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  visibility: 'private' | 'public';
  status: 'active' | 'inactive' | 'archived';
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
  avatarUrl?: string | null;
  createTime: string;
  updateTime: string;
  contextTokens?: number;
  contentTokens?: number;
  promptCost?: number;
  completionCost?: number;
  unit?: string;
  isFreeReq?: boolean;
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
  contextTokens?: number;
  contentTokens?: number;
  promptCost?: number;
  completionCost?: number;
  unit?: string;
  isFreeReq?: boolean;
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
  temperature: number;
  maxTokens: number;
  prompt: string;
  roles: string[];
  status: 'active' | 'inactive';
  avatarUrl?: string;
  bgImg?: string;
  gender?: boolean | null; // true：男，false：女，null：未知
  createTime: string;
  copyTimes?: number; // 被招募次数
}

export interface ProjectAgent {
  id: number;
  agentId: number;
  name: string;
  agentName: string;
  role: string;
  modelType: string;
  status: string;
  priority: number;
  temperature: number | null;
  maxTokens: number | null;
  enableMemory: boolean;
  enableRag: boolean;
  enableExternal: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
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
  inputPrice: number | null;  // 每百万token输入价格
  outputPrice: number | null; // 每百万token输出价格
  unit: string | null;        // 价格单位 $或¥
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