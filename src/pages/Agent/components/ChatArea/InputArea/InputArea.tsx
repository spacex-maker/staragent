import React, { useState, useRef, useCallback } from 'react';
import { message, Input } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { SendOutlined, LoadingOutlined, StopOutlined } from '@ant-design/icons';
import { useProjectAgents } from 'hooks/useProjectAgents';
import MentionDropdown from './MentionDropdown';
import {
  GlobalMentionsStyle,
  StyledFooter,
  InputContainer,
  SendButton,
  LoadingContainer,
  CustomTextArea
} from './styles';

// 定义InputArea组件的属性接口
interface InputAreaProps {
  inputValue: string;           // 输入框的当前值
  setInputValue: (value: string) => void;  // 更新输入框值的函数
  handleSend: () => void;      // 发送消息的回调函数
  disabled: boolean;           // 输入框是否禁用
  projectId?: string;          // 当前项目的ID
  activeSessionId?: string | null;  // 当前活动会话的ID
  loading?: boolean;           // 是否处于加载状态
  onCancelRequest?: () => void;  // 取消请求的回调函数
  placeholder?: string;        // 输入框的占位文本
}

// InputArea组件：聊天输入区域的主要组件
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
  // 状态管理
  const [showMentions, setShowMentions] = useState(false);    // 是否显示@提及下拉框
  const [mentionFilter, setMentionFilter] = useState('');     // @提及的过滤文本
  const [cursorPosition, setCursorPosition] = useState(0);    // 当前光标位置
  const textAreaRef = useRef<TextAreaRef>(null);             // 文本输入区域的引用

  // 使用全局 hook 获取项目成员列表
  const { projectAgents, loading: agentsLoading } = useProjectAgents(projectId);

  // 处理输入框内容变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 更新光标位置
    const cursorPos = e.target.selectionStart || 0;
    setCursorPosition(cursorPos);
    
    // 检查是否需要显示@提及下拉菜单
    const textBeforeCursor = value.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    // 如果@符号在单词开始处，显示提及下拉框
    if (atIndex !== -1 && (atIndex === 0 || /\s/.test(textBeforeCursor[atIndex - 1]))) {
      const filterText = textBeforeCursor.substring(atIndex + 1);
      setMentionFilter(filterText);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionFilter('');
    }
  };

  // 处理选择@提及的成员
  const selectMention = (agentName: string) => {
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      // 构建新的输入值，包含选中的成员名
      const newValue = 
        inputValue.substring(0, atIndex) + 
        '@' + agentName + ' ' + 
        inputValue.substring(cursorPosition);
      
      setInputValue(newValue);
      setShowMentions(false);
      setMentionFilter('');
      
      // 更新光标位置到成员名后
      setTimeout(() => {
        if (textAreaRef.current) {
          const newCursorPos = atIndex + agentName.length + 2; // @ + name + space
          textAreaRef.current.focus();
          textAreaRef.current.resizableTextArea?.textArea.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  // 处理键盘事件，支持回车发送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 当按下回车键（非Shift+Enter）且不在输入法编辑状态时发送消息
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!loading) {
        handleSend();
      }
    }
  };

  // 过滤并匹配成员列表
  const filteredAgents = projectAgents.filter(agent => 
    agent.agentName.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  // 渲染组件UI
  return (
    <GlobalMentionsStyle>
      <StyledFooter>
        <InputContainer>
          {/* 显示加载状态或输入区域 */}
          {agentsLoading ? (
            <LoadingContainer>
              <LoadingOutlined spin />
            </LoadingContainer>
          ) : (
            <>
              {/* 文本输入区域 */}
              <CustomTextArea
                ref={textAreaRef}
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                disabled={disabled || loading}
                autoSize={{ minRows: 1, maxRows: 5 }}
              />
              
              {/* @提及下拉菜单 */}
              {showMentions && filteredAgents.length > 0 && (
                <MentionDropdown 
                  filteredAgents={filteredAgents} 
                  onSelect={selectMention} 
                />
              )}
            </>
          )}
          {/* 发送/取消按钮 */}
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
    </GlobalMentionsStyle>
  );
};

export default InputArea; 