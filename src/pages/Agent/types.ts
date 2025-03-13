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