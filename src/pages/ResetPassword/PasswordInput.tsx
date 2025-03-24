import React from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { PasswordInputProps } from './types';
import {
  FormItem,
  InputWrapper,
  Input,
  BorderGlow,
  PasswordToggle,
} from './styles';

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  showPassword,
  onTogglePassword,
}) => {
  const intl = useIntl();

  return (
    <FormItem>
      <InputWrapper>
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          placeholder={intl.formatMessage({ 
            id: 'resetPassword.password.placeholder', 
            defaultMessage: '请输入新密码' 
          })}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <BorderGlow className={value ? "active" : ""} />
        <PasswordToggle
          type="button"
          onClick={onTogglePassword}
          tabIndex={-1}
        >
          {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </PasswordToggle>
      </InputWrapper>
      {error && <div className="error-text">{error}</div>}
    </FormItem>
  );
};

export default PasswordInput; 