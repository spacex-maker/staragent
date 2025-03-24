import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import { message } from 'antd';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import axios from '../../api/axios';
import { base } from '../../api/base';
import { useLocale } from '../../contexts/LocaleContext';
import { PageContainer, RightSection } from './styles';
import TopControls from './TopControls';
import ResetForm from './ResetForm';
import { Language } from './types';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme.mode === 'dark');
  const { locale, changeLocale } = useLocale();
  const intl = useIntl();
  const [languages, setLanguages] = useState<Language[]>([]);

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

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    theme.setTheme(newIsDark);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const code = formData.get('code') as string;
    const password = formData.get('password') as string;

    if (!email || !code || !password) {
      if (!email) {
        setError(intl.formatMessage({ id: 'resetPassword.error.emailRequired' }));
      } else if (!code) {
        setError(intl.formatMessage({ id: 'resetPassword.error.codeRequired' }));
      } else {
        setError(intl.formatMessage({ id: 'resetPassword.error.passwordRequired' }));
      }
      return;
    }

    if (password.length < 6 || password.length > 20) {
      setError(intl.formatMessage({ id: 'resetPassword.error.passwordLength' }));
      return;
    }

    if (code.length !== 6) {
      setError(intl.formatMessage({ id: 'resetPassword.error.codeLength' }));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/base/productx/user/reset-pass', {
        email,
        code,
        password
      });

      if (response.data.success) {
        message.success(intl.formatMessage({ id: 'resetPassword.success.reset' }));
        navigate('/login');
      } else {
        setError(response.data.message || intl.formatMessage({ id: 'resetPassword.error.resetFailed' }));
      }
    } catch (error: any) {
      setError(error.response?.data?.message || intl.formatMessage({ id: 'resetPassword.error.resetFailed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'resetPassword.page.title', defaultMessage: '重置密码 - MyStorageX' })}</title>
        <meta 
          name="description" 
          content={intl.formatMessage({ 
            id: 'resetPassword.page.description', 
            defaultMessage: '重置您的 MyStorageX 账户密码' 
          })} 
        />
      </Helmet>
      <PageContainer>
        <TopControls
          isDark={isDark}
          onThemeToggle={toggleTheme}
          locale={locale}
          languages={languages}
          onLocaleChange={changeLocale}
        />
        <RightSection>
          <ResetForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </RightSection>
      </PageContainer>
    </>
  );
};

export default ResetPasswordPage; 