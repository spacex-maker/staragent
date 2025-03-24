import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { ResetFormProps } from './types';
import {
  Form,
  ResetBox,
  Logo,
  SubmitButton,
  ErrorText,
  Footer,
} from './styles';
import EmailInput from './EmailInput';
import CodeInput from './CodeInput';
import PasswordInput from './PasswordInput';

const ResetForm: React.FC<ResetFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const intl = useIntl();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [showSuffixDropdown, setShowSuffixDropdown] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const startCountdown = () => {
    setCountdown(300); // 5分钟 = 300秒
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!email) {
      // 错误处理已在父组件中完成
      return;
    }

    setIsSending(true);
    try {
      // 发送验证码的逻辑已在父组件中处理
      startCountdown();
    } finally {
      setIsSending(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    const atIndex = value.indexOf('@');
    if (atIndex !== -1 && value.length > atIndex + 1) {
      setShowSuffixDropdown(false);
    } else {
      setShowSuffixDropdown(true);
    }
  };

  const handleSuffixClick = (suffix: string) => {
    if (suffix) {
      const emailPrefix = email.split("@")[0];
      setEmail(emailPrefix + suffix);
    }
    setShowSuffixDropdown(false);
  };

  return (
    <ResetBox>
      <Logo>
        <FormattedMessage id="resetPassword.title" defaultMessage="重置密码" />
      </Logo>
      <Form onSubmit={onSubmit}>
        <EmailInput
          value={email}
          onChange={handleEmailChange}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          showSuffixDropdown={showSuffixDropdown}
          onSuffixButtonClick={() => setShowSuffixDropdown(!showSuffixDropdown)}
          onSuffixClick={handleSuffixClick}
        />

        <CodeInput
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onFocus={() => setCodeFocused(true)}
          onBlur={() => setCodeFocused(false)}
          isSending={isSending}
          countdown={countdown}
          onSendCode={handleSendCode}
        />

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <SubmitButton type="submit" disabled={loading}>
          <FormattedMessage 
            id={loading ? 'resetPassword.button.loading' : 'resetPassword.button'} 
            defaultMessage={loading ? '重置中...' : '重置密码'}
          />
        </SubmitButton>

        <Footer>
          <Link to="/login">
            <FormattedMessage id="resetPassword.backToLogin" defaultMessage="返回登录" />
          </Link>
        </Footer>
      </Form>
    </ResetBox>
  );
};

export default ResetForm; 