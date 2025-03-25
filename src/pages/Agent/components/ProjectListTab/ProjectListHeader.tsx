import React from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined, ImportOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateProject}
        >
          创建项目
        </Button>
        {onImportProject && (
          <Button
            icon={<ImportOutlined />}
            onClick={onImportProject}
          >
            导入项目
          </Button>
        )}
      </Space>
    </HeaderContainer>
  );
};

export default ProjectListHeader; 