import React from 'react';
import { Button } from 'antd';
import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 8px;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .anticon {
    font-size: 16px;
  }
`;

interface AIAgentListHeaderProps {
  onCreateAgent: () => void;
  onRecruitAgent?: () => void;
}

const AIAgentListHeader: React.FC<AIAgentListHeaderProps> = ({ 
  onCreateAgent,
  onRecruitAgent 
}) => {
  return (
    <HeaderContainer>
      <StyledButton
        type="default"
        icon={<UsergroupAddOutlined />}
        onClick={onRecruitAgent}
      >
        招募员工
      </StyledButton>
      <StyledButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateAgent}
      >
        新增员工
      </StyledButton>
    </HeaderContainer>
  );
};

export default AIAgentListHeader; 