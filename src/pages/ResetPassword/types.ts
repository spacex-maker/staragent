export interface Language {
  languageCode: string;
  languageNameNative: string;
  usageCount: number;
}

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

export interface EmailInputProps extends InputProps {
  showSuffixDropdown: boolean;
  onSuffixButtonClick: (e: React.MouseEvent) => void;
  onSuffixClick: (suffix: string) => void;
}

export interface CodeInputProps extends InputProps {
  isSending: boolean;
  countdown: number;
  onSendCode: () => void;
}

export interface PasswordInputProps extends InputProps {
  showPassword: boolean;
  onTogglePassword: () => void;
}

export interface ResetFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string;
}

export interface TopControlsProps {
  isDark: boolean;
  onThemeToggle: () => void;
  locale: string;
  languages: Language[];
  onLocaleChange: (locale: string) => void;
} 