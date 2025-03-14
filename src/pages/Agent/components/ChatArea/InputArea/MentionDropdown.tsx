import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { MentionDropdown as StyledMentionDropdown, MentionItem, MentionOption } from './styles';
import { ProjectAgent } from '../../../types';

interface MentionDropdownProps {
  filteredAgents: ProjectAgent[];
  onSelect: (agentName: string) => void;
}

const MentionDropdown: React.FC<MentionDropdownProps> = ({ filteredAgents, onSelect }) => {
  if (filteredAgents.length === 0) return null;

  return (
    <StyledMentionDropdown>
      {filteredAgents.map(agent => (
        <MentionItem 
          key={agent.agentId.toString()} 
          onClick={() => onSelect(agent.agentName)}
        >
          <MentionOption>
            <div className="agent-icon">
              <UserOutlined />
            </div>
            <span className="agent-name">{agent.agentName}</span>
            <span className="agent-role">{agent.role}</span>
          </MentionOption>
        </MentionItem>
      ))}
    </StyledMentionDropdown>
  );
};

export default MentionDropdown; 