import { FormInstance } from 'antd';
import { Industry } from '../../../../types';

export interface BasicInfoFormProps {
  form: FormInstance;
  initialValues?: {
    name?: string;
    description?: string;
    visibility?: 'public' | 'private';
    industryIds?: number[];
    industries?: Industry[];
  };
} 