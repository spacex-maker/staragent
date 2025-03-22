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

const ButtonWrapper = styled.div`
  .ant-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 20px;
    height: 36px;
    padding: 0 20px;
    
    .anticon {
      font-size: 16px;
    }
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
      <ButtonWrapper>
        <Button
          type="default"
          icon={<UsergroupAddOutlined />}
          onClick={onRecruitAgent}
        >
          招募员工
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateAgent}
        >
          新增员工
        </Button>
      </ButtonWrapper>
    </HeaderContainer>
  );
};

export default AIAgentListHeader; 