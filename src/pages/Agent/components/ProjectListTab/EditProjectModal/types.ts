import { Project, ProjectAgent } from '../../../types';

export interface EditProjectModalProps {
  visible: boolean;
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
  onProjectUpdate: (projectId: string, project: Partial<Project>) => void;
  onAgentsChange?: () => void;
}

export interface AgentListProps {
  projectId: string;
  onAddAgent: () => void;
  onAgentsChange?: () => void;
}

export interface AgentTableProps {
  projectAgents: ProjectAgent[];
  loading: boolean;
  onUpdateAgentSettings: (record: ProjectAgent, field: string, value: any) => Promise<void>;
  onRemoveAgent: (recordId: number) => Promise<void>;
} 