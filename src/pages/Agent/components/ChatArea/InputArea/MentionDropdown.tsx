import React from 'react';
import { RobotOutlined } from '@ant-design/icons';
import { MentionDropdown as StyledMentionDropdown, MentionItem, MentionOption } from './styles';
import { ProjectAgent } from '../../../types';
import { Avatar } from 'antd';
import styled from 'styled-components';

const AgentAvatar = styled(Avatar)`
  border: 2px solid var(--ant-color-primary);
  background: var(--ant-color-bg-container);
  color: var(--ant-color-primary);
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  
  .anticon {
    font-size: 12px;
  }
`;

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
          key={agent.id.toString()} 
          onClick={() => onSelect(agent.agentName)}
        >
          <MentionOption>
            <div className="agent-icon">
              <AgentAvatar
                src={agent.avatarUrl}
                icon={!agent.avatarUrl && <RobotOutlined />}
                size="small"
              />
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