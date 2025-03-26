import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Spin, message, Form, Input, Button, Select, DatePicker, Radio, Space, Tag, Divider, Switch } from 'antd';
import { PlusOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { parseISO } from 'date-fns';
import instance from '../../api/axios';
import { isEmptyObject, formatDate, getGenderText, getProficiencyText, formatDateToString, getCurrentDateTimeString } from '../../utils/formHelpers';
import {
  SocialAccountsFormItem,
  EducationFormItem,
  WorkExperienceFormItem,
  LanguageFormItem,
  ExerciseHabitsFormItem,
  SleepHabitFormItem,
  ReadingPreferenceFormItem,
  FinancialHabitFormItem
} from '../forms/ProfileFormItems';
import MBTISelector from '../../pages/Agent/components/MBTISelector';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    overflow: hidden;
  }

  .ant-modal-body {
    padding: 24px 32px;
  }

  .ant-tabs-nav {
    margin-bottom: 24px;
  }

  .ant-form-item-label > label {
    color: var(--ant-color-text-secondary);
  }
  
  // 自定义下拉框样式
  .ant-select .ant-select-selector {
    border-radius: 20px !important;
  }
  
  .ant-select-dropdown {
    border-radius: 20px !important;
    overflow: hidden;
  }
  
  // 标签选择器样式
  .ant-select-multiple .ant-select-selection-item {
    border-radius: 20px !important;
    padding: 0 8px;
    height: 24px;
    line-height: 22px;
    margin: 2px 4px 2px 0;
  }
  
  // 自定义日期选择器样式
  .ant-picker {
    border-radius: 20px !important;
  }
  
  // 自定义输入框样式
  .ant-input {
    border-radius: 20px !important;
  }
  
  .ant-input-textarea textarea {
    border-radius: 20px !important;
  }
  
  // 自定义单选框样式
  .ant-radio-group {
    .ant-radio-button-wrapper {
      border-radius: 20px !important;
    }
  }
  
  // 添加样式过渡效果
  .ant-select, .ant-input, .ant-picker, .ant-radio-button-wrapper {
    transition: all 0.3s ease;
  }
`;

const TabContent = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--ant-color-split);
    border-radius: 3px;
  }
`;

const CardSection = styled.div`
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 24px;
  position: relative;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--ant-color-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TagContainer = styled.div`
  margin-bottom: 16px;
  
  .ant-tag {
    margin-bottom: 8px;
    padding: 4px 10px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
    border-width: 1px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  .ant-tag-blue {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff'};
    border-color: ${props => props.theme.mode === 'dark' ? '#2563eb' : '#93c5fd'};
  }
  
  .ant-tag-green {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5'};
    border-color: ${props => props.theme.mode === 'dark' ? '#059669' : '#6ee7b7'};
  }
  
  .ant-tag-purple {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.1)' : '#f5f3ff'};
    border-color: ${props => props.theme.mode === 'dark' ? '#7c3aed' : '#c4b5fd'};
  }
  
  .ant-tag-magenta {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(219, 39, 119, 0.1)' : '#fdf2f8'};
    border-color: ${props => props.theme.mode === 'dark' ? '#be185d' : '#f9a8d4'};
  }
  
  .ant-tag-orange {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(234, 88, 12, 0.1)' : '#fff7ed'};
    border-color: ${props => props.theme.mode === 'dark' ? '#c2410c' : '#fdba74'};
  }
  
  .ant-tag-gold {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(217, 119, 6, 0.1)' : '#fffbeb'};
    border-color: ${props => props.theme.mode === 'dark' ? '#b45309' : '#fcd34d'};
  }
  
  .ant-tag-cyan {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(6, 182, 212, 0.1)' : '#ecfeff'};
    border-color: ${props => props.theme.mode === 'dark' ? '#0891b2' : '#67e8f9'};
  }
`;

const EditButton = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;
  border-radius: 20px;
`;

const StyledDivider = styled(Divider)`
  margin: 12px 0 20px;
`;

const EducationCard = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  margin-bottom: 12px;
`;

const SchoolLogo = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.02)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  i {
    font-size: 16px;
    color: ${props => props.theme.mode === 'dark' ? '#fff' : '#000'};
  }
`;

const EducationContent = styled.div`
  flex: 1;
`;

const EducationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SchoolName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--ant-color-text);
`;

const DegreeTag = styled.span`
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  color: ${props => props.theme.mode === 'dark' ? '#fff' : '#000'};
`;

const MajorName = styled.p`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
`;

const EducationTime = styled.p`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
`;

const WorkCard = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 10px;
  background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  margin-bottom: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CompanyLogo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  
  i {
    font-size: 18px;
    color: var(--ant-color-primary);
  }
`;

const WorkContent = styled.div`
  flex: 1;
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const CompanyName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0;
  color: var(--ant-color-text);
`;

const PositionTag = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  background-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  color: var(--ant-color-text-secondary);
  font-size: 12px;
`;

const WorkTime = styled.p`
  font-size: 12px;
  color: var(--ant-color-text-secondary);
  margin: 4px 0;
  
  i {
    margin-right: 4px;
  }
`;

const WorkDescription = styled.p`
  font-size: 13px;
  color: var(--ant-color-text);
  margin: 8px 0 0 0;
  line-height: 1.5;
`;

const LanguageTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const LanguageTag = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff'};
  border: 1px solid ${props => props.theme.mode === 'dark' ? '#2563eb' : '#93c5fd'};
  
  .language-name {
    font-weight: 500;
    margin-right: 6px;
  }
  
  .language-level {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.8)'};
  }
`;

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  // 如果日期包含时间部分（包含空格和冒号），则截取日期部分
  if(dateTimeString.includes(' ') && dateTimeString.includes(':')) {
    return dateTimeString.split(' ')[0];
  }
  return dateTimeString;
};

