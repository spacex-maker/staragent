import React from 'react';
import styled from 'styled-components';

const StepsContainer = styled.div`
  background: var(--ant-color-bg-container);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const StepsTitle = styled.div`
  text-align: center;
  margin-bottom: 48px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #1677ff, #4096ff);
    border-radius: 2px;
  }

  i {
    font-size: 32px;
    color: #1677ff;
    margin-bottom: 12px;
    display: block;
  }

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--ant-color-text);
  }

  @media (max-width: 768px) {
    margin-bottom: 36px;

    i {
      font-size: 28px;
      margin-bottom: 8px;
    }

    h3 {
      font-size: 20px;
    }
  }
`;

const Timeline = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 0 40px;

  &::before {
    content: '';
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--ant-color-split);
    z-index: 1;
  }

  @media (max-width: 1200px) {
    flex-direction: column;
    margin: 0;
    gap: 32px;

    &::before {
      width: 2px;
      height: 100%;
      left: 40px;
      top: 0;
    }
  }
`;

const StepItem = styled.div`
  flex: 1;
  position: relative;
  padding: 0 20px;
  max-width: 280px;
  z-index: 2;

  @media (max-width: 1200px) {
    padding: 0 0 0 100px;
    max-width: none;
  }
`;

const StepIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.$active ? 'linear-gradient(135deg, #1677ff, #4096ff)' : 'var(--ant-color-bg-container-disabled)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  position: relative;
  border: 3px solid var(--ant-color-bg-container);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  i {
    font-size: 32px;
    color: ${props => props.$active ? '#fff' : 'var(--ant-color-text-quaternary)'};
    transition: all 0.3s ease;
  }

  .step-number {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    background: ${props => props.$active ? '#1677ff' : 'var(--ant-color-text-quaternary)'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    border: 2px solid var(--ant-color-bg-container);
  }

  @media (max-width: 1200px) {
    margin: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: 64px;
    height: 64px;

    i {
      font-size: 24px;
    }

    .step-number {
      width: 24px;
      height: 24px;
      font-size: 12px;
      top: -6px;
      right: -6px;
    }
  }
`;

const StepContent = styled.div`
  text-align: center;
  opacity: ${props => props.$active ? 1 : 0.6};
  transition: all 0.3s ease;

  h4 {
    margin: 0 0 12px;
    font-size: 16px;
    font-weight: 600;
    color: var(--ant-color-text);
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--ant-color-text-secondary);
  }

  @media (max-width: 1200px) {
    text-align: left;
    
    h4 {
      font-size: 15px;
      margin-bottom: 8px;
    }

    p {
      font-size: 13px;
    }
  }
`;

const DecryptSteps = () => {
  const steps = [
    {
      icon: 'bi bi-file-earmark-lock2',
      title: '选择加密文件',
      description: '选择使用 MyStorage 加密工具加密的 .encrypted 文件，支持拖拽或点击选择',
      active: true
    },
    {
      icon: 'bi bi-key',
      title: '输入解密密码',
      description: '输入加密时设置的密码，密码将仅用于本地解密，不会被传输或存储',
      active: true
    },
    {
      icon: 'bi bi-shield-lock',
      title: '开始解密',
      description: '点击按钮后，系统将使用 AES-256-CBC 算法在本地解密您的文件',
      active: false
    },
    {
      icon: 'bi bi-download',
      title: '获取原始文件',
      description: '解密完成后，原始文件将自动下载，解密过程完全无损，保证文件完整性',
      active: false
    }
  ];

  return (
    <StepsContainer>
      <StepsTitle>
        <i className="bi bi-shield-check"></i>
        <h3>解密步骤</h3>
      </StepsTitle>
      <Timeline>
        {steps.map((step, index) => (
          <StepItem key={index}>
            <StepIcon $active={step.active}>
              <i className={step.icon}></i>
              <div className="step-number">{index + 1}</div>
            </StepIcon>
            <StepContent $active={step.active}>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </StepContent>
          </StepItem>
        ))}
      </Timeline>
    </StepsContainer>
  );
};

export default DecryptSteps; 