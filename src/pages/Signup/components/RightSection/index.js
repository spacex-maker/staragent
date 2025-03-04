import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { DownOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import {
  RightSection as StyledRightSection,
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
  ErrorText,
  Footer,
  CountrySelector,
  SelectedCountryContent,
  CountryFlag,
  CountryDropdown,
  CountryOption,
  CountryOptionContent,
  VerifyCodeButton,
  RuleHint
} from './styles';

// 邮箱后缀列表
const emailSuffixes = [
  "@qq.com",
  "@gmail.com",
  "@163.com",
  "@126.com",
  "@outlook.com",
  "@hotmail.com",
  "@yahoo.com",
  "@foxmail.com"
];

export const RightSection = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  loading,
  showSuffixDropdown,
  setShowSuffixDropdown,
  dropdownRef,
  emailSuffixButtonRef,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  countries,
  countryCode,
  setCountryCode,
  code,
  setCode,
  countdown,
  isSending,
  handleSendCode,
  handleSubmit
}) => {
  const intl = useIntl();
  const [usernameFocused, setUsernameFocused] = React.useState(false);
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = React.useState(false);
  const [countryFocused, setCountryFocused] = React.useState(false);
  const [codeFocused, setCodeFocused] = React.useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = React.useState(false);
  const [usernameRules, setUsernameRules] = React.useState({
    length: false,
    format: false
  });
  const [passwordRules, setPasswordRules] = React.useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });

  const validateUsername = (value) => {
    setUsernameRules({
      length: value.length >= 4 && value.length <= 10,
      format: /^[a-zA-Z0-9_-]+$/.test(value)
    });
  };

  const validatePassword = (value) => {
    setPasswordRules({
      length: value.length >= 6 && value.length <= 20,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    });
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

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

  return (
    <StyledRightSection>
      <LoginBox>
        <Logo>
          <FormattedMessage id="signup.title" />
        </Logo>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <FormItem index={0}>
            <InputWrapper>
              <CountrySelector
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                <SelectedCountryContent className={!countryCode ? 'placeholder' : ''}>
                  {countryCode && countries.find(c => c.code === countryCode) ? (
                    <>
                      <CountryFlag 
                        src={countries.find(c => c.code === countryCode)?.flagImageUrl} 
                        alt={countries.find(c => c.code === countryCode)?.name}
                        onError={(e) => {
                          e.target.src = '/default-flag.png';
                        }}
                      />
                      <span>{countries.find(c => c.code === countryCode)?.name}</span>
                    </>
                  ) : (
                    <span>选择国家/地区</span>
                  )}
                </SelectedCountryContent>
              </CountrySelector>
              <BorderGlow className={countryFocused ? "active" : ""} />
              <EmailSuffixButton
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                style={{ right: '16px' }}
              >
                <DownOutlined />
              </EmailSuffixButton>
              <CountryDropdown 
                className={showCountryDropdown ? "show" : ""}
              >
                {countries.map(country => (
                  <CountryOption
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setCountryCode(country.code);
                      setShowCountryDropdown(false);
                    }}
                  >
                    <CountryOptionContent>
                      <CountryFlag 
                        src={country.flagImageUrl} 
                        alt={country.name}
                        onError={(e) => {
                          e.target.src = '/default-flag.png';
                        }}
                      />
                      <span>{country.name}</span>
                    </CountryOptionContent>
                  </CountryOption>
                ))}
              </CountryDropdown>
            </InputWrapper>
          </FormItem>

          <FormItem index={1}>
            <InputWrapper>
              <Input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                required
                placeholder={intl.formatMessage({ id: "signup.username.placeholder" })}
                autoComplete="off"
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
              />
              <BorderGlow className={usernameFocused ? "active" : ""} />
              <RuleHint className={usernameFocused ? "show" : ""}>
                <ul>
                  <li className={usernameRules.length ? 'valid' : 'invalid'}>
                    • <FormattedMessage id="signup.username.rule.length" />
                  </li>
                  <li className={usernameRules.format ? 'valid' : 'invalid'}>
                    • <FormattedMessage id="signup.username.rule.format" />
                  </li>
                </ul>
              </RuleHint>
            </InputWrapper>
          </FormItem>

          <FormItem index={2}>
            <InputWrapper>
              <Input
                type="text"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder={intl.formatMessage({ id: "signup.email.placeholder" })}
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
                  ref={emailSuffixButtonRef}
                  type="button"
                  onClick={() => setShowSuffixDropdown(!showSuffixDropdown)}
                >
                  <DownOutlined />
                </EmailSuffixButton>
              )}
              <EmailSuffixDropdown 
                ref={dropdownRef}
                className={showSuffixDropdown ? "show" : ""}
              >
                {emailSuffixes.map(suffix => (
                  <EmailSuffixOption
                    key={suffix}
                    type="button"
                    onClick={() => handleSuffixClick(suffix)}
                  >
                    {suffix}
                  </EmailSuffixOption>
                ))}
              </EmailSuffixDropdown>
            </InputWrapper>
          </FormItem>

          <FormItem index={3}>
            <InputWrapper>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder={intl.formatMessage({ id: "signup.verificationCode.placeholder" })}
                autoComplete="off"
                onFocus={() => setCodeFocused(true)}
                onBlur={() => setCodeFocused(false)}
              />
              <BorderGlow className={codeFocused ? "active" : ""} />
              <VerifyCodeButton
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0 || isSending}
                className={isSending ? 'sending' : ''}
              >
                {isSending ? (
                  <FormattedMessage id="signup.verificationCode.sending" />
                ) : countdown > 0 ? (
                  <FormattedMessage 
                    id="signup.verificationCode.retry"
                    values={{ seconds: countdown }}
                  />
                ) : (
                  <FormattedMessage id="signup.verificationCode.send" />
                )}
              </VerifyCodeButton>
            </InputWrapper>
          </FormItem>

          <FormItem index={4}>
            <InputWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder={intl.formatMessage({ id: "signup.password.placeholder" })}
                autoComplete="new-password"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <BorderGlow className={passwordFocused ? "active" : ""} />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </PasswordToggle>
              <RuleHint className={passwordFocused ? "show" : ""}>
                <ul>
                  <li className={passwordRules.length ? 'valid' : 'invalid'}>
                    • <FormattedMessage id="signup.password.rule.length" />
                  </li>
                  <li className={passwordRules.lowercase ? 'valid' : 'invalid'}>
                    • <FormattedMessage id="signup.password.rule.lowercase" />
                  </li>
                  <li className={passwordRules.uppercase ? 'valid' : 'invalid'}>
                    • <FormattedMessage id="signup.password.rule.uppercase" />
                  </li>
                  <li className={passwordRules.number ? 'valid' : 'invalid'}>
                    • <FormattedMessage id="signup.password.rule.number" />
                  </li>
                  <li className={passwordRules.special ? 'valid' : 'invalid'}>
                    • <FormattedMessage id="signup.password.rule.special" />
                  </li>
                </ul>
              </RuleHint>
            </InputWrapper>
          </FormItem>

          <FormItem index={5}>
            <InputWrapper>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={intl.formatMessage({ id: "signup.confirmPassword.placeholder" })}
                autoComplete="new-password"
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
              <BorderGlow className={confirmPasswordFocused ? "active" : ""} />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </PasswordToggle>
            </InputWrapper>
          </FormItem>

          {error && <ErrorText>{error}</ErrorText>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <FormattedMessage id="signup.loading" />
            ) : (
              <FormattedMessage id="signup.button" />
            )}
          </SubmitButton>
        </Form>
        <Footer>
          <FormattedMessage id="signup.login" />{' '}
          <Link to="/login">
            <FormattedMessage id="signup.login.link" />
          </Link>
        </Footer>
      </LoginBox>
    </StyledRightSection>
  );
}; 