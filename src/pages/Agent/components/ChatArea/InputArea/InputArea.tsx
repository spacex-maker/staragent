import React, { useState, useEffect, useRef } from 'react';
import { Spin, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
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
}

const InputArea: React.FC<InputAreaProps> = ({
  inputValue,
  setInputValue,
  handleSend,
  disabled,
  projectId
}) => {
  const [projectAgents, setProjectAgents] = useState<ProjectAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // 获取项目员工列表
  useEffect(() => {
    if (projectId) {
      fetchProjectAgents(projectId);
    } else {
      setProjectAgents([]);
    }
  }, [projectId]);

  const fetchProjectAgents = async (projectId: string) => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/productx/sa-ai-agent-project/list-by-project/${projectId}`);
      if (response.data.success) {
        setProjectAgents(response.data.data);
      } else {
        message.error(response.data.message || '获取项目员工失败');
      }
    } catch (error) {
      console.error('获取项目员工错误:', error);
      message.error('获取项目员工失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 更新键盘事件处理方法
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
      
      // 设置新的光标位置
      setTimeout(() => {
        // 获取textarea的DOM元素
        const textareaElement = textAreaRef.current;
        if (textareaElement) {
          const newCursorPos = atIndex + agentName.length + 2; // @ + name + space
          
          // 获取焦点
          textareaElement.focus();
          
          // 使用DOM API设置光标位置
          try {
            textareaElement.setSelectionRange(newCursorPos, newCursorPos);
          } catch (error) {
            console.error('设置光标位置失败:', error);
          }
        }
      }, 10); // 增加延迟时间，确保DOM已更新
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
        {loading ? (
          <LoadingContainer>
            <Spin size="small" />
          </LoadingContainer>
        ) : (
          <>
            <CustomTextArea
              ref={textAreaRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={disabled ? "请先选择一个项目" : "输入您的问题..."}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              autoSize={{ minRows: 1, maxRows: 5 }}
            />
            
            {showMentions && (
              <MentionDropdown 
                filteredAgents={filteredAgents} 
                onSelect={selectMention} 
              />
            )}
          </>
        )}
        <SendButton
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!inputValue.trim() || disabled}
        >
          发送
        </SendButton>
      </InputContainer>
    </StyledFooter>
  );
};

export default InputArea; 