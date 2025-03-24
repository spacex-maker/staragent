import React from 'react';
import { useIntl } from 'react-intl';
import { CodeInputProps } from './types';
import {
  FormItem,
  InputWrapper,
  Input,
  BorderGlow,
  VerifyCodeButton,
} from './styles';

const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  isSending,
  countdown,
  onSendCode,
}) => {
  const intl = useIntl();

  return (
    <FormItem>
      <InputWrapper>
        <Input
          type="text"
          value={value}
          onChange={onChange}
          required
          placeholder={intl.formatMessage({ 
            id: 'resetPassword.code.placeholder', 
            defaultMessage: '请输入验证码' 
          })}
          maxLength={6}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <BorderGlow className={value ? "active" : ""} />
        <VerifyCodeButton
          type="button"
          onClick={onSendCode}
          disabled={countdown > 0}
          className={isSending ? 'sending' : ''}
        >
          {isSending 
            ? intl.formatMessage({ id: 'resetPassword.sendCode.sending' })
            : countdown > 0 
              ? intl.formatMessage(
                  { id: 'resetPassword.sendCode.retry' },
                  { seconds: Math.floor(countdown) }
                )
              : intl.formatMessage({ id: 'resetPassword.sendCode' })
          }
        </VerifyCodeButton>
      </InputWrapper>
      {error && <div className="error-text">{error}</div>}
    </FormItem>
  );
};

export default CodeInput; 