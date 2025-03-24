import React, { useRef, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { EmailInputProps } from './types';
import {
  FormItem,
  InputWrapper,
  Input,
  BorderGlow,
  EmailSuffixButton,
  EmailSuffixDropdown,
  EmailSuffixOption,
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

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  showSuffixDropdown,
  onSuffixButtonClick,
  onSuffixClick,
}) => {
  const intl = useIntl();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const emailSuffixButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        emailSuffixButtonRef.current && 
        !emailSuffixButtonRef.current.contains(event.target as Node)
      ) {
        onSuffixClick('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSuffixClick]);

  return (
    <FormItem>
      <InputWrapper>
        <Input
          type="text"
          value={value}
          onChange={onChange}
          required
          placeholder={intl.formatMessage({ 
            id: 'resetPassword.email.placeholder', 
            defaultMessage: '请输入邮箱地址' 
          })}
          autoComplete="off"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <BorderGlow className={showSuffixDropdown ? "active" : ""} />
        {!value.includes('@') && (
          <EmailSuffixButton
            type="button"
            onClick={onSuffixButtonClick}
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
              onClick={() => onSuffixClick(suffix)}
            >
              {suffix}
            </EmailSuffixOption>
          ))}
        </EmailSuffixDropdown>
      </InputWrapper>
      {error && <div className="error-text">{error}</div>}
    </FormItem>
  );
};

export default EmailInput; 