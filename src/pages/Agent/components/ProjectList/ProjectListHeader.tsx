import React from 'react';
import { Button } from 'antd';
import { PlusOutlined, ImportOutlined } from '@ant-design/icons';
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

interface ProjectListHeaderProps {
  onCreateProject: () => void;
  onImportProject?: () => void;
}

const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({ 
  onCreateProject,
  onImportProject 
}) => {
  return (
    <HeaderContainer>
      <StyledButton
        type="default"
        icon={<ImportOutlined />}
        onClick={onImportProject}
      >
        引进项目
      </StyledButton>
      <StyledButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateProject}
      >
        新建项目
      </StyledButton>
    </HeaderContainer>
  );
};

export default ProjectListHeader; 