// 主组件
const UserProfileModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('basic');
  const [editMode, setEditMode] = useState({});

  // 获取用户信息
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/productx/user/info-for-ai');
      if (response.data.success) {
        setProfileData(response.data.data || createEmptyProfileData());
      } else {
        message.error('获取用户信息失败');
        setProfileData(createEmptyProfileData());
      }
    } catch (error) {
      console.error('获取用户信息出错:', error);
      message.error('获取用户信息出错');
      setProfileData(createEmptyProfileData());
    } finally {
      setLoading(false);
    }
  };

  // 添加创建空数据的函数
  const createEmptyProfileData = () => {
    return {
      username: '',
      realName: '',
      email: '',
      mobile: '',
      gender: 0,
      birthday: '',
      personalPreference: {
        hobbies: [],
        favoriteColor: '',
        musicPreferences: [],
        moviePreferences: [],
        foodPreferences: [],
        travelPreferences: ''
      },
      personalityInfo: {
        personalityTags: [],
        personalityType: '',
        values: '',
        motto: '',
        selfDescription: '',
        communicationStyle: ''
      },
      socialInfo: {
        socialAccounts: [],
        hometown: '',
        currentLocation: '',
        educationBackground: [],
        workExperience: [],
        languages: []
      },
      healthLifestyle: {
        exerciseHabits: [],
        sleepHabit: {
          averageHours: 0,
          bedtime: '',
          wakeupTime: '',
          sleepQuality: 0
        },
        healthGoals: [],
        meditationPractice: ''
      },
      learningDevelopment: {
        learningStyles: [],
        areasOfInterest: [],
        skillDevelopmentGoals: [],
        readingPreference: {
          bookGenres: [],
          readingFrequency: '',
          readingMediums: [],
          favoriteAuthors: []
        }
      },
      workStyle: {
        workEnvironmentPreference: '',
        workTimePreference: '',
        workStyles: [],
        careerGoals: '',
        financialHabit: {
          savingTendency: '',
          investmentPreferences: [],
          spendingCategories: [],
          financialGoals: ''
        }
      },
      socialPreference: {
        socialSettings: '',
        socialEnergyType: '',
        socialCircleSize: '',
        socialFrequency: ''
      },
      fashionPreference: {
        fashionStyles: [],
        favoriteClothingBrands: [],
        favoriteClothingColors: [],
        seasonalFashionPreferences: {},
        footwearPreferences: '',
        accessoryPreferences: ''
      },
      dietaryPreference: {
        dietaryTypes: [],
        favoriteCuisines: [],
        favoriteFoods: [],
        dislikedFoods: [],
        foodAllergies: [],
        beveragePreferences: [],
        restaurantPreferences: ''
      },
      technologyUsage: {
        devicesUsed: [],
        frequentlyUsedApps: [],
        technologyPreference: '',
        socialMediaUsageHours: 0
      },
      leisureActivity: {
        vacationPreferences: '',
        leisureActivities: [],
        culturalPreferences: '',
        outdoorActivities: []
      },
      transportationPreference: {
        dailyCommute: [],
        shortDistance: [],
        mediumDistance: [],
        longDistance: [],
        navigationApps: [],
        preferSharing: false,
        decisionFactors: [],
        ownedVehicles: []
      }
    };
  };

  // 保存用户信息
  const saveUserProfile = async (section, values) => {
    setLoading(true);
    try {
      const updatedData = { ...profileData };
      
      // 根据不同的部分更新相应的数据
      if (section === 'basic') {
        Object.assign(updatedData, values);
      } else if (section === 'personalityInfo') {
        // 为性格信息专门处理保存逻辑
        updatedData.personalityInfo = { 
          ...updatedData.personalityInfo,
          personalityTags: values.personalityTags || [],
          personalityType: values.personalityType || '',
          values: values.values || '',
          motto: values.motto || '',
          selfDescription: values.selfDescription || '',
          communicationStyle: values.communicationStyle || ''
        };
      } else if (section === 'learningDevelopment') {
        // 为学习发展专门处理保存逻辑
        updatedData.learningDevelopment = {
          ...updatedData.learningDevelopment,
          learningStyles: values.learningStyles || [],
          areasOfInterest: values.areasOfInterest || [],
          skillDevelopmentGoals: values.skillDevelopmentGoals || [],
          readingPreference: values.readingPreference || {
            bookGenres: [],
            readingFrequency: '',
            readingMediums: [],
            favoriteAuthors: []
          }
        };
      } else if (section === 'socialInfo') {
        // 为社交信息专门处理保存逻辑
        updatedData.socialInfo = {
          ...updatedData.socialInfo,
          socialAccounts: values.socialAccounts || [],
          hometown: values.hometown || '',
          currentLocation: values.currentLocation || '',
          educationBackground: values.educationBackground || [],
          workExperience: values.workExperience || [],
          languages: values.languages || []
        };
      } else {
        updatedData[section] = { ...updatedData[section], ...values };
      }
      
      const response = await instance.post('/productx/user/set-info-for-ai', updatedData);
      if (response.data.success) {
        message.success('保存成功');
        setProfileData(updatedData);
        setEditMode({ ...editMode, [section]: false });
        if (onSuccess) onSuccess();
      } else {
        message.error('保存失败');
      }
    } catch (error) {
      console.error('保存用户信息出错:', error);
      message.error('保存用户信息出错');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    if (open) {
      fetchUserProfile();
    }
  }, [open]);

  // 处理标签输入
  const handleTagsChange = (fieldName, tags) => {
    form.setFieldsValue({ [fieldName]: tags });
  };

  // 切换编辑模式
  const toggleEditMode = (section) => {
    setEditMode({ ...editMode, [section]: !editMode[section] });
    
    // 如果进入编辑模式，设置表单初始值
    if (!editMode[section]) {
      if (section === 'basic') {
        form.setFieldsValue({
          username: profileData.username,
          realName: profileData.realName,
          email: profileData.email,
          mobile: profileData.mobile,
          gender: profileData.gender,
          birthday: profileData.birthday ? dayjs(profileData.birthday.split(' ')[0]) : null
        });
      } else if (section === 'personalityInfo') {
        // 为性格信息专门设置表单初始值
        form.setFieldsValue({
          personalityTags: profileData.personalityInfo?.personalityTags || [],
          personalityType: profileData.personalityInfo?.personalityType || '',
          values: profileData.personalityInfo?.values || '',
          motto: profileData.personalityInfo?.motto || '',
          selfDescription: profileData.personalityInfo?.selfDescription || '',
          communicationStyle: profileData.personalityInfo?.communicationStyle || ''
        });
      } else if (section === 'learningDevelopment') {
        // 为学习发展专门设置表单初始值
        form.setFieldsValue({
          learningStyles: profileData.learningDevelopment?.learningStyles || [],
          areasOfInterest: profileData.learningDevelopment?.areasOfInterest || [],
          skillDevelopmentGoals: profileData.learningDevelopment?.skillDevelopmentGoals || [],
          readingPreference: profileData.learningDevelopment?.readingPreference || {
            bookGenres: [],
            readingFrequency: '',
            readingMediums: [],
            favoriteAuthors: []
          }
        });
      } else if (section === 'socialInfo') {
        // 为社交信息专门设置表单初始值
        const educationBackground = profileData.socialInfo?.educationBackground || [];
        const workExperience = profileData.socialInfo?.workExperience || [];
        
        // 处理educationBackground中的日期格式，转换为dayjs对象以供DatePicker使用
        const formattedEducationBackground = educationBackground.map(edu => ({
          ...edu,
          startTime: edu.startTime ? dayjs(edu.startTime.split(' ')[0]) : null,
          endTime: edu.endTime ? dayjs(edu.endTime.split(' ')[0]) : null
        }));
        
        // 处理workExperience中的日期格式，转换为dayjs对象以供DatePicker使用
        const formattedWorkExperience = workExperience.map(work => ({
          ...work,
          startTime: work.startTime ? dayjs(work.startTime.split(' ')[0]) : null,
          endTime: work.endTime ? dayjs(work.endTime.split(' ')[0]) : null
        }));
        
        form.setFieldsValue({
          socialAccounts: profileData.socialInfo?.socialAccounts || [],
          hometown: profileData.socialInfo?.hometown || '',
          currentLocation: profileData.socialInfo?.currentLocation || '',
          educationBackground: formattedEducationBackground,
          workExperience: formattedWorkExperience,
          languages: profileData.socialInfo?.languages || []
        });
      } else if (section === 'personalPreference') {
        // 为个人喜好设置表单初始值
        form.setFieldsValue({
          hobbies: profileData.personalPreference?.hobbies || [],
          favoriteColor: profileData.personalPreference?.favoriteColor || '',
          musicPreferences: profileData.personalPreference?.musicPreferences || [],
          moviePreferences: profileData.personalPreference?.moviePreferences || [],
          foodPreferences: profileData.personalPreference?.foodPreferences || [],
          travelPreferences: profileData.personalPreference?.travelPreferences || ''
        });
      } else if (section === 'fashionPreference') {
        // 为时尚偏好设置表单初始值
        form.setFieldsValue(profileData.fashionPreference || {
          fashionStyles: [],
          favoriteClothingBrands: [],
          favoriteClothingColors: [],
          seasonalFashionPreferences: {},
          footwearPreferences: '',
          accessoryPreferences: ''
        });
      } else if (section === 'dietaryPreference') {
        // 为饮食偏好设置表单初始值
        form.setFieldsValue(profileData.dietaryPreference || {
          dietaryTypes: [],
          favoriteCuisines: [],
          favoriteFoods: [],
          dislikedFoods: [],
          foodAllergies: [],
          beveragePreferences: [],
          restaurantPreferences: ''
        });
      } else if (section === 'healthLifestyle') {
        // 为健康生活方式设置表单初始值
        form.setFieldsValue(profileData.healthLifestyle || {
          exerciseHabits: [],
          sleepHabit: {
            averageHours: 0,
            bedtime: '',
            wakeupTime: '',
            sleepQuality: 0
          },
          healthGoals: [],
          meditationPractice: ''
        });
      } else if (section === 'shoppingHabit') {
        // 为购物习惯设置表单初始值
        form.setFieldsValue(profileData.shoppingHabit || {
          shoppingFrequency: '',
          shoppingChannels: [],
          spendingLevel: '',
          discountSensitivity: 3
        });
      } else if (section === 'technologyUsage') {
        // 为技术使用情况设置表单初始值
        form.setFieldsValue(profileData.technologyUsage || {
          devicesUsed: [],
          frequentlyUsedApps: [],
          technologyPreference: '',
          socialMediaUsageHours: 0
        });
      } else if (section === 'leisureActivity') {
        // 为休闲活动设置表单初始值
        form.setFieldsValue(profileData.leisureActivity || {
          vacationPreferences: '',
          leisureActivities: [],
          culturalPreferences: '',
          outdoorActivities: []
        });
      } else if (section === 'workStyle') {
        // 为工作风格设置表单初始值
        const financialHabit = profileData.workStyle?.financialHabit || {
          savingTendency: '',
          investmentPreferences: [],
          spendingCategories: [],
          financialGoals: ''
        };
        
        form.setFieldsValue({
          workEnvironmentPreference: profileData.workStyle?.workEnvironmentPreference || '',
          workTimePreference: profileData.workStyle?.workTimePreference || '',
          workStyles: profileData.workStyle?.workStyles || [],
          careerGoals: profileData.workStyle?.careerGoals || '',
          financialHabit: financialHabit
        });
      } else if (section === 'transportationPreference') {
        // 为交通偏好设置表单初始值
        form.setFieldsValue(profileData.transportationPreference || {
          dailyCommute: [],
          shortDistance: [],
          mediumDistance: [],
          longDistance: [],
          navigationApps: [],
          preferSharing: false,
          decisionFactors: [],
          ownedVehicles: []
        });
      } else if (section === 'socialPreference') {
        // 为社交偏好设置表单初始值
        form.setFieldsValue({
          socialSettings: profileData.socialPreference?.socialSettings || '',
          socialEnergyType: profileData.socialPreference?.socialEnergyType || '',
          socialCircleSize: profileData.socialPreference?.socialCircleSize || '',
          socialFrequency: profileData.socialPreference?.socialFrequency || ''
        });
      } else if (profileData[section]) {
        form.setFieldsValue(profileData[section]);
      }
    }
  };

  // 处理提交
  const handleSubmit = (section) => {
    form.validateFields().then(values => {
      // 对日期类型字段进行格式转换
      const formattedValues = { ...values };

      // 处理基本信息中的生日字段
      if (section === 'basic' && formattedValues.birthday) {
        formattedValues.birthday = `${formattedValues.birthday.format('YYYY-MM-DD')} 00:00:00`;
      }
      
      // 处理社交信息中的教育背景和工作经历
      if (section === 'socialInfo') {
        // 处理教育背景中的日期
        if (formattedValues.educationBackground && formattedValues.educationBackground.length > 0) {
          formattedValues.educationBackground = formattedValues.educationBackground.map(edu => ({
            ...edu,
            startTime: edu.startTime ? `${edu.startTime.format('YYYY-MM-DD')} 00:00:00` : '',
            endTime: edu.endTime ? `${edu.endTime.format('YYYY-MM-DD')} 00:00:00` : ''
          }));
        }
        
        // 处理工作经历中的日期
        if (formattedValues.workExperience && formattedValues.workExperience.length > 0) {
          formattedValues.workExperience = formattedValues.workExperience.map(work => ({
            ...work,
            startTime: work.startTime ? `${work.startTime.format('YYYY-MM-DD')} 00:00:00` : '',
            endTime: work.endTime ? `${work.endTime.format('YYYY-MM-DD')} 00:00:00` : ''
          }));
        }
      }
      
      saveUserProfile(section, formattedValues);
    });
  };

  return (
    <StyledModal
      title="个人中心"
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {profileData ? (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="基本信息" key="basic">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    基本资料
                    <Button 
                      type="primary" 
                      icon={editMode.basic ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.basic) {
                          handleSubmit('basic');
                        } else {
                          toggleEditMode('basic');
                        }
                      }}
                    >
                      {editMode.basic ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.basic ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                        <Input placeholder="请输入用户名" />
                      </Form.Item>
                      <Form.Item name="realName" label="真实姓名">
                        <Input placeholder="请输入真实姓名" />
                      </Form.Item>
                      <Form.Item name="email" label="邮箱" rules={[{ type: 'email' }]}>
                        <Input placeholder="请输入邮箱" />
                      </Form.Item>
                      <Form.Item name="mobile" label="手机号">
                        <Input placeholder="请输入手机号" />
                      </Form.Item>
                      <Form.Item name="gender" label="性别">
                        <Radio.Group>
                          <Radio value={1}>男</Radio>
                          <Radio value={2}>女</Radio>
                          <Radio value={0}>保密</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item name="birthday" label="生日">
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>用户名:</strong> {profileData.username}</p>
                      <p><strong>真实姓名:</strong> {profileData.realName || '-'}</p>
                      <p><strong>邮箱:</strong> {profileData.email || '-'}</p>
                      <p><strong>手机号:</strong> {profileData.mobile || '-'}</p>
                      <p><strong>性别:</strong> {
                        profileData.gender === 1 ? '男' : 
                        profileData.gender === 2 ? '女' : '保密'
                      }</p>
                      <p><strong>生日:</strong> {profileData.birthday || '-'}</p>
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="个人喜好" key="preference">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    个人喜好
                    <Button 
                      type="primary" 
                      icon={editMode.personalPreference ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.personalPreference) {
                          handleSubmit('personalPreference');
                        } else {
                          toggleEditMode('personalPreference');
                        }
                      }}
                    >
                      {editMode.personalPreference ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.personalPreference ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="hobbies" label="爱好">
                        <Select
                          mode="tags"
                          placeholder="请输入爱好"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <Form.Item name="favoriteColor" label="喜欢的颜色">
                        <Input placeholder="请输入喜欢的颜色" />
                      </Form.Item>
                      <Form.Item name="musicPreferences" label="音乐偏好">
                        <Select
                          mode="tags"
                          placeholder="请输入音乐偏好"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <Form.Item name="moviePreferences" label="电影偏好">
                        <Select
                          mode="tags"
                          placeholder="请输入电影偏好"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <Form.Item name="foodPreferences" label="食物偏好">
                        <Select
                          mode="tags"
                          placeholder="请输入食物偏好"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <Form.Item name="travelPreferences" label="旅行偏好">
                        <TextArea placeholder="请描述您的旅行偏好" rows={4} />
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>爱好:</strong></p>
                      <TagContainer>
                        {profileData.personalPreference?.hobbies?.length > 0 ? 
                          profileData.personalPreference.hobbies.map((hobby, index) => (
                            <Tag key={index} color="blue">{hobby}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>喜欢的颜色:</strong> {profileData.personalPreference?.favoriteColor || '-'}</p>
                      
                      <p><strong>音乐偏好:</strong></p>
                      <TagContainer>
                        {profileData.personalPreference?.musicPreferences?.length > 0 ? 
                          profileData.personalPreference.musicPreferences.map((item, index) => (
                            <Tag key={index} color="purple">{item}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>电影偏好:</strong></p>
                      <TagContainer>
                        {profileData.personalPreference?.moviePreferences?.length > 0 ? 
                          profileData.personalPreference.moviePreferences.map((item, index) => (
                            <Tag key={index} color="magenta">{item}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>食物偏好:</strong></p>
                      <TagContainer>
                        {profileData.personalPreference?.foodPreferences?.length > 0 ? 
                          profileData.personalPreference.foodPreferences.map((item, index) => (
                            <Tag key={index} color="orange">{item}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>旅行偏好:</strong> {profileData.personalPreference?.travelPreferences || '-'}</p>
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="性格信息" key="personality">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    性格信息
                    <Button 
                      type="primary" 
                      icon={editMode.personalityInfo ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.personalityInfo) {
                          handleSubmit('personalityInfo');
                        } else {
                          toggleEditMode('personalityInfo');
                        }
                      }}
                    >
                      {editMode.personalityInfo ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.personalityInfo ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name={['personalityTags']} label="性格标签">
                        <Select
                          mode="tags"
                          placeholder="请输入性格标签"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <Form.Item name={['personalityType']} label="人格类型">
                        <MBTISelector />
                      </Form.Item>
                      <Form.Item name={['values']} label="价值观">
                        <TextArea placeholder="请描述您的价值观" rows={3} />
                      </Form.Item>
                      <Form.Item name={['motto']} label="座右铭">
                        <Input placeholder="请输入您的座右铭" />
                      </Form.Item>
                      <Form.Item name={['selfDescription']} label="自我描述">
                        <TextArea placeholder="请描述您自己" rows={4} />
                      </Form.Item>
                      <Form.Item name={['communicationStyle']} label="沟通风格">
                        <TextArea placeholder="请描述您的沟通风格" rows={3} />
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>性格标签:</strong></p>
                      <TagContainer>
                        {profileData.personalityInfo?.personalityTags?.length > 0 ? 
                          profileData.personalityInfo.personalityTags.map((tag, index) => (
                            <Tag key={index} color="green">{tag}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>人格类型:</strong></p>
                      {profileData.personalityInfo?.personalityType ? (
                        <div style={{ marginBottom: '16px' }}>
                          <MBTISelector value={profileData.personalityInfo.personalityType} />
                        </div>
                      ) : (
                        <p>暂未设置</p>
                      )}
                      
                      <p><strong>价值观:</strong> {profileData.personalityInfo?.values || '-'}</p>
                      <p><strong>座右铭:</strong> {profileData.personalityInfo?.motto || '-'}</p>
                      <p><strong>自我描述:</strong> {profileData.personalityInfo?.selfDescription || '-'}</p>
                      <p><strong>沟通风格:</strong> {profileData.personalityInfo?.communicationStyle || '-'}</p>
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="社交信息" key="social">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    社交信息
                    <Button 
                      type="primary" 
                      icon={editMode.socialInfo ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.socialInfo) {
                          handleSubmit('socialInfo');
                        } else {
                          toggleEditMode('socialInfo');
                        }
                      }}
                    >
                      {editMode.socialInfo ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.socialInfo ? (
                    <Form form={form} layout="vertical">
                      <SocialAccountsFormItem form={form} name="socialAccounts" />
                      
                      <Form.Item name="hometown" label="家乡">
                        <Input placeholder="请输入您的家乡" />
                      </Form.Item>
                      
                      <Form.Item name="currentLocation" label="当前位置">
                        <Input placeholder="请输入您的当前位置" />
                      </Form.Item>
                      
                      <StyledDivider />
                      <h4>教育背景</h4>
                      <EducationFormItem form={form} name="educationBackground" />
                      
                      <StyledDivider />
                      <h4>工作经历</h4>
                      <WorkExperienceFormItem form={form} name="workExperience" />
                      
                      <StyledDivider />
                      <h4>语言能力</h4>
                      <LanguageFormItem form={form} name="languages" />
                    </Form>
                  ) : (
                    <>
                      <p><strong>家乡:</strong> {profileData.socialInfo?.hometown || '-'}</p>
                      <p><strong>当前位置:</strong> {profileData.socialInfo?.currentLocation || '-'}</p>
                      
                      <StyledDivider />
                      <h4>教育背景</h4>
                      {profileData.socialInfo?.educationBackground?.length > 0 ? (
                        <div className="education-list">
                          {profileData.socialInfo.educationBackground.map((edu, index) => (
                            <EducationCard key={index}>
                              <SchoolLogo>
                                <i className="bi bi-mortarboard-fill" />
                              </SchoolLogo>
                              <EducationContent>
                                <EducationHeader>
                                  <SchoolName>{edu.school}</SchoolName>
                                  {edu.degree && <DegreeTag>{edu.degree}</DegreeTag>}
                                </EducationHeader>
                                {edu.major && <MajorName>{edu.major}</MajorName>}
                                {(edu.startTime || edu.endTime) && (
                                  <EducationTime>
                                    <i className="bi bi-calendar3"></i> {formatDateTime(edu.startTime)} - {formatDateTime(edu.endTime) || '至今'}
                                  </EducationTime>
                                )}
                              </EducationContent>
                            </EducationCard>
                          ))}
                        </div>
                      ) : (
                        <p>暂无教育背景信息</p>
                      )}
                      
                      <StyledDivider />
                      <h4>工作经历</h4>
                      {profileData.socialInfo?.workExperience?.length > 0 ? (
                        profileData.socialInfo.workExperience.map((work, index) => (
                          <WorkCard key={index}>
                            <CompanyLogo>
                              <i className="bi bi-briefcase-fill" />
                            </CompanyLogo>
                            <WorkContent>
                              <CompanyHeader>
                                <CompanyName>{work.company}</CompanyName>
                                {work.position && <PositionTag>{work.position}</PositionTag>}
                              </CompanyHeader>
                              {(work.startTime || work.endTime) && (
                                <WorkTime>
                                  <i className="bi bi-calendar3"></i> {formatDateTime(work.startTime)} - {formatDateTime(work.endTime) || '至今'}
                                </WorkTime>
                              )}
                              {work.description && <WorkDescription>{work.description}</WorkDescription>}
                            </WorkContent>
                          </WorkCard>
                        ))
                      ) : (
                        <p>暂无工作经历信息</p>
                      )}
                      
                      <StyledDivider />
                      <h4>语言能力</h4>
                      {profileData.socialInfo?.languages?.length > 0 ? (
                        <LanguageTagContainer>
                          {profileData.socialInfo.languages.map((lang, index) => (
                            <LanguageTag key={index}>
                              <span className="language-name">{lang.name}</span>
                              <span className="language-level">{getProficiencyText(lang.proficiency)}</span>
                            </LanguageTag>
                          ))}
                        </LanguageTagContainer>
                      ) : (
                        <p>暂无语言能力信息</p>
                      )}
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="健康生活" key="health">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    健康生活方式
                    <Button 
                      type="primary" 
                      icon={editMode.healthLifestyle ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.healthLifestyle) {
                          handleSubmit('healthLifestyle');
                        } else {
                          toggleEditMode('healthLifestyle');
                        }
                      }}
                    >
                      {editMode.healthLifestyle ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.healthLifestyle ? (
                    <Form form={form} layout="vertical">
                      <Form.List name="exerciseHabits">
                        {(fields, { add, remove }) => (
                          <>
                            <Form.Item label="运动习惯">
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                style={{ width: '100%' }}
                              >
                                添加运动习惯
                              </Button>
                            </Form.Item>
                            {fields.map(field => (
                              <ExerciseHabitsFormItem 
                                key={field.key} 
                                field={field} 
                                remove={remove} 
                              />
                            ))}
                          </>
                        )}
                      </Form.List>
                      
                      <Form.Item label="睡眠习惯" required>
                        <SleepHabitFormItem />
                      </Form.Item>
                      
                      <Form.Item name="healthGoals" label="健康目标">
                        <Select mode="multiple" placeholder="请选择您的健康目标" allowClear>
                          <Option value="减肥">减肥</Option>
                          <Option value="增肌">增肌</Option>
                          <Option value="提高耐力">提高耐力</Option>
                          <Option value="提高柔韧性">提高柔韧性</Option>
                          <Option value="改善心血管健康">改善心血管健康</Option>
                          <Option value="降低压力">降低压力</Option>
                          <Option value="提高睡眠质量">提高睡眠质量</Option>
                          <Option value="保持身体健康">保持身体健康</Option>
                          <Option value="参加马拉松">参加马拉松</Option>
                          <Option value="改善姿势">改善姿势</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="meditationPractice" label="冥想练习">
                        <TextArea placeholder="请描述您的冥想练习习惯" autoSize={{ minRows: 2, maxRows: 6 }} />
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>运动习惯:</strong></p>
                      {profileData.healthLifestyle?.exerciseHabits?.length > 0 ? (
                        <ul style={{ paddingLeft: '20px' }}>
                          {profileData.healthLifestyle.exerciseHabits.map((exercise, index) => (
                            <li key={index}>
                              <strong>{exercise.type}</strong> - 
                              频率: {exercise.frequency}次/周, 
                              时长: {exercise.duration}分钟, 
                              强度: {
                                exercise.intensity === 1 ? '低' : 
                                exercise.intensity === 2 ? '中' : 
                                exercise.intensity === 3 ? '高' : '未知'
                              }
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>暂无数据</p>
                      )}
                      
                      <p><strong>睡眠习惯:</strong></p>
                      {profileData.healthLifestyle?.sleepHabit && Object.keys(profileData.healthLifestyle.sleepHabit).length > 0 ? (
                        <ul style={{ paddingLeft: '20px' }}>
                          <li><strong>平均睡眠时间:</strong> {profileData.healthLifestyle.sleepHabit.averageHours || 0}小时</li>
                          <li><strong>就寝时间:</strong> {profileData.healthLifestyle.sleepHabit.bedtime || '-'}</li>
                          <li><strong>起床时间:</strong> {profileData.healthLifestyle.sleepHabit.wakeupTime || '-'}</li>
                          <li><strong>睡眠质量:</strong> {
                            profileData.healthLifestyle.sleepHabit.sleepQuality === 1 ? '差' : 
                            profileData.healthLifestyle.sleepHabit.sleepQuality === 2 ? '一般' : 
                            profileData.healthLifestyle.sleepHabit.sleepQuality === 3 ? '良好' : 
                            profileData.healthLifestyle.sleepHabit.sleepQuality === 4 ? '优秀' : '未知'
                          }</li>
                        </ul>
                      ) : (
                        <p>暂无数据</p>
                      )}
                      
                      <p><strong>健康目标:</strong></p>
                      <TagContainer>
                        {profileData.healthLifestyle?.healthGoals?.length > 0 ? 
                          profileData.healthLifestyle.healthGoals.map((goal, index) => (
                            <Tag key={index} color="green">{goal}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>冥想练习:</strong> {profileData.healthLifestyle?.meditationPractice || '-'}</p>
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="购物习惯" key="shopping">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    购物习惯
                    <Button 
                      type="primary" 
                      icon={editMode.shoppingHabit ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.shoppingHabit) {
                          handleSubmit('shoppingHabit');
                        } else {
                          toggleEditMode('shoppingHabit');
                        }
                      }}
                    >
                      {editMode.shoppingHabit ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.shoppingHabit ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="shoppingFrequency" label="购物频率">
                        <Select placeholder="请选择您的购物频率">
                          <Option value="每天">每天</Option>
                          <Option value="每周几次">每周几次</Option>
                          <Option value="每周一次">每周一次</Option>
                          <Option value="每月几次">每月几次</Option>
                          <Option value="很少">很少</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="shoppingChannels" label="购物渠道">
                        <Select mode="multiple" placeholder="请选择您的购物渠道" allowClear>
                          <Option value="线下实体店">线下实体店</Option>
                          <Option value="电商平台">电商平台</Option>
                          <Option value="品牌官网">品牌官网</Option>
                          <Option value="社交电商">社交电商</Option>
                          <Option value="海外购">海外购</Option>
                          <Option value="二手交易平台">二手交易平台</Option>
                          <Option value="微信小程序">微信小程序</Option>
                          <Option value="直播带货">直播带货</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="spendingLevel" label="消费水平">
                        <Select placeholder="请选择您的消费水平">
                          <Option value="经济实惠型">经济实惠型</Option>
                          <Option value="品质优先型">品质优先型</Option>
                          <Option value="高端奢侈型">高端奢侈型</Option>
                          <Option value="平衡型">平衡型</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="discountSensitivity" label="折扣敏感度">
                        <Radio.Group>
                          <Radio value={1}>非常低</Radio>
                          <Radio value={2}>较低</Radio>
                          <Radio value={3}>中等</Radio>
                          <Radio value={4}>较高</Radio>
                          <Radio value={5}>非常高</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>购物频率:</strong> {profileData.shoppingHabit?.shoppingFrequency || '-'}</p>
                      
                      <p><strong>购物渠道:</strong></p>
                      <TagContainer>
                        {profileData.shoppingHabit?.shoppingChannels?.length > 0 ? 
                          profileData.shoppingHabit.shoppingChannels.map((channel, index) => (
                            <Tag key={index} color="blue">{channel}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>消费水平:</strong> {profileData.shoppingHabit?.spendingLevel || '-'}</p>
                      
                      <p><strong>折扣敏感度:</strong> {
                        profileData.shoppingHabit?.discountSensitivity === 1 ? '非常低' : 
                        profileData.shoppingHabit?.discountSensitivity === 2 ? '较低' : 
                        profileData.shoppingHabit?.discountSensitivity === 3 ? '中等' : 
                        profileData.shoppingHabit?.discountSensitivity === 4 ? '较高' : 
                        profileData.shoppingHabit?.discountSensitivity === 5 ? '非常高' : '-'
                      }</p>
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="学习发展" key="learning">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    学习发展
                    <Button 
                      type="primary" 
                      icon={editMode.learningDevelopment ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.learningDevelopment) {
                          handleSubmit('learningDevelopment');
                        } else {
                          toggleEditMode('learningDevelopment');
                        }
                      }}
                    >
                      {editMode.learningDevelopment ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.learningDevelopment ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name={['learningStyles']} label="学习风格">
                        <Select
                          mode="tags"
                          placeholder="请输入学习风格"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      
                      <Form.Item name={['areasOfInterest']} label="兴趣领域">
                        <Select
                          mode="tags"
                          placeholder="请输入兴趣领域"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      
                      <Form.Item name={['skillDevelopmentGoals']} label="技能发展目标">
                        <Select
                          mode="tags"
                          placeholder="请输入技能发展目标"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      
                      <StyledDivider />
                      <h4>阅读偏好</h4>
                      <ReadingPreferenceFormItem form={form} />
                    </Form>
                  ) : (
                    <>
                      <p><strong>学习风格:</strong></p>
                      <TagContainer>
                        {profileData.learningDevelopment?.learningStyles?.length > 0 ? 
                          profileData.learningDevelopment.learningStyles.map((style, index) => (
                            <Tag key={index} color="blue">{style}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>兴趣领域:</strong></p>
                      <TagContainer>
                        {profileData.learningDevelopment?.areasOfInterest?.length > 0 ? 
                          profileData.learningDevelopment.areasOfInterest.map((area, index) => (
                            <Tag key={index} color="purple">{area}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>技能发展目标:</strong></p>
                      <TagContainer>
                        {profileData.learningDevelopment?.skillDevelopmentGoals?.length > 0 ? 
                          profileData.learningDevelopment.skillDevelopmentGoals.map((goal, index) => (
                            <Tag key={index} color="green">{goal}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <StyledDivider />
                      <h4>阅读偏好</h4>
                      {!isEmptyObject(profileData.learningDevelopment?.readingPreference) ? (
                        <>
                          <p><strong>喜欢的书籍类型:</strong></p>
                          <TagContainer>
                            {profileData.learningDevelopment.readingPreference.bookGenres?.length > 0 ? 
                              profileData.learningDevelopment.readingPreference.bookGenres.map((genre, index) => (
                                <Tag key={index} color="magenta">{genre}</Tag>
                              )) : 
                              <span>暂无数据</span>
                            }
                          </TagContainer>
                          
                          <p><strong>阅读频率:</strong> {profileData.learningDevelopment.readingPreference.readingFrequency || '-'}</p>
                          
                          <p><strong>阅读媒介:</strong></p>
                          <TagContainer>
                            {profileData.learningDevelopment.readingPreference.readingMediums?.length > 0 ? 
                              profileData.learningDevelopment.readingPreference.readingMediums.map((medium, index) => (
                                <Tag key={index} color="orange">{medium}</Tag>
                              )) : 
                              <span>暂无数据</span>
                            }
                          </TagContainer>
                          
                          <p><strong>喜欢的作者:</strong></p>
                          <TagContainer>
                            {profileData.learningDevelopment.readingPreference.favoriteAuthors?.length > 0 ? 
                              profileData.learningDevelopment.readingPreference.favoriteAuthors.map((author, index) => (
                                <Tag key={index} color="cyan">{author}</Tag>
                              )) : 
                              <span>暂无数据</span>
                            }
                          </TagContainer>
                        </>
                      ) : (
                        <p>暂无阅读偏好信息</p>
                      )}
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="工作风格" key="work">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    工作风格
                    <Button 
                      type="primary" 
                      icon={editMode.workStyle ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.workStyle) {
                          handleSubmit('workStyle');
                        } else {
                          toggleEditMode('workStyle');
                        }
                      }}
                    >
                      {editMode.workStyle ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.workStyle ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="workEnvironmentPreference" label="工作环境偏好">
                        <Select placeholder="请选择您偏好的工作环境">
                          <Option value="开放式办公室">开放式办公室</Option>
                          <Option value="私人办公室">私人办公室</Option>
                          <Option value="混合式办公环境">混合式办公环境</Option>
                          <Option value="远程办公">远程办公</Option>
                          <Option value="咖啡厅">咖啡厅</Option>
                          <Option value="共享工作空间">共享工作空间</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="workTimePreference" label="工作时间偏好">
                        <Select placeholder="请选择您偏好的工作时间">
                          <Option value="传统朝九晚五">传统朝九晚五</Option>
                          <Option value="弹性工作时间">弹性工作时间</Option>
                          <Option value="早晨工作">早晨工作</Option>
                          <Option value="夜间工作">夜间工作</Option>
                          <Option value="分段工作时间">分段工作时间</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="workStyles" label="工作风格">
                        <Select mode="multiple" placeholder="请选择您的工作风格" allowClear>
                          <Option value="注重细节">注重细节</Option>
                          <Option value="目标导向">目标导向</Option>
                          <Option value="团队合作">团队合作</Option>
                          <Option value="独立工作">独立工作</Option>
                          <Option value="创新思考">创新思考</Option>
                          <Option value="分析型">分析型</Option>
                          <Option value="组织型">组织型</Option>
                          <Option value="战略型">战略型</Option>
                          <Option value="灵活型">灵活型</Option>
                          <Option value="多任务处理型">多任务处理型</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="careerGoals" label="职业目标">
                        <TextArea placeholder="请描述您的职业目标" autoSize={{ minRows: 2, maxRows: 6 }} />
                      </Form.Item>
                      
                      <Form.Item label="财务习惯" required>
                        <FinancialHabitFormItem />
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>工作环境偏好:</strong> {profileData.workStyle?.workEnvironmentPreference || '-'}</p>
                      <p><strong>工作时间偏好:</strong> {profileData.workStyle?.workTimePreference || '-'}</p>
                      
                      <p><strong>工作风格:</strong></p>
                      <TagContainer>
                        {profileData.workStyle?.workStyles?.length > 0 ? 
                          profileData.workStyle.workStyles.map((style, index) => (
                            <Tag key={index} color="blue">{style}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>职业目标:</strong> {profileData.workStyle?.careerGoals || '-'}</p>
                      
                      <p><strong>财务习惯:</strong></p>
                      {profileData.workStyle?.financialHabit && Object.keys(profileData.workStyle.financialHabit).length > 0 ? (
                        <>
                          <p><strong>储蓄倾向:</strong> {profileData.workStyle.financialHabit.savingTendency || '-'}</p>
                          
                          <p><strong>投资偏好:</strong></p>
                          <TagContainer>
                            {profileData.workStyle.financialHabit.investmentPreferences?.length > 0 ? 
                              profileData.workStyle.financialHabit.investmentPreferences.map((pref, index) => (
                                <Tag key={index} color="green">{pref}</Tag>
                              )) : 
                              <span>暂无数据</span>
                            }
                          </TagContainer>
                          
                          <p><strong>消费类别:</strong></p>
                          <TagContainer>
                            {profileData.workStyle.financialHabit.spendingCategories?.length > 0 ? 
                              profileData.workStyle.financialHabit.spendingCategories.map((cat, index) => (
                                <Tag key={index} color="orange">{cat}</Tag>
                              )) : 
                              <span>暂无数据</span>
                            }
                          </TagContainer>
                          
                          <p><strong>财务目标:</strong> {profileData.workStyle.financialHabit.financialGoals || '-'}</p>
                        </>
                      ) : (
                        <p>暂无数据</p>
                      )}
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="交通偏好" key="transportation">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    交通偏好
                    <Button 
                      type="primary" 
                      icon={editMode.transportationPreference ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.transportationPreference) {
                          handleSubmit('transportationPreference');
                        } else {
                          toggleEditMode('transportationPreference');
                        }
                      }}
                    >
                      {editMode.transportationPreference ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.transportationPreference ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="dailyCommute" label="日常通勤">
                        <Select mode="multiple" placeholder="请选择您的日常通勤方式" allowClear>
                          <Option value="私家车">私家车</Option>
                          <Option value="公共交通">公共交通</Option>
                          <Option value="步行">步行</Option>
                          <Option value="骑行">骑行</Option>
                          <Option value="出租车/网约车">出租车/网约车</Option>
                          <Option value="拼车">拼车</Option>
                          <Option value="电动车/摩托车">电动车/摩托车</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="shortDistance" label="短距离交通方式">
                        <Select mode="multiple" placeholder="请选择您的短距离交通方式" allowClear>
                          <Option value="私家车">私家车</Option>
                          <Option value="公共交通">公共交通</Option>
                          <Option value="步行">步行</Option>
                          <Option value="骑行">骑行</Option>
                          <Option value="出租车/网约车">出租车/网约车</Option>
                          <Option value="拼车">拼车</Option>
                          <Option value="电动车/摩托车">电动车/摩托车</Option>
                          <Option value="共享单车">共享单车</Option>
                          <Option value="电动滑板车">电动滑板车</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="mediumDistance" label="中距离交通方式">
                        <Select mode="multiple" placeholder="请选择您的中距离交通方式" allowClear>
                          <Option value="私家车">私家车</Option>
                          <Option value="高铁">高铁</Option>
                          <Option value="火车">火车</Option>
                          <Option value="长途汽车">长途汽车</Option>
                          <Option value="出租车/网约车">出租车/网约车</Option>
                          <Option value="拼车">拼车</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="longDistance" label="长距离交通方式">
                        <Select mode="multiple" placeholder="请选择您的长距离交通方式" allowClear>
                          <Option value="飞机">飞机</Option>
                          <Option value="高铁">高铁</Option>
                          <Option value="火车">火车</Option>
                          <Option value="长途汽车">长途汽车</Option>
                          <Option value="邮轮">邮轮</Option>
                          <Option value="私家车">私家车</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="navigationApps" label="导航应用">
                        <Select mode="multiple" placeholder="请选择您常用的导航应用" allowClear>
                          <Option value="高德地图">高德地图</Option>
                          <Option value="百度地图">百度地图</Option>
                          <Option value="腾讯地图">腾讯地图</Option>
                          <Option value="苹果地图">苹果地图</Option>
                          <Option value="谷歌地图">谷歌地图</Option>
                          <Option value="其他">其他</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="preferSharing" label="是否偏好共享出行" valuePropName="checked">
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                      </Form.Item>
                      
                      <Form.Item name="decisionFactors" label="出行决策因素">
                        <Select mode="multiple" placeholder="请选择您的出行决策因素" allowClear>
                          <Option value="时间效率">时间效率</Option>
                          <Option value="成本">成本</Option>
                          <Option value="舒适度">舒适度</Option>
                          <Option value="环保因素">环保因素</Option>
                          <Option value="隐私">隐私</Option>
                          <Option value="安全性">安全性</Option>
                          <Option value="便利性">便利性</Option>
                          <Option value="灵活性">灵活性</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.List name="ownedVehicles">
                        {(fields, { add, remove }) => (
                          <>
                            <Form.Item label="拥有的车辆">
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                style={{ width: '100%' }}
                              >
                                添加车辆
                              </Button>
                            </Form.Item>
                            {fields.map(field => (
                              <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'type']}
                                  fieldKey={[field.fieldKey, 'type']}
                                  rules={[{ required: true, message: '请选择车辆类型' }]}
                                >
                                  <Select placeholder="车辆类型" style={{ width: 120 }}>
                                    <Option value="轿车">轿车</Option>
                                    <Option value="SUV">SUV</Option>
                                    <Option value="MPV">MPV</Option>
                                    <Option value="跑车">跑车</Option>
                                    <Option value="皮卡">皮卡</Option>
                                    <Option value="电动车">电动车</Option>
                                    <Option value="摩托车">摩托车</Option>
                                    <Option value="自行车">自行车</Option>
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'brand']}
                                  fieldKey={[field.fieldKey, 'brand']}
                                >
                                  <Input placeholder="品牌" style={{ width: 120 }} />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'model']}
                                  fieldKey={[field.fieldKey, 'model']}
                                >
                                  <Input placeholder="型号" style={{ width: 120 }} />
                                </Form.Item>
                                <Button
                                  onClick={() => remove(field.name)}
                                  type="text"
                                  danger
                                >
                                  删除
                                </Button>
                              </Space>
                            ))}
                          </>
                        )}
                      </Form.List>
                    </Form>
                  ) : (
                    <>
                      <p><strong>日常通勤:</strong></p>
                      <TagContainer>
                        {profileData.transportationPreference?.dailyCommute?.length > 0 ? 
                          profileData.transportationPreference.dailyCommute.map((method, index) => (
                            <Tag key={index} color="blue">{method}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>短距离交通方式:</strong></p>
                      <TagContainer>
                        {profileData.transportationPreference?.shortDistance?.length > 0 ? 
                          profileData.transportationPreference.shortDistance.map((method, index) => (
                            <Tag key={index} color="green">{method}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>中距离交通方式:</strong></p>
                      <TagContainer>
                        {profileData.transportationPreference?.mediumDistance?.length > 0 ? 
                          profileData.transportationPreference.mediumDistance.map((method, index) => (
                            <Tag key={index} color="purple">{method}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>长距离交通方式:</strong></p>
                      <TagContainer>
                        {profileData.transportationPreference?.longDistance?.length > 0 ? 
                          profileData.transportationPreference.longDistance.map((method, index) => (
                            <Tag key={index} color="cyan">{method}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>导航应用:</strong></p>
                      <TagContainer>
                        {profileData.transportationPreference?.navigationApps?.length > 0 ? 
                          profileData.transportationPreference.navigationApps.map((app, index) => (
                            <Tag key={index} color="magenta">{app}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>是否偏好共享出行:</strong> {profileData.transportationPreference?.preferSharing ? '是' : '否'}</p>
                      
                      <p><strong>出行决策因素:</strong></p>
                      <TagContainer>
                        {profileData.transportationPreference?.decisionFactors?.length > 0 ? 
                          profileData.transportationPreference.decisionFactors.map((factor, index) => (
                            <Tag key={index} color="orange">{factor}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>拥有的车辆:</strong></p>
                      {profileData.transportationPreference?.ownedVehicles?.length > 0 ? (
                        <ul style={{ paddingLeft: '20px' }}>
                          {profileData.transportationPreference.ownedVehicles.map((vehicle, index) => (
                            <li key={index}>
                              <strong>{vehicle.type}</strong>
                              {vehicle.brand && vehicle.model ? ` - ${vehicle.brand} ${vehicle.model}` : ''}
                              {vehicle.acquisitionTime ? ` (购买时间: ${vehicle.acquisitionTime})` : ''}
                              {vehicle.usageFrequency ? ` - 使用频率: ${vehicle.usageFrequency}` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>暂无数据</p>
                      )}
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="时尚偏好" key="fashion">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    时尚偏好
                    <Button 
                      type="primary" 
                      icon={editMode.fashionPreference ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.fashionPreference) {
                          handleSubmit('fashionPreference');
                        } else {
                          toggleEditMode('fashionPreference');
                        }
                      }}
                    >
                      {editMode.fashionPreference ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.fashionPreference ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="fashionStyles" label="时尚风格">
                        <Select mode="multiple" placeholder="请选择您的时尚风格" allowClear>
                          <Option value="简约">简约 (Minimalist)</Option>
                          <Option value="经典">经典 (Classic)</Option>
                          <Option value="复古">复古 (Vintage)</Option>
                          <Option value="街头">街头 (Street)</Option>
                          <Option value="商务">商务 (Business)</Option>
                          <Option value="休闲">休闲 (Casual)</Option>
                          <Option value="运动">运动 (Athletic)</Option>
                          <Option value="波西米亚">波西米亚 (Bohemian)</Option>
                          <Option value="时尚前卫">时尚前卫 (Avant-garde)</Option>
                          <Option value="优雅">优雅 (Elegant)</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="favoriteClothingBrands" label="喜欢的服装品牌">
                        <Select mode="tags" placeholder="请输入您喜欢的服装品牌" allowClear />
                      </Form.Item>
                      
                      <Form.Item name="favoriteClothingColors" label="喜欢的服装颜色">
                        <Select mode="multiple" placeholder="请选择您喜欢的服装颜色" allowClear>
                          <Option value="黑色">黑色</Option>
                          <Option value="白色">白色</Option>
                          <Option value="灰色">灰色</Option>
                          <Option value="蓝色">蓝色</Option>
                          <Option value="红色">红色</Option>
                          <Option value="绿色">绿色</Option>
                          <Option value="黄色">黄色</Option>
                          <Option value="紫色">紫色</Option>
                          <Option value="粉色">粉色</Option>
                          <Option value="棕色">棕色</Option>
                          <Option value="米色">米色</Option>
                          <Option value="橙色">橙色</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.List name="seasonalFashionPreferences">
                        {(fields, { add, remove }) => (
                          <>
                            <Form.Item label="季节性时尚偏好">
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                style={{ width: '100%' }}
                              >
                                添加季节性偏好
                              </Button>
                            </Form.Item>
                            {fields.map(field => (
                              <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'season']}
                                  fieldKey={[field.fieldKey, 'season']}
                                  rules={[{ required: true, message: '请选择季节' }]}
                                >
                                  <Select placeholder="季节" style={{ width: 120 }}>
                                    <Option value="春季">春季</Option>
                                    <Option value="夏季">夏季</Option>
                                    <Option value="秋季">秋季</Option>
                                    <Option value="冬季">冬季</Option>
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'preference']}
                                  fieldKey={[field.fieldKey, 'preference']}
                                  rules={[{ required: true, message: '请输入偏好' }]}
                                >
                                  <Input placeholder="偏好描述" />
                                </Form.Item>
                                <Button
                                  onClick={() => remove(field.name)}
                                  type="text"
                                  danger
                                >
                                  删除
                                </Button>
                              </Space>
                            ))}
                          </>
                        )}
                      </Form.List>
                      
                      <Form.Item name="footwearPreferences" label="鞋类偏好">
                        <TextArea placeholder="请描述您的鞋类偏好" autoSize={{ minRows: 2, maxRows: 6 }} />
                      </Form.Item>
                      
                      <Form.Item name="accessoryPreferences" label="配饰偏好">
                        <TextArea placeholder="请描述您的配饰偏好" autoSize={{ minRows: 2, maxRows: 6 }} />
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>时尚风格:</strong></p>
                      <TagContainer>
                        {profileData.fashionPreference?.fashionStyles?.length > 0 ? 
                          profileData.fashionPreference.fashionStyles.map((style, index) => (
                            <Tag key={index} color="blue">{style}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>喜欢的服装品牌:</strong></p>
                      <TagContainer>
                        {profileData.fashionPreference?.favoriteClothingBrands?.length > 0 ? 
                          profileData.fashionPreference.favoriteClothingBrands.map((brand, index) => (
                            <Tag key={index} color="purple">{brand}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>喜欢的服装颜色:</strong></p>
                      <TagContainer>
                        {profileData.fashionPreference?.favoriteClothingColors?.length > 0 ? 
                          profileData.fashionPreference.favoriteClothingColors.map((color, index) => (
                            <Tag key={index} color="magenta">{color}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>季节性时尚偏好:</strong></p>
                      {Object.keys(profileData.fashionPreference?.seasonalFashionPreferences || {}).length > 0 ? (
                        <ul style={{ paddingLeft: '20px' }}>
                          {Object.entries(profileData.fashionPreference.seasonalFashionPreferences).map(([season, preference], index) => (
                            <li key={index}><strong>{season}:</strong> {preference}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>暂无数据</p>
                      )}
                      
                      <p><strong>鞋类偏好:</strong> {profileData.fashionPreference?.footwearPreferences || '-'}</p>
                      <p><strong>配饰偏好:</strong> {profileData.fashionPreference?.accessoryPreferences || '-'}</p>
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="饮食偏好" key="diet">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    饮食偏好
                    <Button 
                      type="primary" 
                      icon={editMode.dietaryPreference ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.dietaryPreference) {
                          handleSubmit('dietaryPreference');
                        } else {
                          toggleEditMode('dietaryPreference');
                        }
                      }}
                    >
                      {editMode.dietaryPreference ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.dietaryPreference ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="dietaryTypes" label="饮食类型">
                        <Select mode="multiple" placeholder="请选择您的饮食类型" allowClear>
                          <Option value="无特殊要求">无特殊要求</Option>
                          <Option value="素食主义者">素食主义者 (Vegetarian)</Option>
                          <Option value="纯素食主义者">纯素食主义者 (Vegan)</Option>
                          <Option value="生酮饮食">生酮饮食 (Keto)</Option>
                          <Option value="低碳水化合物">低碳水化合物 (Low-carb)</Option>
                          <Option value="无麸质">无麸质 (Gluten-free)</Option>
                          <Option value="无乳糖">无乳糖 (Lactose-free)</Option>
                          <Option value="无坚果">无坚果 (Nut-free)</Option>
                          <Option value="清真">清真 (Halal)</Option>
                          <Option value="犹太洁食">犹太洁食 (Kosher)</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="favoriteCuisines" label="喜欢的菜系">
                        <Select mode="multiple" placeholder="请选择您喜欢的菜系" allowClear>
                          <Option value="中餐">中餐</Option>
                          <Option value="川菜">川菜</Option>
                          <Option value="粤菜">粤菜</Option>
                          <Option value="湘菜">湘菜</Option>
                          <Option value="鲁菜">鲁菜</Option>
                          <Option value="东北菜">东北菜</Option>
                          <Option value="西餐">西餐</Option>
                          <Option value="法餐">法餐</Option>
                          <Option value="意餐">意餐</Option>
                          <Option value="日料">日料</Option>
                          <Option value="韩餐">韩餐</Option>
                          <Option value="泰餐">泰餐</Option>
                          <Option value="印度菜">印度菜</Option>
                          <Option value="墨西哥菜">墨西哥菜</Option>
                          <Option value="地中海菜">地中海菜</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="favoriteFoods" label="喜欢的食物">
                        <Select mode="tags" placeholder="请输入您喜欢的食物" allowClear />
                      </Form.Item>
                      
                      <Form.Item name="dislikedFoods" label="不喜欢的食物">
                        <Select mode="tags" placeholder="请输入您不喜欢的食物" allowClear />
                      </Form.Item>
                      
                      <Form.Item name="foodAllergies" label="食物过敏">
                        <Select mode="tags" placeholder="请输入您过敏的食物" allowClear />
                      </Form.Item>
                      
                      <Form.Item name="beveragePreferences" label="饮料偏好">
                        <Select mode="multiple" placeholder="请选择您喜欢的饮料" allowClear>
                          <Option value="咖啡">咖啡</Option>
                          <Option value="茶">茶</Option>
                          <Option value="果汁">果汁</Option>
                          <Option value="碳酸饮料">碳酸饮料</Option>
                          <Option value="啤酒">啤酒</Option>
                          <Option value="葡萄酒">葡萄酒</Option>
                          <Option value="烈酒">烈酒</Option>
                          <Option value="鸡尾酒">鸡尾酒</Option>
                          <Option value="矿泉水">矿泉水</Option>
                          <Option value="能量饮料">能量饮料</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="restaurantPreferences" label="餐厅偏好">
                        <TextArea placeholder="请描述您的餐厅偏好" autoSize={{ minRows: 2, maxRows: 6 }} />
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>饮食类型:</strong></p>
                      <TagContainer>
                        {profileData.dietaryPreference?.dietaryTypes?.length > 0 ? 
                          profileData.dietaryPreference.dietaryTypes.map((type, index) => (
                            <Tag key={index} color="blue">{type}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>喜欢的菜系:</strong></p>
                      <TagContainer>
                        {profileData.dietaryPreference?.favoriteCuisines?.length > 0 ? 
                          profileData.dietaryPreference.favoriteCuisines.map((cuisine, index) => (
                            <Tag key={index} color="green">{cuisine}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>喜欢的食物:</strong></p>
                      <TagContainer>
                        {profileData.dietaryPreference?.favoriteFoods?.length > 0 ? 
                          profileData.dietaryPreference.favoriteFoods.map((food, index) => (
                            <Tag key={index} color="purple">{food}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>不喜欢的食物:</strong></p>
                      <TagContainer>
                        {profileData.dietaryPreference?.dislikedFoods?.length > 0 ? 
                          profileData.dietaryPreference.dislikedFoods.map((food, index) => (
                            <Tag key={index} color="magenta">{food}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>食物过敏:</strong></p>
                      <TagContainer>
                        {profileData.dietaryPreference?.foodAllergies?.length > 0 ? 
                          profileData.dietaryPreference.foodAllergies.map((allergy, index) => (
                            <Tag key={index} color="red">{allergy}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>饮料偏好:</strong></p>
                      <TagContainer>
                        {profileData.dietaryPreference?.beveragePreferences?.length > 0 ? 
                          profileData.dietaryPreference.beveragePreferences.map((beverage, index) => (
                            <Tag key={index} color="orange">{beverage}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>餐厅偏好:</strong> {profileData.dietaryPreference?.restaurantPreferences || '-'}</p>
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="技术使用" key="tech">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    技术使用情况
                    <Button 
                      type="primary" 
                      icon={editMode.technologyUsage ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.technologyUsage) {
                          handleSubmit('technologyUsage');
                        } else {
                          toggleEditMode('technologyUsage');
                        }
                      }}
                    >
                      {editMode.technologyUsage ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.technologyUsage ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="devicesUsed" label="使用的设备">
                        <Select mode="multiple" placeholder="请选择您使用的设备" allowClear>
                          <Option value="智能手机">智能手机</Option>
                          <Option value="平板电脑">平板电脑</Option>
                          <Option value="笔记本电脑">笔记本电脑</Option>
                          <Option value="台式电脑">台式电脑</Option>
                          <Option value="智能手表">智能手表</Option>
                          <Option value="智能音箱">智能音箱</Option>
                          <Option value="智能电视">智能电视</Option>
                          <Option value="VR/AR设备">VR/AR设备</Option>
                          <Option value="游戏主机">游戏主机</Option>
                          <Option value="电子书阅读器">电子书阅读器</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="frequentlyUsedApps" label="常用应用">
                        <Select mode="tags" placeholder="请输入您常用的应用" allowClear />
                      </Form.Item>
                      
                      <Form.Item name="technologyPreference" label="技术偏好">
                        <TextArea placeholder="请描述您的技术偏好，如操作系统偏好、品牌偏好等" autoSize={{ minRows: 2, maxRows: 6 }} />
                      </Form.Item>
                      
                      <Form.Item name="socialMediaUsageHours" label="社交媒体使用时间（小时/天）">
                        <Select placeholder="请选择您每天使用社交媒体的时间">
                          <Option value={0}>几乎不使用</Option>
                          <Option value={1}>少于1小时</Option>
                          <Option value={2}>1-2小时</Option>
                          <Option value={3}>2-3小时</Option>
                          <Option value={4}>3-4小时</Option>
                          <Option value={5}>4-5小时</Option>
                          <Option value={6}>5小时以上</Option>
                        </Select>
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>使用的设备:</strong></p>
                      <TagContainer>
                        {profileData.technologyUsage?.devicesUsed?.length > 0 ? 
                          profileData.technologyUsage.devicesUsed.map((device, index) => (
                            <Tag key={index} color="blue">{device}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>常用应用:</strong></p>
                      <TagContainer>
                        {profileData.technologyUsage?.frequentlyUsedApps?.length > 0 ? 
                          profileData.technologyUsage.frequentlyUsedApps.map((app, index) => (
                            <Tag key={index} color="green">{app}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>技术偏好:</strong> {profileData.technologyUsage?.technologyPreference || '-'}</p>
                      
                      <p><strong>社交媒体使用时间:</strong> {
                        profileData.technologyUsage?.socialMediaUsageHours === 0 ? '几乎不使用' : 
                        profileData.technologyUsage?.socialMediaUsageHours === 1 ? '少于1小时/天' : 
                        profileData.technologyUsage?.socialMediaUsageHours === 2 ? '1-2小时/天' : 
                        profileData.technologyUsage?.socialMediaUsageHours === 3 ? '2-3小时/天' : 
                        profileData.technologyUsage?.socialMediaUsageHours === 4 ? '3-4小时/天' : 
                        profileData.technologyUsage?.socialMediaUsageHours === 5 ? '4-5小时/天' : 
                        profileData.technologyUsage?.socialMediaUsageHours === 6 ? '5小时以上/天' : '-'
                      }</p>
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
            
            <TabPane tab="休闲活动" key="leisure">
              <TabContent>
                <CardSection>
                  <SectionTitle>
                    休闲活动
                    <Button 
                      type="primary" 
                      icon={editMode.leisureActivity ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode.leisureActivity) {
                          handleSubmit('leisureActivity');
                        } else {
                          toggleEditMode('leisureActivity');
                        }
                      }}
                    >
                      {editMode.leisureActivity ? '保存' : '编辑'}
                    </Button>
                  </SectionTitle>
                  <StyledDivider />
                  
                  {editMode.leisureActivity ? (
                    <Form form={form} layout="vertical">
                      <Form.Item name="vacationPreferences" label="度假偏好">
                        <TextArea placeholder="请描述您的度假偏好，如海滩度假、城市观光等" autoSize={{ minRows: 2, maxRows: 6 }} />
                      </Form.Item>
                      
                      <Form.Item name="leisureActivities" label="休闲活动">
                        <Select mode="multiple" placeholder="请选择您喜欢的休闲活动" allowClear>
                          <Option value="阅读">阅读</Option>
                          <Option value="看电影">看电影</Option>
                          <Option value="听音乐">听音乐</Option>
                          <Option value="烹饪">烹饪</Option>
                          <Option value="园艺">园艺</Option>
                          <Option value="手工艺">手工艺</Option>
                          <Option value="收藏">收藏</Option>
                          <Option value="绘画">绘画</Option>
                          <Option value="摄影">摄影</Option>
                          <Option value="钓鱼">钓鱼</Option>
                          <Option value="玩游戏">玩游戏</Option>
                          <Option value="看展览">看展览</Option>
                          <Option value="参加派对">参加派对</Option>
                          <Option value="逛街购物">逛街购物</Option>
                          <Option value="冥想">冥想</Option>
                        </Select>
                      </Form.Item>
                      
                      <Form.Item name="culturalPreferences" label="文化偏好">
                        <TextArea placeholder="请描述您的文化偏好，如古典文化、现代文化等" autoSize={{ minRows: 2, maxRows: 6 }} />
                      </Form.Item>
                      
                      <Form.Item name="outdoorActivities" label="户外活动">
                        <Select mode="multiple" placeholder="请选择您喜欢的户外活动" allowClear>
                          <Option value="徒步旅行">徒步旅行</Option>
                          <Option value="露营">露营</Option>
                          <Option value="骑行">骑行</Option>
                          <Option value="登山">登山</Option>
                          <Option value="游泳">游泳</Option>
                          <Option value="滑雪">滑雪</Option>
                          <Option value="冲浪">冲浪</Option>
                          <Option value="攀岩">攀岩</Option>
                          <Option value="划船">划船</Option>
                          <Option value="观鸟">观鸟</Option>
                          <Option value="野餐">野餐</Option>
                          <Option value="垂钓">垂钓</Option>
                          <Option value="高尔夫">高尔夫</Option>
                          <Option value="滑板">滑板</Option>
                          <Option value="户外摄影">户外摄影</Option>
                        </Select>
                      </Form.Item>
                    </Form>
                  ) : (
                    <>
                      <p><strong>度假偏好:</strong> {profileData.leisureActivity?.vacationPreferences || '-'}</p>
                      
                      <p><strong>休闲活动:</strong></p>
                      <TagContainer>
                        {profileData.leisureActivity?.leisureActivities?.length > 0 ? 
                          profileData.leisureActivity.leisureActivities.map((activity, index) => (
                            <Tag key={index} color="blue">{activity}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                      
                      <p><strong>文化偏好:</strong> {profileData.leisureActivity?.culturalPreferences || '-'}</p>
                      
                      <p><strong>户外活动:</strong></p>
                      <TagContainer>
                        {profileData.leisureActivity?.outdoorActivities?.length > 0 ? 
                          profileData.leisureActivity.outdoorActivities.map((activity, index) => (
                            <Tag key={index} color="green">{activity}</Tag>
                          )) : 
                          <span>暂无数据</span>
                        }
                      </TagContainer>
                    </>
                  )}
                </CardSection>
              </TabContent>
            </TabPane>
          </Tabs>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
            <p style={{ marginTop: '16px', color: 'var(--ant-color-text-secondary)' }}>
              正在加载个人信息...
            </p>
          </div>
        )}
      </Spin>
    </StyledModal>
  );
};

export default UserProfileModal; 