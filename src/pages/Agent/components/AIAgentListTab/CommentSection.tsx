import React, { useState, useEffect } from 'react';
import { List, Avatar, Button, Input, Space, Tabs, Typography, Spin, Empty, Divider, Badge, message } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined, SendOutlined, ClockCircleOutlined, FireOutlined, LoadingOutlined, ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
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
  margin-left: 12px;
`;

// 评论日期
const CommentDate = styled(Text)`
  color: var(--ant-color-text-quaternary);
  font-size: 12px;
  margin-left: 12px;
`;

// 评论内容
const Content = styled(Paragraph)`
  margin: 8px 0 8px 60px;
  color: var(--ant-color-text);
`;

// 评论操作区
const ActionRow = styled.div`
  display: flex;
  align-items: center;
  margin-left: 60px;
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
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
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
    border-radius: 20px;
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

// 回复区域容器
const ReplyArea = styled.div`
  margin-left: 60px;
  margin-top: 12px;
  padding: 12px;
  background-color: var(--ant-color-bg-container-disabled);
  border-radius: 8px;
`;

const ReplyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ReplyTitle = styled(Text)`
  font-size: 14px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ant-color-text-secondary);
  
  &:hover {
    color: var(--ant-color-text);
  }
`;

// 回复输入区域
const ReplyInputArea = styled.div`
  display: flex;
  gap: 12px;
  
  .ant-input {
    border-radius: 20px;
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
  visible?: boolean;
}

// 递归渲染评论组件
const CommentTree: React.FC<{
  comment: Comment;
  level: number;
  onLike: (id: number) => void;
  onReply: (comment: Comment) => void;
  replyToComment: Comment | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onCloseReply: () => void;
  onSubmitReply: () => void;
  replying: boolean;
  likingCommentIds: number[];
}> = ({ 
  comment, 
  level, 
  onLike, 
  onReply, 
  replyToComment, 
  replyContent, 
  setReplyContent,
  onCloseReply,
  onSubmitReply,
  replying,
  likingCommentIds
}) => {
  const intl = useIntl();
  const indent = level * 16; // 每层缩进16px
  const avatarSize = Math.max(48 - level * 8, 24); // 头像大小随层级减小，最小24px
  const contentMargin = avatarSize + 12; // 内容区左边距

  return (
    <CommentItem key={comment.id} style={{ padding: level === 0 ? '12px 0' : '8px 0' }}>
      <UserRow>
        <Avatar src={comment.avatar} size={avatarSize} />
        <Username>{comment.nickname}</Username>
        <CommentDate>{comment.createTime}</CommentDate>
      </UserRow>
      <Content 
        ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
        style={{ 
          marginLeft: contentMargin, 
          fontSize: level === 0 ? 14 : 13 
        }}
      >
        {comment.content}
      </Content>
      <ActionRow style={{ marginLeft: contentMargin }}>
        <Action 
          $active={comment.isLiked}
          onClick={() => onLike(comment.id)}
          disabled={likingCommentIds.includes(comment.id)}
        >
          {likingCommentIds.includes(comment.id) ? (
            <LoadingOutlined />
          ) : (
            comment.isLiked ? <LikeFilled /> : <LikeOutlined />
          )}
          {comment.likeCount > 0 && comment.likeCount}
        </Action>
        <Action onClick={() => onReply(comment)}>
          <MessageOutlined />
          {comment.replyCount > 0 && comment.replyCount}
        </Action>
      </ActionRow>

      {replyToComment && replyToComment.id === comment.id && (
        <ReplyArea style={{ marginLeft: contentMargin }}>
          <ReplyHeader>
            <ReplyTitle>
              <ArrowLeftOutlined style={{ marginRight: 8 }} />
              <FormattedMessage id="aiAgent.comments.replyTo" /> {comment.nickname}
            </ReplyTitle>
            <CloseButton onClick={onCloseReply}>
              <CloseOutlined />
            </CloseButton>
          </ReplyHeader>
          <ReplyInputArea>
            <Input.TextArea
              placeholder={intl.formatMessage({ id: 'aiAgent.comments.replyPlaceholder' })}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              onClick={onSubmitReply}
              loading={replying}
              icon={<SendOutlined />}
            >
              <FormattedMessage id="aiAgent.comments.submit" />
            </Button>
          </ReplyInputArea>
        </ReplyArea>
      )}

      {comment.children && comment.children.length > 0 && (
        <div style={{ marginLeft: contentMargin, marginTop: 12 }}>
          {comment.children.map(childComment => (
            <CommentTree
              key={childComment.id}
              comment={childComment}
              level={level + 1}
              onLike={onLike}
              onReply={onReply}
              replyToComment={replyToComment}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onCloseReply={onCloseReply}
              onSubmitReply={onSubmitReply}
              replying={replying}
              likingCommentIds={likingCommentIds}
            />
          ))}
        </div>
      )}
    </CommentItem>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ agentId, visible = true }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likingCommentIds, setLikingCommentIds] = useState<number[]>([]);
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);
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
    if (visible && agentId) {
      fetchComments();
    }
  }, [agentId, orderType, visible]);

  // 递归查找评论
  const findCommentById = (commentId: number, commentList: Comment[]): Comment | null => {
    for (const comment of commentList) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.children && comment.children.length > 0) {
        const found = findCommentById(commentId, comment.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleLike = async (commentId: number) => {
    try {
      const comment = findCommentById(commentId, comments);
      if (!comment) return;
      
      // 添加到正在点赞的ID列表中
      setLikingCommentIds(prev => [...prev, commentId]);
      
      if (comment.isLiked) {
        await axios.post(`/productx/sa-ai-agent-comment/${commentId}/unlike`);
      } else {
        await axios.post(`/productx/sa-ai-agent-comment/${commentId}/like`);
      }
      
      await fetchComments();
    } catch (error) {
      console.error('点赞操作失败:', error);
    } finally {
      // 从正在点赞的ID列表中移除
      setLikingCommentIds(prev => prev.filter(id => id !== commentId));
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
      message.success(intl.formatMessage({ id: 'aiAgent.comments.success' }));
    } catch (error) {
      console.error('提交评论失败:', error);
      message.error(intl.formatMessage({ id: 'aiAgent.comments.error' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyToComment(comment);
    setReplyContent('');
  };

  const closeReply = () => {
    setReplyToComment(null);
    setReplyContent('');
  };

  const submitReply = async () => {
    if (!replyToComment || !replyContent.trim()) return;

    try {
      setReplying(true);
      await axios.post(`/productx/sa-ai-agent-comment/create`, {
        agentId,
        content: replyContent,
        parentId: replyToComment.id
      });
      
      setReplyContent('');
      setReplyToComment(null);
      await fetchComments();
      message.success(intl.formatMessage({ id: 'aiAgent.comments.replySuccess' }));
    } catch (error) {
      console.error('回复评论失败:', error);
      message.error(intl.formatMessage({ id: 'aiAgent.comments.error' }));
    } finally {
      setReplying(false);
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
            <FormattedMessage id="aiAgent.comments.title" />
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
              <FormattedMessage id="aiAgent.comments.latest" />
            </Space>
          } 
          key="1" 
        />
        <TabPane 
          tab={
            <Space>
              <FireOutlined />
              <FormattedMessage id="aiAgent.comments.hottest" />
            </Space>
          } 
          key="2" 
        />
      </Tabs>
      
      <Spin spinning={loading}>
        {comments && comments.length > 0 ? (
          <CommentList>
            {comments.map(comment => (
              <CommentTree
                key={comment.id}
                comment={comment}
                level={0}
                onLike={handleLike}
                onReply={handleReply}
                replyToComment={replyToComment}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                onCloseReply={closeReply}
                onSubmitReply={submitReply}
                replying={replying}
                likingCommentIds={likingCommentIds}
              />
            ))}
            
            {totalCount > comments.length && (
              <LoadMoreButton type="link">
                <FormattedMessage id="aiAgent.comments.loadMore" />
              </LoadMoreButton>
            )}
          </CommentList>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <FormattedMessage 
                id="aiAgent.comments.empty"
              />
            }
          />
        )}
      </Spin>
      
      <Divider plain>
        <FormattedMessage id="aiAgent.comments.leaveComment" />
      </Divider>
      
      <InputArea>
        <Input.TextArea
          placeholder={intl.formatMessage({
            id: 'aiAgent.comments.placeholder'
          })}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
          icon={<SendOutlined />}
        >
          <FormattedMessage id="aiAgent.comments.submit" />
        </Button>
      </InputArea>
    </CommentWrapper>
  );
};

export default CommentSection; 