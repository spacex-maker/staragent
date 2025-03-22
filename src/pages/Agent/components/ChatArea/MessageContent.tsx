import React, { useState } from 'react';
import styled from 'styled-components';
import { Viewer } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math';
import breaks from '@bytemd/plugin-breaks';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Tooltip, message } from 'antd';
import 'bytemd/dist/index.css';
import 'highlight.js/styles/vs2015.css';
import 'katex/dist/katex.min.css';

const ContentWrapper = styled.div`
  font-size: 14px;
  line-height: 1.6;
  position: relative;
  width: 100%;

  .markdown-body {
    background: transparent;
    font-size: 14px;
    line-height: 1.6;
    padding: 0 32px 0 0; // 只保留右侧padding，为复制按钮留出空间
    
    pre {
      position: relative;
      background: ${props => props.theme.mode === 'dark' 
        ? 'var(--ant-color-bg-layout)' 
        : '#f6f8fa'};
      border-radius: 16px; // 代码块使用更大的圆角
      margin: 0.5em 0;
      padding: 1em;
      border: 1px solid var(--ant-color-border);

      code {
        color: ${props => props.theme.mode === 'dark' 
          ? '#e6e6e6' 
          : '#24292e'};
      }
    }

    code {
      font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
      font-size: 0.9em;
      
      // 行内代码样式
      &:not(pre code) {
        background: ${props => props.theme.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(175, 184, 193, 0.2)'};
        color: ${props => props.theme.mode === 'dark'
          ? '#e6e6e6'
          : '#24292e'};
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.9em;
      }
    }

    // 代码高亮样式覆盖
    .hljs {
      color: ${props => props.theme.mode === 'dark' ? '#e6e6e6' : '#24292e'};
      background: transparent;
      padding: 0;

      // 关键字
      .hljs-keyword {
        color: ${props => props.theme.mode === 'dark' ? '#ff7b72' : '#d73a49'};
      }

      // 字符串
      .hljs-string {
        color: ${props => props.theme.mode === 'dark' ? '#a5d6ff' : '#032f62'};
      }

      // 注释
      .hljs-comment {
        color: ${props => props.theme.mode === 'dark' ? '#8b949e' : '#6a737d'};
      }

      // 函数名
      .hljs-function {
        .hljs-title,
        .hljs-title.function_ {
          color: ${props => props.theme.mode === 'dark' ? '#d2a8ff' : '#6f42c1'};
          font-weight: 600;
        }
        .hljs-params {
          color: ${props => props.theme.mode === 'dark' ? '#e6e6e6' : '#24292e'};
        }
      }

      // 数字
      .hljs-number {
        color: ${props => props.theme.mode === 'dark' ? '#79c0ff' : '#005cc5'};
      }

      // 类名
      .hljs-title {
        &.class_ {
          color: ${props => props.theme.mode === 'dark' ? '#ffa657' : '#e36209'};
          font-weight: 600;
        }
      }

      // 属性名
      .hljs-property {
        color: ${props => props.theme.mode === 'dark' ? '#79c0ff' : '#005cc5'};
      }

      // 变量名
      .hljs-variable {
        color: ${props => props.theme.mode === 'dark' ? '#ffa657' : '#e36209'};
      }

      // 方法调用
      .hljs-title.function_ {
        color: ${props => props.theme.mode === 'dark' ? '#d2a8ff' : '#6f42c1'};
        font-weight: 600;
      }

      // 内置函数
      .hljs-built_in {
        color: ${props => props.theme.mode === 'dark' ? '#ffa657' : '#e36209'};
      }

      // 标点符号
      .hljs-punctuation {
        color: ${props => props.theme.mode === 'dark' ? '#e6e6e6' : '#24292e'};
      }

      // 运算符
      .hljs-operator {
        color: ${props => props.theme.mode === 'dark' ? '#ff7b72' : '#d73a49'};
      }
    }

    p {
      margin: 0.5em 0;
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }

    h1, h2, h3, h4, h5, h6 {
      margin: 1em 0 0.5em;
      line-height: 1.4;
      font-weight: 600;
      border-bottom: none;
    }

    ul, ol {
      margin: 0.5em 0;
      padding-left: 1.5em;
    }

    li {
      margin: 0.3em 0;
    }

    a {
      color: var(--ant-color-primary);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    img {
      max-width: 100%;
      border-radius: 8px;
      margin: 0.5em 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      font-size: 0.9em;

      th, td {
        border: 1px solid var(--ant-color-border);
        padding: 0.5em;
      }

      th {
        background: var(--ant-color-bg-layout);
        font-weight: 600;
      }

      tr:nth-child(even) {
        background: var(--ant-color-bg-layout);
      }
    }

    blockquote {
      margin: 0.5em 0;
      padding: 0.5em 1em;
      border-left: 4px solid var(--ant-color-primary);
      background: var(--ant-color-bg-layout);
      border-radius: 4px;
      color: var(--ant-color-text-secondary);
    }
  }
`;

const MessageCopyButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
  padding: 4px;
  height: 32px;
  width: 32px;
  min-width: 32px;
  border-radius: 16px;
  background: var(--ant-color-bg-container);
  border: 1px solid var(--ant-color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${ContentWrapper}:hover & {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.05);
    background: var(--ant-color-bg-container);
  }

  .anticon {
    font-size: 16px;
  }
`;

const plugins = [
  gfm(),
  highlight(),
  math(),
  breaks(),
];

interface MessageContentProps {
  content: string;
}

const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  // 复制整个消息内容
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      message.success('消息已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error('复制失败');
    }
  };

  // 添加复制按钮到代码块
  React.useEffect(() => {
    const addCopyButtons = () => {
      const preElements = document.querySelectorAll('.markdown-body pre');
      preElements.forEach(pre => {
        // 检查是否已经添加了复制按钮
        if (pre.querySelector('.copy-button')) return;

        const code = pre.querySelector('code');
        if (!code) return;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        
        // 设置按钮样式
        const buttonStyles = {
          opacity: '0',
          position: 'absolute',
          top: '8px',
          right: '8px',
          transition: 'all 0.2s ease',
          zIndex: '2',
          background: 'var(--ant-color-bg-container)',
          border: '1px solid var(--ant-color-border)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
        };

        Object.assign(copyButton.style, buttonStyles);

        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(code.textContent || '');
            message.success('代码已复制到剪贴板');
            copyButton.innerHTML = '<span style="color: #52c41a;">✓</span>';
            setTimeout(() => {
              copyButton.innerHTML = '<span>复制</span>';
            }, 2000);
          } catch (err) {
            message.error('复制失败');
          }
        };

        copyButton.innerHTML = '<span>复制</span>';
        copyButton.addEventListener('click', handleCopy);

        // 设置 pre 元素样式
        if (pre instanceof HTMLElement) {
          pre.style.position = 'relative';
        }
        pre.appendChild(copyButton);

        // 添加悬停效果
        pre.addEventListener('mouseenter', () => {
          copyButton.style.opacity = '1';
        });
        pre.addEventListener('mouseleave', () => {
          copyButton.style.opacity = '0';
        });
      });
    };

    // 初始添加复制按钮
    setTimeout(addCopyButtons, 100);

    // 监听内容变化
    const observer = new MutationObserver(addCopyButtons);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ContentWrapper>
      <Tooltip title="复制消息内容">
        <MessageCopyButton
          type="text"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopyMessage}
        />
      </Tooltip>
      <Viewer 
        value={content}
        plugins={plugins}
      />
    </ContentWrapper>
  );
};

export default MessageContent; 