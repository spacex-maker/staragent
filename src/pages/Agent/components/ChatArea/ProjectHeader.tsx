import React from 'react';
import { Typography, Dropdown, Button, Space, Table } from 'antd';
import { ProjectOutlined, EllipsisOutlined, RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Project, ProjectAgent } from '../../types';
import { useProjectAgents } from 'hooks/useProjectAgents';

const { Title, Text } = Typography;

const ProjectTitleBar = styled.div`
  padding: 16px;
  background: var(--ant-color-bg-container);
  border-bottom: 1px solid var(--ant-color-border);
  display: flex;
  align-items: center;
  gap: 8px;
  height: 64px;
`;

const ProjectIcon = styled.div`
  font-size: 16px;
  color: var(--ant-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProjectTitle = styled(Title)`
  margin: 0 !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectDescription = styled(Text)`
  color: var(--ant-color-text-secondary);
  font-size: 12px;
  display: block;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const MoreButton = styled(Button)`
  padding: 4px 8px;
  height: 32px;
  margin-left: auto;
`;

const AgentListContainer = styled.div`
  padding: 12px;
  min-width: 400px;
  max-width: 600px;
  max-height: 500px;
  overflow: auto;
`;

const AgentTag = styled(Text)`
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  background: var(--ant-color-primary-bg);
  color: var(--ant-color-primary);
  margin-left: 8px;
`;

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const { projectAgents, loading, fetchAgents } = useProjectAgents(project.id);

  const columns = [
    {
      title: '员工信息',
      dataIndex: 'agentName',
      key: 'agentName',
      render: (text: string, record: ProjectAgent) => (
        <Space direction="vertical" size={2}>
          <Space>
            <RobotOutlined style={{ color: 'var(--ant-color-primary)' }} />
            <span>{text}</span>
          </Space>
          <Space size={4} style={{ marginLeft: 22 }}>
            <AgentTag>{record.role}</AgentTag>
            <AgentTag>{record.modelType}</AgentTag>
          </Space>
        </Space>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      align: 'center' as const,
    }
  ];

  const dropdownContent = (
    <AgentListContainer>
      <Table
        dataSource={projectAgents}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        locale={{ emptyText: '暂无员工' }}
      />
    </AgentListContainer>
  );

  return (
    <ProjectTitleBar>
      <ProjectIcon>
        <ProjectOutlined />
      </ProjectIcon>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <ProjectTitle level={4}>{project.name}</ProjectTitle>
        {project.description && (
          <ProjectDescription>
            {project.description}
          </ProjectDescription>
        )}
      </div>
      <Dropdown 
        trigger={['click']} 
        dropdownRender={() => dropdownContent}
        onOpenChange={(visible) => {
          if (visible) {
            fetchAgents();
          }
        }}
      >
        <MoreButton type="text" icon={<EllipsisOutlined />} />
      </Dropdown>
    </ProjectTitleBar>
  );
};

export default ProjectHeader; 