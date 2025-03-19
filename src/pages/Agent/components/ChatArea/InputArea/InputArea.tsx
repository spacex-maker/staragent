import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Spin, message, Input } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { SendOutlined, LoadingOutlined, StopOutlined } from '@ant-design/icons';
import axios from 'api/axios';
import { ProjectAgent } from 'pages/Agent/types';
import MentionDropdown from './MentionDropdown';
import {
  GlobalMentionsStyle,
  StyledFooter,
  InputContainer,
  SendButton,
  LoadingContainer,
  CustomTextArea
} from './styles';

interface InputAreaProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: () => void;
  disabled: boolean;
  projectId?: string;
  activeSessionId?: string | null;
  loading?: boolean;
  onCancelRequest?: () => void;
  placeholder?: string;
}

const InputArea: React.FC<InputAreaProps> = ({
  inputValue,
  setInputValue,
  handleSend,
  disabled,
  projectId,
  activeSessionId,
  loading = false,
  onCancelRequest,
  placeholder = "输入您的问题..."
}) => {
  const [projectAgents, setProjectAgents] = useState<ProjectAgent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textAreaRef = useRef<TextAreaRef>(null);

  // 获取项目员工列表
  const fetchProjectAgents = useCallback(async (projectId: string) => {
    if (!projectId) return;
    
    setAgentsLoading(true);
    try {
      const response = await axios.get(`/productx/sa-ai-agent-project/list-by-project/${projectId}`);
      if (response.data.success) {
        const agents = response.data.data || [];
        setProjectAgents(agents);
      } else {
        message.error(response.data.message || '获取项目员工失败');
      }
    } catch (error) {
      console.error('获取项目员工错误:', error);
      message.error('获取项目员工失败，请稍后重试');
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  // 只在项目ID变化时获取员工列表
  useEffect(() => {
    if (projectId) {
      fetchProjectAgents(projectId);
    } else {
      setProjectAgents([]);
    }
  }, [projectId, fetchProjectAgents]);

  // 监听员工列表变化事件
  useEffect(() => {
    const handleAgentsChange = () => {
      if (projectId) {
        fetchProjectAgents(projectId);
      }
    };

    window.addEventListener('projectAgentsChanged', handleAgentsChange);
    return () => {
      window.removeEventListener('projectAgentsChanged', handleAgentsChange);
    };
  }, [projectId, fetchProjectAgents]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 获取光标位置
    const cursorPos = e.target.selectionStart || 0;
    setCursorPosition(cursorPos);
    
    // 检查是否需要显示@提及下拉菜单
    const textBeforeCursor = value.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1 && (atIndex === 0 || /\s/.test(textBeforeCursor[atIndex - 1]))) {
      const filterText = textBeforeCursor.substring(atIndex + 1);
      setMentionFilter(filterText);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionFilter('');
    }
  };

  // 选择@提及的员工
  const selectMention = (agentName: string) => {
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      const newValue = 
        inputValue.substring(0, atIndex) + 
        '@' + agentName + ' ' + 
        inputValue.substring(cursorPosition);
      
      setInputValue(newValue);
      setShowMentions(false);
      setMentionFilter('');
      
      // 设置新的光标位置
      setTimeout(() => {
        if (textAreaRef.current) {
          const newCursorPos = atIndex + agentName.length + 2; // @ + name + space
          textAreaRef.current.focus();
          textAreaRef.current.resizableTextArea?.textArea.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  // 更新键盘事件处理方法
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) {
        handleSend();
      }
    }
  };

  // 过滤员工列表
  const filteredAgents = projectAgents.filter(agent => 
    agent.agentName.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  return (
    <StyledFooter>
      <GlobalMentionsStyle />
      <InputContainer>
        {agentsLoading ? (
          <LoadingContainer>
            <Spin size="small" />
          </LoadingContainer>
        ) : (
          <>
            <CustomTextArea
              ref={textAreaRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              disabled={disabled || loading}
              autoSize={{ minRows: 1, maxRows: 5 }}
            />
            
            {showMentions && filteredAgents.length > 0 && (
              <MentionDropdown 
                filteredAgents={filteredAgents} 
                onSelect={selectMention} 
              />
            )}
          </>
        )}
        {loading ? (
          <SendButton
            type="primary"
            danger
            icon={<StopOutlined />}
            onClick={onCancelRequest}
          >
            取消
          </SendButton>
        ) : (
          <SendButton
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled}
          >
            发送
          </SendButton>
        )}
      </InputContainer>
    </StyledFooter>
  );
};

export default InputArea; 