import React from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined, ImportOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  height: 64px;
  border-bottom: 1px solid var(--ant-color-border);
  flex-shrink: 0;
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
          <FormattedMessage id="project.create" defaultMessage="创建项目" />
        </Button>
        {onImportProject && (
          <Button
            icon={<ImportOutlined />}
            onClick={onImportProject}
          >
            <FormattedMessage id="project.import" defaultMessage="导入项目" />
          </Button>
        )}
      </Space>
    </HeaderContainer>
  );
};

export default ProjectListHeader; 