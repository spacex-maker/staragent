import React from 'react';
import { List, Typography, Tag, Button, message, Modal, Space } from 'antd';
import { RobotOutlined, EditOutlined, DeleteOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AIAgent } from '../../types';
import axios from '../../../../api/axios';
import { useIntl } from 'react-intl';

interface ThemeProps {
  theme: {
    mode: 'light' | 'dark';
  };
}

const { Text } = Typography;

// 卡片主容器
const AgentCard = styled(List.Item)<ThemeProps & { $hasAvatar: boolean }>`
  padding: 0 !important;
  margin: 12px 0;
  border-radius: 20px !important;
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  height: 160px;
  position: relative;
  background: ${props => !props.$hasAvatar && (props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)')};
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({ theme }) => theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.32)' : 'rgba(0, 0, 0, 0.08)'};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$hasAvatar 
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(16, 185, 129, 0.5) 100%)'
      : 'none'
    };
    z-index: ${props => props.$hasAvatar ? 1 : 0};
  }
`;

// 背景图片
const CardBackground = styled.div<{ $avatarUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.$avatarUrl});
  background-size: cover;
  background-position: center;
  filter: blur(0px);
  opacity: 0.9;
  z-index: 0;
`;

// 卡片上部内容
const CardTopContent = styled.div<{ $hasAvatar: boolean }>`
  position: relative;
  z-index: 2;
  display: flex;
  flex: 1;
  width: 100%;
  padding: 16px;
  color: ${props => props.$hasAvatar ? 'white' : 'inherit'};
`;

// 底部操作栏
const CardBottomBar = styled.div<{ $hasAvatar: boolean }>`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 16px;
  background: ${props => props.$hasAvatar 
    ? 'rgba(0, 0, 0, 0.25)' 
    : props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
  };
  backdrop-filter: blur(4px);
  color: ${props => props.$hasAvatar ? 'white' : 'inherit'};
  border-top: 1px solid ${props => props.$hasAvatar 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'var(--ant-color-border)'
  };
`;

// 模型名称文本
const ModelName = styled.div<{ $hasAvatar: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$hasAvatar ? 'rgba(255, 255, 255, 0.9)' : 'var(--ant-color-text-secondary)'};
  display: flex;
  align-items: center;
`;

// 操作按钮组
const ActionButtons = styled.div<{ $hasAvatar: boolean }>`
  display: flex;
  gap: 8px;
  
  .ant-btn {
    background: ${props => props.$hasAvatar ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
    border: none;
    color: ${props => props.$hasAvatar ? 'white' : 'inherit'};
    border-radius: 8px;
    padding: 4px 8px;
    height: 28px;
    
    &:hover {
      background: ${props => props.$hasAvatar ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.05)'};
      color: ${props => props.$hasAvatar ? 'white' : 'var(--ant-color-primary)'};
    }
  }
`;

// 头像显示
const AvatarDisplay = styled.div<{ $avatarUrl: string }>`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background-image: url(${props => props.$avatarUrl});
  background-size: cover;
  background-position: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.7);
  margin-right: 16px;
  flex-shrink: 0;
`;

// 头像图标
const AvatarIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  margin-right: 16px;
  font-size: 28px;
  flex-shrink: 0;
`;

// 内容区域
const ContentSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// 上部信息区域
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 名称文本
const AgentName = styled(Text)<{ $hasAvatar: boolean }>`
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.$hasAvatar ? 'white' : 'inherit'};
  text-shadow: ${props => props.$hasAvatar ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};
`;

// 标签行
const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

// 角色标签
const RoleTag = styled(Tag)<{ $hasAvatar: boolean }>`
  margin: 0;
  border-radius: 4px;
  background: ${props => props.$hasAvatar ? 'rgba(255, 255, 255, 0.25)' : 'var(--ant-color-primary-bg)'};
  color: ${props => props.$hasAvatar ? 'white' : 'var(--ant-color-primary)'};
  border: ${props => props.$hasAvatar ? 'none' : '1px solid var(--ant-color-primary-border)'};
  backdrop-filter: ${props => props.$hasAvatar ? 'blur(4px)' : 'none'};
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
  font-size: 12px;
`;

interface AIAgentItemProps {
  agent: AIAgent;
  onEdit: (agent: AIAgent) => void;
  onDelete?: (agentId: string) => void;
}

const AIAgentItem: React.FC<AIAgentItemProps> = ({ agent, onEdit, onDelete }) => {
  const intl = useIntl();
  const hasAvatar = !!agent.avatarUrl;

  const handleDelete = async () => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'aiAgentModal.delete.title', defaultMessage: '确认删除' }),
      content: intl.formatMessage(
        { id: 'aiAgentModal.delete.content', defaultMessage: '确定要删除 {name} 吗？' },
        { name: agent.name }
      ),
      okText: intl.formatMessage({ id: 'common.delete', defaultMessage: '删除' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'common.cancel', defaultMessage: '取消' }),
      onOk: async () => {
        try {
          const response = await axios.delete(`/productx/sa-ai-agent/${agent.id}`);
          if (response.data.success) {
            message.success(intl.formatMessage({ id: 'aiAgentModal.delete.success', defaultMessage: '删除成功' }));
            onDelete?.(agent.id.toString());
          } else {
            message.error(response.data.message || intl.formatMessage({ id: 'aiAgentModal.delete.failed', defaultMessage: '删除失败' }));
          }
        } catch (error) {
          console.error('删除AI助手失败:', error);
          message.error(intl.formatMessage({ id: 'aiAgentModal.delete.error', defaultMessage: '删除失败，请稍后重试' }));
        }
      },
    });
  };

  const getGenderIcon = (gender: boolean | null | undefined) => {
    if (gender === true) return <ManOutlined />;
    if (gender === false) return <WomanOutlined />;
    return <RobotOutlined />;
  };

  return (
    <AgentCard $hasAvatar={hasAvatar}>
      {hasAvatar && <CardBackground $avatarUrl={agent.avatarUrl!} />}
      
      <CardTopContent $hasAvatar={hasAvatar}>
        {hasAvatar ? (
          <AvatarDisplay $avatarUrl={agent.avatarUrl!} />
        ) : (
          <AvatarIcon>
            {getGenderIcon(agent.gender)}
          </AvatarIcon>
        )}
        
        <ContentSection>
          <InfoSection>
            <AgentName $hasAvatar={hasAvatar}>{agent.name}</AgentName>
            
            <TagsRow>
              {agent.roles.map((role, index) => (
                <RoleTag key={index} $hasAvatar={hasAvatar}>{role}</RoleTag>
              ))}
            </TagsRow>
          </InfoSection>
        </ContentSection>
      </CardTopContent>
      
      <CardBottomBar $hasAvatar={hasAvatar}>
        <ModelName $hasAvatar={hasAvatar}>
          {agent.modelType}
        </ModelName>
        
        <ActionButtons $hasAvatar={hasAvatar}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(agent);
            }}
            title={intl.formatMessage({ id: 'common.edit', defaultMessage: '编辑' })}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            title={intl.formatMessage({ id: 'common.delete', defaultMessage: '删除' })}
          />
        </ActionButtons>
      </CardBottomBar>
    </AgentCard>
  );
};

export default AIAgentItem;