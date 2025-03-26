import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Divider, InputNumber, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getCurrentDateTimeString } from '../../utils/formHelpers';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 全局表单样式
const GlobalFormStyle = styled.div`
  .ant-select .ant-select-selector {
    border-radius: 20px !important;
  }
  
  .ant-input, .ant-input-number, .ant-picker {
    border-radius: 20px !important;
  }
  
  .ant-input-number-input {
    border-radius: 20px !important;
  }
  
  .ant-btn {
    border-radius: 20px !important;
  }
  
  .ant-input-textarea textarea {
    border-radius: 20px !important;
  }
  
  .ant-form-item-control-input-content {
    .ant-space {
      width: 100%;
      
      .ant-space-item {
        .ant-picker {
          width: 100%;
        }
      }
    }
  }
`;

// 样式组件
const StyledDivider = styled(Divider)`
  margin: 16px 0;
`;

const ArrayFieldContainer = styled.div`
  background: ${props => props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
`;

const ArrayFieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ArrayFieldTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ant-color-text);
`;

// 将表单项包装在全局样式中
const withGlobalStyle = (Component) => (props) => (
  <GlobalFormStyle>
    <Component {...props} />
  </GlobalFormStyle>
);

// 标签输入组件
export const TagsInput = ({ value = [], onChange, placeholder }) => {
  return (
    <Select
      mode="tags"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '100%' }}
    />
  );
};

// 社交账号表单项
const SocialAccountsFormItemBase = ({ form, name = 'socialAccounts' }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name: fieldName, ...restField }) => (
            <ArrayFieldContainer key={key}>
              <ArrayFieldHeader>
                <ArrayFieldTitle>社交账号 #{fieldName + 1}</ArrayFieldTitle>
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(fieldName)}
                />
              </ArrayFieldHeader>
              
              <Form.Item
                {...restField}
                name={[fieldName, 'platform']}
                label="平台"
                rules={[{ required: true, message: '请输入平台名称' }]}
              >
                <Input placeholder="如：微信、微博、知乎等" />
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[fieldName, 'account']}
                label="账号"
              >
                <Input placeholder="请输入账号" />
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[fieldName, 'link']}
                label="链接"
              >
                <Input placeholder="请输入链接地址" />
              </Form.Item>
            </ArrayFieldContainer>
          ))}
          
          <Form.Item>
            <Button 
              type="dashed" 
              onClick={() => add()} 
              block 
              icon={<PlusOutlined />}
            >
              添加社交账号
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

// 教育背景表单项
const EducationFormItemBase = ({ form, name = 'educationBackground' }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <ArrayFieldContainer key={key}>
              <ArrayFieldHeader>
                <ArrayFieldTitle>教育经历 #{name + 1}</ArrayFieldTitle>
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(name)}
                />
              </ArrayFieldHeader>
              
              <Form.Item
                {...restField}
                name={[name, 'school']}
                label="学校"
                rules={[{ required: true, message: '请输入学校名称' }]}
              >
                <Input placeholder="请输入学校名称" />
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[name, 'major']}
                label="专业"
              >
                <Input placeholder="请输入专业" />
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[name, 'degree']}
                label="学位"
              >
                <Select placeholder="请选择学位">
                  <Option value="高中">高中</Option>
                  <Option value="大专">大专</Option>
                  <Option value="本科">本科</Option>
                  <Option value="硕士">硕士</Option>
                  <Option value="博士">博士</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                {...restField}
                label="起止时间"
              >
                <Space style={{ display: 'flex', width: '100%' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'startTime']}
                    noStyle
                  >
                    <DatePicker placeholder="开始时间" style={{ width: '100%' }} />
                  </Form.Item>
                  <span>至</span>
                  <Form.Item
                    {...restField}
                    name={[name, 'endTime']}
                    noStyle
                  >
                    <DatePicker placeholder="结束时间" style={{ width: '100%' }} />
                  </Form.Item>
                </Space>
              </Form.Item>
            </ArrayFieldContainer>
          ))}
          
          <Form.Item>
            <Button 
              type="dashed" 
              onClick={() => add()} 
              block 
              icon={<PlusOutlined />}
            >
              添加教育经历
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

// 工作经验表单项
const WorkExperienceFormItemBase = ({ form, name = 'workExperience' }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <ArrayFieldContainer key={key}>
              <ArrayFieldHeader>
                <ArrayFieldTitle>工作经历 #{name + 1}</ArrayFieldTitle>
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(name)}
                />
              </ArrayFieldHeader>
              
              <Form.Item
                {...restField}
                name={[name, 'company']}
                label="公司"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input placeholder="请输入公司名称" />
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[name, 'position']}
                label="职位"
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
              
              <Form.Item
                {...restField}
                label="起止时间"
              >
                <Space style={{ display: 'flex', width: '100%' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'startTime']}
                    noStyle
                  >
                    <DatePicker placeholder="开始时间" style={{ width: '100%' }} />
                  </Form.Item>
                  <span>至</span>
                  <Form.Item
                    {...restField}
                    name={[name, 'endTime']}
                    noStyle
                  >
                    <DatePicker placeholder="结束时间" style={{ width: '100%' }} />
                  </Form.Item>
                </Space>
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[name, 'description']}
                label="工作描述"
              >
                <TextArea placeholder="请描述工作内容" rows={3} />
              </Form.Item>
            </ArrayFieldContainer>
          ))}
          
          <Form.Item>
            <Button 
              type="dashed" 
              onClick={() => add()} 
              block 
              icon={<PlusOutlined />}
            >
              添加工作经历
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

// 语言能力表单项
const LanguageFormItemBase = ({ form, name = 'languages' }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <ArrayFieldContainer key={key}>
              <ArrayFieldHeader>
                <ArrayFieldTitle>语言 #{name + 1}</ArrayFieldTitle>
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(name)}
                />
              </ArrayFieldHeader>
              
              <Form.Item
                {...restField}
                name={[name, 'name']}
                label="语言"
                rules={[{ required: true, message: '请输入语言名称' }]}
              >
                <Input placeholder="如：汉语、英语等" />
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[name, 'proficiency']}
                label="熟练程度"
              >
                <Select placeholder="请选择熟练程度">
                  <Option value={1}>入门</Option>
                  <Option value={2}>基础</Option>
                  <Option value={3}>熟练</Option>
                  <Option value={4}>精通</Option>
                  <Option value={5}>母语</Option>
                </Select>
              </Form.Item>
            </ArrayFieldContainer>
          ))}
          
          <Form.Item>
            <Button 
              type="dashed" 
              onClick={() => add()} 
              block 
              icon={<PlusOutlined />}
            >
              添加语言能力
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

// 运动习惯表单项
const ExerciseHabitsFormItemBase = ({ form }) => {
  return (
    <Form.List name="exerciseHabits">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <ArrayFieldContainer key={key}>
              <ArrayFieldHeader>
                <ArrayFieldTitle>运动 #{name + 1}</ArrayFieldTitle>
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(name)}
                />
              </ArrayFieldHeader>
              
              <Form.Item
                {...restField}
                name={[name, 'type']}
                label="运动类型"
                rules={[{ required: true, message: '请输入运动类型' }]}
              >
                <Input placeholder="如：跑步、游泳等" />
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[name, 'frequency']}
                label="频率(每周几次)"
              >
                <InputNumber min={0} max={7} placeholder="0-7" style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[name, 'duration']}
                label="每次时长(分钟)"
              >
                <InputNumber min={0} placeholder="分钟" style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                {...restField}
                name={[name, 'intensity']}
                label="强度"
              >
                <Select placeholder="请选择强度">
                  <Option value={1}>低强度</Option>
                  <Option value={2}>中低强度</Option>
                  <Option value={3}>中等强度</Option>
                  <Option value={4}>中高强度</Option>
                  <Option value={5}>高强度</Option>
                </Select>
              </Form.Item>
            </ArrayFieldContainer>
          ))}
          
          <Form.Item>
            <Button 
              type="dashed" 
              onClick={() => add()} 
              block 
              icon={<PlusOutlined />}
            >
              添加运动习惯
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

// 睡眠习惯表单项
const SleepHabitFormItemBase = ({ form }) => {
  return (
    <>
      <Form.Item
        name={['sleepHabit', 'averageHours']}
        label="平均睡眠时长(小时)"
      >
        <InputNumber min={0} max={24} placeholder="小时" style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item
        name={['sleepHabit', 'bedtime']}
        label="就寝时间"
      >
        <Input placeholder="如：23:00" />
      </Form.Item>
      
      <Form.Item
        name={['sleepHabit', 'wakeupTime']}
        label="起床时间"
      >
        <Input placeholder="如：07:00" />
      </Form.Item>
      
      <Form.Item
        name={['sleepHabit', 'sleepQuality']}
        label="睡眠质量"
      >
        <Select placeholder="请选择睡眠质量">
          <Option value={1}>很差</Option>
          <Option value={2}>较差</Option>
          <Option value={3}>一般</Option>
          <Option value={4}>良好</Option>
          <Option value={5}>优秀</Option>
        </Select>
      </Form.Item>
    </>
  );
};

// 阅读偏好表单项
const ReadingPreferenceFormItemBase = ({ form }) => {
  return (
    <>
      <Form.Item
        name={['readingPreference', 'bookGenres']}
        label="喜欢的书籍类型"
      >
        <Select
          mode="tags"
          placeholder="请输入喜欢的书籍类型"
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item
        name={['readingPreference', 'readingFrequency']}
        label="阅读频率"
      >
        <Select placeholder="请选择阅读频率">
          <Option value="很少阅读">很少阅读</Option>
          <Option value="偶尔阅读">偶尔阅读</Option>
          <Option value="每周阅读几次">每周阅读几次</Option>
          <Option value="每天阅读">每天阅读</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name={['readingPreference', 'readingMediums']}
        label="阅读媒介"
      >
        <Select
          mode="tags"
          placeholder="如：纸质书、电子书等"
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item
        name={['readingPreference', 'favoriteAuthors']}
        label="喜欢的作者"
      >
        <Select
          mode="tags"
          placeholder="请输入喜欢的作者"
          style={{ width: '100%' }}
        />
      </Form.Item>
    </>
  );
};

// 财务习惯表单项
const FinancialHabitFormItemBase = ({ form }) => {
  return (
    <>
      <Form.Item
        name={['financialHabit', 'savingTendency']}
        label="储蓄倾向"
      >
        <Select placeholder="请选择储蓄倾向">
          <Option value="几乎不储蓄">几乎不储蓄</Option>
          <Option value="偶尔储蓄">偶尔储蓄</Option>
          <Option value="经常储蓄">经常储蓄</Option>
          <Option value="总是优先储蓄">总是优先储蓄</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name={['financialHabit', 'investmentPreferences']}
        label="投资偏好"
      >
        <Select
          mode="tags"
          placeholder="如：股票、基金等"
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item
        name={['financialHabit', 'spendingCategories']}
        label="主要支出类别"
      >
        <Select
          mode="tags"
          placeholder="如：餐饮、旅行等"
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item
        name={['financialHabit', 'financialGoals']}
        label="财务目标"
      >
        <TextArea placeholder="请描述您的财务目标" rows={3} />
      </Form.Item>
    </>
  );
};

// 导出带有全局样式的组件
export const SocialAccountsFormItem = withGlobalStyle(SocialAccountsFormItemBase);
export const EducationFormItem = withGlobalStyle(EducationFormItemBase);
export const WorkExperienceFormItem = withGlobalStyle(WorkExperienceFormItemBase);
export const LanguageFormItem = withGlobalStyle(LanguageFormItemBase);
export const ExerciseHabitsFormItem = withGlobalStyle(ExerciseHabitsFormItemBase);
export const SleepHabitFormItem = withGlobalStyle(SleepHabitFormItemBase);
export const ReadingPreferenceFormItem = withGlobalStyle(ReadingPreferenceFormItemBase);
export const FinancialHabitFormItem = withGlobalStyle(FinancialHabitFormItemBase);

export default {
  TagsInput,
  SocialAccountsFormItem,
  EducationFormItem,
  WorkExperienceFormItem,
  LanguageFormItem,
  ExerciseHabitsFormItem,
  SleepHabitFormItem,
  ReadingPreferenceFormItem,
  FinancialHabitFormItem
}; 