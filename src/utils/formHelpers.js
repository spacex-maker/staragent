/**
 * 表单处理工具函数
 */
import { format } from 'date-fns';

// 处理数组类型的表单字段，如社交账号、教育经历、工作经验等
export const handleArrayFieldChange = (form, fieldName, index, key, value) => {
  const fieldValue = form.getFieldValue(fieldName) || [];
  const newFieldValue = [...fieldValue];
  
  if (!newFieldValue[index]) {
    newFieldValue[index] = {};
  }
  
  newFieldValue[index][key] = value;
  form.setFieldsValue({ [fieldName]: newFieldValue });
};

// 向数组类型的表单字段添加新项
export const addArrayField = (form, fieldName, defaultValue = {}) => {
  const fieldValue = form.getFieldValue(fieldName) || [];
  const newFieldValue = [...fieldValue, defaultValue];
  form.setFieldsValue({ [fieldName]: newFieldValue });
};

// 从数组类型的表单字段删除指定项
export const removeArrayField = (form, fieldName, index) => {
  const fieldValue = form.getFieldValue(fieldName) || [];
  const newFieldValue = fieldValue.filter((_, i) => i !== index);
  form.setFieldsValue({ [fieldName]: newFieldValue });
};

// 格式化日期
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // 检查日期字符串是否包含时间部分
    const hasTime = dateString.includes(' ') && dateString.includes(':');
    
    // 根据日期格式选择不同的显示方式
    if (hasTime) {
      // yyyy-MM-dd HH:mm:ss 格式，保留日期部分
      return format(new Date(dateString), 'yyyy-MM-dd');
    } else {
      // 只有日期部分
      return format(new Date(dateString), 'yyyy-MM-dd');
    }
  } catch (error) {
    console.error('格式化日期出错:', error);
    return dateString;
  }
};

// 获取性别显示文本
export const getGenderText = (gender) => {
  switch (gender) {
    case 1:
      return '男';
    case 2:
      return '女';
    default:
      return '保密';
  }
};

// 获取能力等级显示文本
export const getProficiencyText = (level) => {
  switch (level) {
    case 1:
      return '入门';
    case 2:
      return '基础';
    case 3:
      return '熟练';
    case 4:
      return '精通';
    case 5:
      return '专家';
    default:
      return '未知';
  }
};

// 检查对象是否为空或只包含空值
export const isEmptyObject = (obj) => {
  if (!obj) return true;
  
  return Object.keys(obj).length === 0 || 
    Object.values(obj).every(value => 
      value === undefined || 
      value === null || 
      value === '' || 
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && isEmptyObject(value))
    );
};

// 深度合并两个对象
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

// 判断是否为对象
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// 生成当前日期时间字符串，格式为yyyy-MM-dd HH:mm:ss
export const getCurrentDateTimeString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 将Date对象或ISO日期字符串转换为后端所需的yyyy-MM-dd HH:mm:ss格式
export const formatDateToString = (date) => {
  if (!date) return '';
  
  try {
    // 如果是字符串，直接返回
    if (typeof date === 'string') {
      if (date.includes(' ') && date.includes(':')) {
        return date; // 如果已经是正确格式，直接返回
      }
    }
    
    // 如果是Date对象
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day} 00:00:00`;
    }
    
    // 如果是dayjs或moment对象
    if (typeof date === 'object' && (date.$d || date._isAMomentObject)) {
      return date.format('YYYY-MM-DD') + ' 00:00:00';
    }
    
    // 其他情况尝试转换为Date对象
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day} 00:00:00`;
    }
    
    console.error('无法解析的日期格式:', date);
    return '';
  } catch (error) {
    console.error('日期转换出错:', error);
    return '';
  }
}; 