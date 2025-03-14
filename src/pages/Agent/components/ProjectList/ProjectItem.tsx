import React from 'react';
import { List, Button, Typography, Tooltip, Space, Modal, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Project } from '../../types';
import axios from '../../../../api/axios';

const { Text, Paragraph } = Typography;

const ProjectItemWrapper = styled(List.Item)`
  padding: 12px !important;
  margin: 8px 0;
  border-radius: 8px !important;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  position: relative;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
    box-shadow: 0 2px 8px ${({ theme }) => theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.32)' : 'rgba(0, 0, 0, 0.08)'};
  }
`;

const ProjectContent = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  padding: 0;
`;

const LeftSection = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
`;

const ProjectIcon = styled.div`
  font-size: 24px;
  color: var(--ant-color-primary);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProjectInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProjectName = styled(Text)`
  font-size: 16px;
  display: block;
  margin-bottom: 8px;
`;

const ProjectDetails = styled.div`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 4px;
  line-height: 1.4;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 8px;
  min-width: 100px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: all 0.2s ease-in-out;
  margin-bottom: 8px;
  
  ${ProjectItemWrapper}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled(Button)`
  padding: 4px 8px;
  height: 28px;
  
  &:hover {
    background: var(--ant-color-primary-bg);
    color: var(--ant-color-primary);
  }
`;

const VisibilityTag = styled(Tag)`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  height: 22px;
  line-height: 22px;
  border-radius: 4px;
  
  .anticon {
    font-size: 12px;
  }
`;

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目 "${project.name}" 吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        setDeleteLoading(true);
        try {
          console.log('删除项目:', project.id);
          const response = await axios.delete(`/productx/sa-project/${project.id}`);
          console.log('删除项目响应:', response.data);
          
          if (response.data.success) {
            message.success('项目删除成功');
            onDelete(project.id);
          } else {
            message.error(response.data.message || '删除项目失败');
          }
        } catch (error) {
          console.error('删除项目错误:', error);
          message.error('删除项目失败，请稍后重试');
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  return (
    <ProjectItemWrapper
      className={isActive ? 'active' : ''}
      onClick={() => onSelect(project.id)}
      style={isActive ? {
        background: 'var(--ant-color-primary-bg)',
        borderColor: 'var(--ant-color-primary)'
      } : {}}
    >
      <ProjectContent>
        <LeftSection>
          <ProjectIcon>
            {project.visibility === 'private' ? <LockOutlined /> : <GlobalOutlined />}
          </ProjectIcon>
          <ProjectInfo>
            <ProjectName strong>{project.name}</ProjectName>
            {project.description && (
              <ProjectDetails>
                <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                  {project.description}
                </Paragraph>
              </ProjectDetails>
            )}
          </ProjectInfo>
        </LeftSection>

        <RightSection>
          <ActionButtons>
            <ActionButton
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
            />
            <ActionButton
              type="text"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              danger
              loading={deleteLoading}
            />
          </ActionButtons>
          {project.visibility === 'private' ? (
            <VisibilityTag color="default">
              <LockOutlined /> 私有
            </VisibilityTag>
          ) : (
            <VisibilityTag color="blue">
              <GlobalOutlined /> 公开
            </VisibilityTag>
          )}
        </RightSection>
      </ProjectContent>
    </ProjectItemWrapper>
  );
};

export default ProjectItem; 