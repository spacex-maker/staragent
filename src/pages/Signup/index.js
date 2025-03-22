import React, { useState, useRef, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { useLocale } from "../../contexts/LocaleContext";
import { message } from "antd";
import { auth } from "../../api/auth";
import { base } from "../../api/base";
import axios from '../../api/axios';
import { TopControls } from './components/TopControls';
import { LeftSection } from './components/LeftSection';
import { RightSection } from './components/RightSection';
import { PhilosophyQuote, PoweredBy } from './components/Footer';
import { PageContainer } from './styles';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuffixDropdown, setShowSuffixDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const emailSuffixButtonRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  const [isDark, setIsDark] = useState(theme.mode === 'dark');
  const { locale, changeLocale } = useLocale();
  const intl = useIntl();
  const [languages, setLanguages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // 获取支持的语言列表
  useEffect(() => {
    const fetchLanguages = async () => {
      const result = await base.getEnabledLanguages();
      if (result.success) {
        const sortedLanguages = result.data.sort((a, b) => b.usageCount - a.usageCount);
        setLanguages(sortedLanguages);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    // 获取国家列表
    const fetchCountries = async () => {
      try {
        const response = await axios.get('/base/countries/list-all-enable');
        if (response.data.success) {
          setCountries(response.data.data);
          // 默认选中中国（如果存在）
          const china = response.data.data.find(country => country.code === 'CN');
          if (china) {
            setCountryCode(china.code);
          }
        }
      } catch (error) {
        console.error('获取国家列表失败:', error);
        message.error('获取国家列表失败');
      }
    };

    fetchCountries();
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    theme.setTheme(newIsDark);
  };

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
      setError(intl.formatMessage({ id: 'signup.error.emailRequired' }));
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(intl.formatMessage({ id: 'signup.error.emailInvalid' }));
      return;
    }

    setIsSending(true);

    try {
      const response = await axios.post('/base/productx/user/register-send-email', {
        email
      });

      if (response.data.success) {
        message.success(intl.formatMessage({ id: 'signup.verificationCode.success' }));
        startCountdown();
      } else {
        setError(response.data.message || intl.formatMessage({ id: 'signup.verificationCode.error' }));
      }
    } catch (error) {
      setError(error.response?.data?.message || intl.formatMessage({ id: 'signup.verificationCode.error' }));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !countryCode || !code) {
      setError(intl.formatMessage({ id: 'signup.error.allFieldsRequired' }));
      return;
    }

    if (password !== confirmPassword) {
      setError(intl.formatMessage({ id: 'signup.error.passwordMismatch' }));
      return;
    }

    // 验证用户名长度
    if (username.length < 4 || username.length > 10) {
      setError(intl.formatMessage({ id: 'signup.username.rule.length' }));
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(intl.formatMessage({ id: 'signup.error.emailInvalid' }));
      return;
    }

    // 验证验证码长度
    if (code.length !== 6) {
      setError(intl.formatMessage({ id: 'signup.verificationCode.invalid' }));
      return;
    }

    setLoading(true);

    try {
      const result = await auth.register({
        username,
        email,
        password,
        countryCode,
        code
      });

      if (result.success) {
        message.success(intl.formatMessage({ id: 'signup.success' }));
        navigate("/login");
      } else {
        setError(result.message || intl.formatMessage({ id: 'signup.error.default' }));
      }
    } catch (error) {
      console.error('注册错误:', error);
      setError(error.response?.data?.message || intl.formatMessage({ id: 'signup.error.default' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'signup.page.title' })}</title>
        <meta name="description" content="注册 AIMateX，开启您的智能助手之旅" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <PageContainer>
        <TopControls 
          isDark={isDark}
          toggleTheme={toggleTheme}
          locale={locale}
          languages={languages}
          changeLocale={changeLocale}
        />
        <LeftSection />
        <RightSection 
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          error={error}
          loading={loading}
          showSuffixDropdown={showSuffixDropdown}
          setShowSuffixDropdown={setShowSuffixDropdown}
          dropdownRef={dropdownRef}
          emailSuffixButtonRef={emailSuffixButtonRef}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          countries={countries}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          code={code}
          setCode={setCode}
          countdown={countdown}
          isSending={isSending}
          handleSendCode={handleSendCode}
          handleSubmit={handleSubmit}
        />
        <PhilosophyQuote>
          技术应是为人民服务
        </PhilosophyQuote>
        <PoweredBy>
          © 2024 ProTX Team. All rights reserved.
        </PoweredBy>
      </PageContainer>
    </>
  );
};

export default SignupPage;
