import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { 
  GoogleOutlined, 
  GithubOutlined, 
  AppleOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DownOutlined,
} from '@ant-design/icons';
import instance from '../../../../api/axios';
import { message } from 'antd';

import {
  RightSectionWrapper,
  LoginBox,
  Logo,
  Form,
  FormItem,
  InputWrapper,
  Input,
  BorderGlow,
  EmailSuffixButton,
  EmailSuffixDropdown,
  EmailSuffixOption,
  PasswordToggle,
  SubmitButton,
  Divider,
  SocialLogin,
  SocialButton,
  Footer,
  ErrorText,
  ForgotPasswordLink,
  TermsPrivacyLinks
} from './styles';

const emailSuffixes = [
  "@qq.com",
  "@gmail.com",
  "@163.com",
  "@126.com",
  "@outlook.com",
  "@hotmail.com",
  "@yahoo.com",
  "@foxmail.com",
  "@sina.com",
  "@sohu.com"
];

export const RightSection = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  handleSubmit,
  intl,
  onGoogleLoginSuccess
}) => {
  const [showSuffixDropdown, setShowSuffixDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [searchParams] = useSearchParams();
  const dropdownRef = useRef(null);
  const emailSuffixButtonRef = useRef(null);
  const inputWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target) &&
        !emailSuffixButtonRef.current?.contains(event.target)
      ) {
        setShowSuffixDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code) {
      handleGoogleCallback(code, state);
    }
  }, [searchParams]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    const atIndex = value.indexOf('@');
    if (atIndex !== -1 && value.length > atIndex + 1) {
      setShowSuffixDropdown(false);
    } else {
      setShowSuffixDropdown(true);
    }
  };

  const handleSuffixClick = (suffix) => {
    const emailPrefix = email.split("@")[0];
    setEmail(emailPrefix + suffix);
    setShowSuffixDropdown(false);
  };

  const handleSuffixButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSuffixDropdown(!showSuffixDropdown);
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await instance.get('/base/productx/auth/google/auth-url');
      if (response.data.success) {
        window.location.href = response.data.data;
      } else {
        throw new Error(response.data.message || '获取Google登录URL失败');
      }
    } catch (error) {
      console.error('获取Google登录URL失败:', error);
      message.error('获取Google登录URL失败，请稍后重试');
    }
  };

  const handleGoogleCallback = async (code, state) => {
    try {
      const response = await instance.post('/base/productx/auth/google/handle-auth', {
        code,
        state
      });
      
      if (response.data.success) {
        onGoogleLoginSuccess(response.data.data);
      }
    } catch (error) {
      console.error('Google登录失败:', error);
    }
  };

  return (
    <RightSectionWrapper>
      <LoginBox>
        <Logo>
          <FormattedMessage id="login.title" />
        </Logo>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <FormItem>
            <InputWrapper ref={inputWrapperRef}>
              <Input
                type="text"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder={intl.formatMessage({ id: 'login.email.placeholder' })}
                autoComplete="off"
                onFocus={() => setEmailFocused(true)}
                onBlur={(e) => {
                  if (
                    emailSuffixButtonRef.current && 
                    !emailSuffixButtonRef.current.contains(e.relatedTarget)
                  ) {
                    setEmailFocused(false);
                  }
                }}
              />
              <BorderGlow className={emailFocused ? "active" : ""} />
              {!email.includes('@') && (
                <EmailSuffixButton
                  type="button"
                  onClick={handleSuffixButtonClick}
                  ref={emailSuffixButtonRef}
                >
                  <DownOutlined />
                </EmailSuffixButton>
              )}
              <EmailSuffixDropdown 
                ref={dropdownRef}
                className={showSuffixDropdown ? "show" : ""}
              >
                {emailSuffixes.map((suffix, index) => (
                  <EmailSuffixOption
                    key={index}
                    type="button"
                    onClick={() => handleSuffixClick(suffix)}
                  >
                    {suffix}
                  </EmailSuffixOption>
                ))}
              </EmailSuffixDropdown>
            </InputWrapper>
          </FormItem>

          <FormItem>
            <InputWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={intl.formatMessage({ id: 'login.password.placeholder' })}
                autoComplete="new-password"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <BorderGlow className={passwordFocused ? "active" : ""} />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </PasswordToggle>
            </InputWrapper>
            <ForgotPasswordLink to="/reset-password">
              <FormattedMessage id="login.forgotPassword" defaultMessage="忘记密码？" />
            </ForgotPasswordLink>
          </FormItem>

          {error && <ErrorText>{error}</ErrorText>}

          <SubmitButton type="submit" disabled={loading}>
            <FormattedMessage 
              id={loading ? 'login.loading' : 'login.button'} 
            />
          </SubmitButton>

          <Divider>
            <span>
              <FormattedMessage id="login.divider" />
            </span>
          </Divider>

          <SocialLogin>
            <SocialButton 
              type="button" 
              socialType="google" 
              index={0}
              onClick={handleGoogleLogin}
            >
              <GoogleOutlined />
            </SocialButton>
            <SocialButton type="button" socialType="github" index={1}>
              <GithubOutlined />
            </SocialButton>
            <SocialButton type="button" socialType="apple" index={2}>
              <AppleOutlined />
            </SocialButton>
            <SocialButton type="button" socialType="facebook" index={3}>
              <FacebookOutlined />
            </SocialButton>
            <SocialButton type="button" socialType="twitter" index={4}>
              <TwitterOutlined />
            </SocialButton>
            <SocialButton type="button" socialType="linkedin" index={5}>
              <LinkedinOutlined />
            </SocialButton>
          </SocialLogin>

          <Footer>
            <FormattedMessage id="login.signup" />{' '}
            <Link to="/signup">
              <FormattedMessage id="login.signup.link" />
            </Link>
          </Footer>

          <TermsPrivacyLinks>
            <Link to="/privacy">
              <FormattedMessage id="signup.privacy.link" defaultMessage="隐私政策" />
            </Link>
            <span>·</span>
            <Link to="/terms">
              <FormattedMessage id="signup.terms.link" defaultMessage="服务条款" />
            </Link>
          </TermsPrivacyLinks>
        </Form>
      </LoginBox>
    </RightSectionWrapper>
  );
}; 