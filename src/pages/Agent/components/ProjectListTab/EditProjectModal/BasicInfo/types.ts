import { FormInstance } from 'antd';
import { Industry } from '../../../../types';

export interface BasicInfoFormProps {
  form: FormInstance;
  initialValues?: {
    name?: string;
    description?: string;
    visibility?: 'public' | 'private';
    status?: 'active' | 'inactive' | 'archived';
    industryIds?: number[];
    industries?: Industry[];
    createdAt?: string;
  };
}