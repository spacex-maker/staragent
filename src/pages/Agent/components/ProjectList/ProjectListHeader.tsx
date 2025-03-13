import React from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

const ListHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--ant-color-border);
  background: var(--ant-color-bg-container);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

interface ProjectListHeaderProps {
  onCreateProject: () => void;
}

const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({ onCreateProject }) => {
  return (
    <ListHeader>
      <Text strong style={{ fontSize: '16px' }}>项目列表</Text>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateProject}
      >
        新建项目
      </Button>
    </ListHeader>
  );
};

export default ProjectListHeader; 