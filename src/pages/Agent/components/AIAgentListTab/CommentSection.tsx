import React, { useState, useEffect } from 'react';
import { List, Avatar, Button, Input, Space, Tabs, Typography, Spin, Empty, Divider, Badge } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined, SendOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../../../../api/axios';
import { ApiResponse } from '../../../../models/ApiResponse';

const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 主容器
const CommentWrapper = styled.div`
  border-top: 1px solid var(--ant-color-border-secondary);
  margin-top: 20px;
  padding-top: 16px;
  position: relative;
  z-index: 1; // 确保评论区不会影响其他元素的z-index
`;

// 标题栏
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

// 评论项
const CommentItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid var(--ant-color-border-secondary);
  
  &:last-child {
    border-bottom: none;
  }
`;

// 用户信息行
const UserRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

// 用户名
const Username = styled(Text)`
  font-weight: 500;
  margin-left: 10px;
`;

// 评论日期
const CommentDate = styled(Text)`
  color: var(--ant-color-text-quaternary);
  font-size: 12px;
  margin-left: 12px;
`;

// 评论内容
const Content = styled(Paragraph)`
  margin: 8px 0 8px 34px;
  color: var(--ant-color-text);
`;

// 评论操作区
const ActionRow = styled.div`
  display: flex;
  align-items: center;
  margin-left: 34px;
`;

// 操作按钮
const Action = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  padding: 4px 8px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: ${props => props.$active ? 'var(--ant-color-primary)' : 'var(--ant-color-text-secondary)'};
  
  &:hover {
    color: var(--ant-color-primary);
  }
  
  .anticon {
    margin-right: 4px;
  }
`;

// 评论输入区
const InputArea = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 12px;
  
  .ant-input {
    border-radius: 8px;
  }
`;

// 加载更多按钮
const LoadMoreButton = styled(Button)`
  width: 100%;
  margin-top: 12px;
`;

// 评论列表容器
const CommentList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin: 0 -4px;
  padding: 0 4px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--ant-color-border);
    border-radius: 2px;
  }
`;

// 类型定义
interface Comment {
  id: number;
  agentId: number;
  parentId: number;
  userId: number;
  nickname: string;
  avatar: string;
  content: string;
  likeCount: number;
  replyCount: number;
  hotScore: number;
  isLiked: boolean;
  createTime: string;
  children?: Comment[];
}

interface CommentResponse {
  data: Comment[];
  totalNum: number;
}

interface CommentSectionProps {
  agentId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ agentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const intl = useIntl();

  const fetchComments = async () => {
    if (!agentId) return;
    
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<CommentResponse>>(`/productx/sa-ai-agent-comment/page`, {
        params: {
          agentId,
          orderType
        }
      });
      
      if (response.data && response.data.success) {
        setComments(response.data.data.data || []);
        setTotalCount(response.data.data.totalNum || 0);
      }
    } catch (error) {
      console.error('获取评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [agentId, orderType]);

  const handleLike = async (commentId: number) => {
    try {
      const currentComment = comments.find(comment => comment.id === commentId);
      if (!currentComment) return;
      
      if (currentComment.isLiked) {
        await axios.post(`/productx/sa-ai-agent-comment/unlike`, { commentId });
      } else {
        await axios.post(`/productx/sa-ai-agent-comment/like`, { commentId });
      }
      
      await fetchComments();
    } catch (error) {
      console.error('点赞操作失败:', error);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(`/productx/sa-ai-agent-comment/create`, {
        agentId,
        content: newComment,
        parentId: 0
      });
      
      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('提交评论失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTabChange = (activeKey: string) => {
    setOrderType(parseInt(activeKey));
  };

  return (
    <CommentWrapper>
      <TitleRow>
        <Space>
          <Text strong style={{ fontSize: 16 }}>
            <FormattedMessage id="aiAgent.comments.title" defaultMessage="用户评论" />
          </Text>
          <Badge count={totalCount} showZero color="var(--ant-color-primary)" />
        </Space>
      </TitleRow>
      
      <Tabs 
        defaultActiveKey="1" 
        onChange={handleTabChange} 
        size="small"
        tabBarStyle={{ marginBottom: 12 }}
      >
        <TabPane 
          tab={
            <Space>
              <ClockCircleOutlined />
              <FormattedMessage id="aiAgent.comments.latest" defaultMessage="最新" />
            </Space>
          } 
          key="1" 
        />
        <TabPane 
          tab={
            <Space>
              <FireOutlined />
              <FormattedMessage id="aiAgent.comments.hottest" defaultMessage="最热" />
            </Space>
          } 
          key="2" 
        />
      </Tabs>
      
      <Spin spinning={loading}>
        {comments && comments.length > 0 ? (
          <CommentList>
            {comments.map(item => (
              <CommentItem key={item.id}>
                <UserRow>
                  <Avatar src={item.avatar} size="small" />
                  <Username>{item.nickname}</Username>
                  <CommentDate>{item.createTime}</CommentDate>
                </UserRow>
                <Content ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}>
                  {item.content}
                </Content>
                <ActionRow>
                  <Action 
                    $active={item.isLiked}
                    onClick={() => handleLike(item.id)}
                  >
                    {item.isLiked ? <LikeFilled /> : <LikeOutlined />}
                    {item.likeCount > 0 && item.likeCount}
                  </Action>
                  <Action>
                    <MessageOutlined />
                    {item.replyCount > 0 && item.replyCount}
                  </Action>
                </ActionRow>
              </CommentItem>
            ))}
            
            {totalCount > comments.length && (
              <LoadMoreButton type="link">
                <FormattedMessage id="aiAgent.comments.loadMore" defaultMessage="加载更多" />
              </LoadMoreButton>
            )}
          </CommentList>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <FormattedMessage 
                id="aiAgent.comments.empty" 
                defaultMessage="暂无评论" 
              />
            }
          />
        )}
      </Spin>
      
      <Divider plain>
        <FormattedMessage id="aiAgent.comments.leaveComment" defaultMessage="发表评论" />
      </Divider>
      
      <InputArea>
        <Input.TextArea
          placeholder={intl.formatMessage({
            id: 'aiAgent.comments.placeholder',
            defaultMessage: '写下你的评论...'
          })}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 4 }}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
          icon={<SendOutlined />}
        >
          <FormattedMessage id="aiAgent.comments.submit" defaultMessage="发送" />
        </Button>
      </InputArea>
    </CommentWrapper>
  );
};

export default CommentSection; 