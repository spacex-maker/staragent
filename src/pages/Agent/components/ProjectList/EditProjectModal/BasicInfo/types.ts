import { FormInstance } from 'antd';

export interface BasicInfoFormProps {
  form: FormInstance;
  initialValues?: {
    name?: string;
    description?: string;
    visibility?: 'public' | 'private';
  };
} 