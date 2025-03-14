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
  type: 'user' | 'assistant';
  content: string;
  projectId?: string;
  timestamp: string;
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