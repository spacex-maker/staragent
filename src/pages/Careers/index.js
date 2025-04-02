import React, { useState } from 'react';
import { Row, Col, Typography, Card, Tag, Button, Input, Form, Select, Upload, message, Divider, Steps } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  UploadOutlined, 
  SearchOutlined, 
  EnvironmentOutlined, 
  TeamOutlined, 
  ClockCircleOutlined,
  RocketOutlined,
  BulbOutlined,
  HeartOutlined
} from '@ant-design/icons';
import Footer from '../LandingPage/sections/Footer';
import SimpleHeader from '../../components/headers/simple';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// 样式组件
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--ant-color-bg-layout);
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, var(--ant-color-primary) 0%, #8b5cf6 100%);
  padding: 120px 0 80px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
`;

const HeroPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1%, transparent 1%),
                    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1%, transparent 1%);
  background-size: 60px 60px;
  opacity: 0.3;
`;

const Section = styled.div`
  padding: 80px 0;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const JobCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const JobMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  color: var(--ant-color-text-secondary);
  font-size: 14px;
  
  & > span {
    margin-left: 8px;
  }
`;

const FilterContainer = styled.div`
  background: var(--ant-color-bg-container);
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const ValueCard = styled(Card)`
  height: 100%;
  text-align: center;
  border-radius: 20px;
  border: none;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  
  .ant-card-body {
    padding: 40px 24px;
  }
  
  .icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 32px;
    background: var(--ant-color-primary-bg);
    color: var(--ant-color-primary);
  }
`;

const ApplyButton = styled(Button)`
  margin-top: 16px;
  height: 42px;
  font-weight: 500;
`;

const StickyFilterBar = styled.div`
  position: sticky;
  top: 80px;
  z-index: 10;
`;

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// 工作数据
const jobs = [
  {
    id: 1,
    title: '全栈开发工程师',
    department: '研发部',
    location: '北京',
    type: '全职',
    description: '我们正在寻找一位具有丰富经验的全栈开发工程师加入我们的团队，帮助构建和维护我们的人工智能协作平台。',
    requirements: [
      '5年以上全栈开发经验',
      '精通React、Node.js、TypeScript',
      '具有良好的系统设计和架构能力',
      '熟悉DevOps和CI/CD流程',
      '有AI相关开发经验优先'
    ],
    tags: ['React', 'Node.js', 'TypeScript', 'AI']
  },
  {
    id: 2,
    title: 'AI研究科学家',
    department: '研究院',
    location: '上海',
    type: '全职',
    description: '我们寻找一名AI研究科学家，负责设计和开发新一代AI模型，解决用户画像构建和个性化助理的复杂问题。',
    requirements: [
      '博士或硕士学位，计算机科学、人工智能或相关领域',
      '3年以上机器学习和深度学习实践经验',
      '熟悉大型语言模型、强化学习等技术',
      '良好的研究论文发表记录',
      '能够将研究成果转化为产品实践'
    ],
    tags: ['机器学习', '深度学习', 'LLM', '研究']
  },
  {
    id: 3,
    title: '产品经理',
    department: '产品部',
    location: '深圳',
    type: '全职',
    description: '我们需要一位有远见的产品经理，负责我们AI助手产品的规划、设计和迭代，提供卓越的用户体验。',
    requirements: [
      '5年以上产品管理经验，AI或SaaS产品经验优先',
      '深入理解用户需求，能够转化为产品规划和功能设计',
      '出色的沟通能力和团队协作精神',
      '数据驱动的决策能力',
      '熟悉敏捷开发流程'
    ],
    tags: ['产品管理', 'AI产品', '用户体验', '敏捷']
  },
  {
    id: 4,
    title: 'UI/UX设计师',
    department: '设计部',
    location: '杭州',
    type: '全职',
    description: '寻找一位富有创意的UI/UX设计师，为我们的AI平台创建美观且直观的用户界面，提升用户体验。',
    requirements: [
      '3年以上UI/UX设计经验',
      '精通Figma、Adobe XD等设计工具',
      '深入理解用户体验原则和设计趋势',
      '能够创建交互原型和设计系统',
      '良好的团队协作能力'
    ],
    tags: ['UI设计', 'UX设计', 'Figma', '设计系统']
  },
  {
    id: 5,
    title: '市场营销专员',
    department: '市场部',
    location: '远程',
    type: '全职',
    description: '我们需要一位充满热情的市场营销专员，负责制定和执行营销策略，扩大我们AI平台的市场影响力。',
    requirements: [
      '3年以上B2B SaaS产品营销经验',
      '精通内容营销、社交媒体营销和网络推广',
      '数据分析能力强，能够优化营销效果',
      '优秀的文案和沟通能力',
      '有AI或科技产品营销经验优先'
    ],
    tags: ['市场营销', '内容创作', '数据分析', '社交媒体']
  }
];

// 主组件
const CareersPage = () => {
  const intl = useIntl();
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [department, setDepartment] = useState('all');
  const [location, setLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 处理筛选
  const handleFilter = () => {
    let results = [...jobs];
    
    if (department !== 'all') {
      results = results.filter(job => job.department === department);
    }
    
    if (location !== 'all') {
      results = results.filter(job => job.location === location);
    }
    
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredJobs(results);
  };

  // 公司价值观数据
  const values = [
    {
      icon: <RocketOutlined />,
      title: intl.formatMessage({ id: 'careers.values.innovation.title', defaultMessage: '创新精神' }),
      description: intl.formatMessage({ 
        id: 'careers.values.innovation.description', 
        defaultMessage: '我们不断挑战现状，追求突破，为用户创造前所未有的AI体验。' 
      })
    },
    {
      icon: <TeamOutlined />,
      title: intl.formatMessage({ id: 'careers.values.collaboration.title', defaultMessage: '协作共赢' }),
      description: intl.formatMessage({ 
        id: 'careers.values.collaboration.description', 
        defaultMessage: '我们相信团队的力量，鼓励开放交流，共同解决复杂挑战。' 
      })
    },
    {
      icon: <BulbOutlined />,
      title: intl.formatMessage({ id: 'careers.values.impact.title', defaultMessage: '有意义的影响' }),
      description: intl.formatMessage({ 
        id: 'careers.values.impact.description', 
        defaultMessage: '我们专注于创造有价值的产品，为用户和社会带来积极的变化。' 
      })
    },
    {
      icon: <HeartOutlined />,
      title: intl.formatMessage({ id: 'careers.values.growth.title', defaultMessage: '持续成长' }),
      description: intl.formatMessage({ 
        id: 'careers.values.growth.description', 
        defaultMessage: '我们重视每个人的成长，提供学习和发展的环境，共同进步。' 
      })
    }
  ];
  
  return (
    <PageContainer>
      <SimpleHeader />
      
      {/* 英雄区 */}
      <HeroSection>
        <HeroPattern />
        <ContentContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={1} style={{ color: 'white', fontSize: '3rem', marginBottom: '24px' }}>
              <FormattedMessage id="careers.hero.title" defaultMessage="与我们一起定义AI的未来" />
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>
              <FormattedMessage 
                id="careers.hero.subtitle" 
                defaultMessage="加入我们充满激情的团队，构建改变用户与AI交互方式的创新产品，释放你的潜力，创造非凡影响。" 
              />
            </Paragraph>
          </motion.div>
        </ContentContainer>
      </HeroSection>
      
      {/* 公司价值观 */}
      <Section style={{ background: 'var(--ant-color-bg-container)' }}>
        <ContentContainer>
          <Row justify="center" style={{ marginBottom: '40px' }}>
            <Col xs={24} md={16} style={{ textAlign: 'center' }}>
              <Title level={2}>
                <FormattedMessage id="careers.values.title" defaultMessage="我们的价值观" />
              </Title>
              <Paragraph style={{ fontSize: '1.1rem', color: 'var(--ant-color-text-secondary)' }}>
                <FormattedMessage 
                  id="careers.values.subtitle" 
                  defaultMessage="这些核心价值观引导我们的决策，塑造我们的文化，激励我们追求卓越。" 
                />
              </Paragraph>
            </Col>
          </Row>
          
          <Row gutter={[24, 24]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ValueCard>
                    <div className="icon-wrapper">{value.icon}</div>
                    <Title level={4}>{value.title}</Title>
                    <Paragraph style={{ color: 'var(--ant-color-text-secondary)' }}>
                      {value.description}
                    </Paragraph>
                  </ValueCard>
                </motion.div>
              </Col>
            ))}
          </Row>
        </ContentContainer>
      </Section>
      
      {/* 工作机会 */}
      <Section>
        <ContentContainer>
          <Row justify="center" style={{ marginBottom: '40px' }}>
            <Col xs={24} md={16} style={{ textAlign: 'center' }}>
              <Title level={2}>
                <FormattedMessage id="careers.openings.title" defaultMessage="加入我们的团队" />
              </Title>
              <Paragraph style={{ fontSize: '1.1rem', color: 'var(--ant-color-text-secondary)' }}>
                <FormattedMessage 
                  id="careers.openings.subtitle" 
                  defaultMessage="探索我们当前的职位空缺，找到适合你技能和热情的角色。" 
                />
              </Paragraph>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col xs={24} md={8} lg={6} style={{ marginBottom: '20px' }}>
              <StickyFilterBar>
                <FilterContainer>
                  <Title level={4} style={{ marginBottom: '20px' }}>
                    <FormattedMessage id="careers.filter.title" defaultMessage="筛选条件" />
                  </Title>
                  
                  <Form layout="vertical">
                    <Form.Item 
                      label={<FormattedMessage id="careers.filter.search" defaultMessage="搜索" />}
                      style={{ marginBottom: '16px' }}
                    >
                      <Input 
                        placeholder={intl.formatMessage({ id: 'careers.filter.searchPlaceholder', defaultMessage: '职位名称、技能...' })}
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onPressEnter={handleFilter}
                      />
                    </Form.Item>
                    
                    <Form.Item 
                      label={<FormattedMessage id="careers.filter.department" defaultMessage="部门" />}
                      style={{ marginBottom: '16px' }}
                    >
                      <Select 
                        value={department} 
                        onChange={(value) => setDepartment(value)} 
                        style={{ width: '100%' }}
                      >
                        <Option value="all">
                          <FormattedMessage id="careers.filter.allDepartments" defaultMessage="所有部门" />
                        </Option>
                        <Option value="研发部">研发部</Option>
                        <Option value="研究院">研究院</Option>
                        <Option value="产品部">产品部</Option>
                        <Option value="设计部">设计部</Option>
                        <Option value="市场部">市场部</Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item 
                      label={<FormattedMessage id="careers.filter.location" defaultMessage="地点" />}
                      style={{ marginBottom: '16px' }}
                    >
                      <Select 
                        value={location} 
                        onChange={(value) => setLocation(value)} 
                        style={{ width: '100%' }}
                      >
                        <Option value="all">
                          <FormattedMessage id="careers.filter.allLocations" defaultMessage="所有地点" />
                        </Option>
                        <Option value="北京">北京</Option>
                        <Option value="上海">上海</Option>
                        <Option value="深圳">深圳</Option>
                        <Option value="杭州">杭州</Option>
                        <Option value="远程">远程</Option>
                      </Select>
                    </Form.Item>
                    
                    <Button 
                      type="primary" 
                      block 
                      onClick={handleFilter}
                      style={{ marginTop: '8px' }}
                    >
                      <FormattedMessage id="careers.filter.apply" defaultMessage="应用筛选" />
                    </Button>
                  </Form>
                </FilterContainer>
              </StickyFilterBar>
            </Col>
            
            <Col xs={24} md={16} lg={18}>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <motion.div key={job.id} variants={itemVariants}>
                      <JobCard>
                        <JobMeta>
                          <MetaItem>
                            <EnvironmentOutlined />
                            <span>{job.location}</span>
                          </MetaItem>
                          <MetaItem>
                            <TeamOutlined />
                            <span>{job.department}</span>
                          </MetaItem>
                          <MetaItem>
                            <ClockCircleOutlined />
                            <span>{job.type}</span>
                          </MetaItem>
                        </JobMeta>
                        
                        <Title level={4} style={{ marginBottom: '16px' }}>{job.title}</Title>
                        <Paragraph style={{ marginBottom: '16px' }}>{job.description}</Paragraph>
                        
                        <div style={{ marginBottom: '16px' }}>
                          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                            <FormattedMessage id="careers.job.requirements" defaultMessage="岗位要求:" />
                          </Text>
                          <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                            {job.requirements.map((req, index) => (
                              <li key={index} style={{ marginBottom: '4px' }}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                          {job.tags.map((tag) => (
                            <Tag key={tag} color="blue" style={{ marginRight: '8px', marginBottom: '8px' }}>
                              {tag}
                            </Tag>
                          ))}
                        </div>
                        
                        <ApplyButton type="primary" block>
                          <FormattedMessage id="careers.job.apply" defaultMessage="申请职位" />
                        </ApplyButton>
                      </JobCard>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Paragraph style={{ fontSize: '16px', color: 'var(--ant-color-text-secondary)' }}>
                      <FormattedMessage 
                        id="careers.jobs.noResults" 
                        defaultMessage="没有找到匹配的职位，请尝试调整筛选条件。" 
                      />
                    </Paragraph>
                  </div>
                )}
              </motion.div>
            </Col>
          </Row>
        </ContentContainer>
      </Section>
      
      {/* 申请流程 */}
      <Section style={{ background: 'var(--ant-color-bg-container)' }}>
        <ContentContainer>
          <Row justify="center" style={{ marginBottom: '40px' }}>
            <Col xs={24} md={16} style={{ textAlign: 'center' }}>
              <Title level={2}>
                <FormattedMessage id="careers.process.title" defaultMessage="我们的招聘流程" />
              </Title>
              <Paragraph style={{ fontSize: '1.1rem', color: 'var(--ant-color-text-secondary)' }}>
                <FormattedMessage 
                  id="careers.process.subtitle" 
                  defaultMessage="了解我们的招聘步骤，做好充分准备。" 
                />
              </Paragraph>
            </Col>
          </Row>
          
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} md={18}>
              <Steps current={-1} direction="vertical" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Steps.Step 
                  title={intl.formatMessage({ id: 'careers.process.step1.title', defaultMessage: '申请筛选' })} 
                  description={intl.formatMessage({ 
                    id: 'careers.process.step1.description', 
                    defaultMessage: '我们的人才团队将审核您的申请，匹配您的技能和经验与职位要求。' 
                  })}
                />
                <Steps.Step 
                  title={intl.formatMessage({ id: 'careers.process.step2.title', defaultMessage: '初步面试' })} 
                  description={intl.formatMessage({ 
                    id: 'careers.process.step2.description', 
                    defaultMessage: '与招聘经理进行30-45分钟的视频或电话面试，了解您的背景和职业目标。' 
                  })}
                />
                <Steps.Step 
                  title={intl.formatMessage({ id: 'careers.process.step3.title', defaultMessage: '技术/专业评估' })} 
                  description={intl.formatMessage({ 
                    id: 'careers.process.step3.description', 
                    defaultMessage: '根据职位需求，可能包括技术测试、案例分析或设计挑战。' 
                  })}
                />
                <Steps.Step 
                  title={intl.formatMessage({ id: 'careers.process.step4.title', defaultMessage: '团队面试' })} 
                  description={intl.formatMessage({ 
                    id: 'careers.process.step4.description', 
                    defaultMessage: '与团队成员和跨部门同事进行交流，评估团队契合度和解决问题的能力。' 
                  })}
                />
                <Steps.Step 
                  title={intl.formatMessage({ id: 'careers.process.step5.title', defaultMessage: '最终面试' })} 
                  description={intl.formatMessage({ 
                    id: 'careers.process.step5.description', 
                    defaultMessage: '与高级领导团队的面谈，讨论长期职业发展和公司文化契合度。' 
                  })}
                />
                <Steps.Step 
                  title={intl.formatMessage({ id: 'careers.process.step6.title', defaultMessage: '入职' })} 
                  description={intl.formatMessage({ 
                    id: 'careers.process.step6.description', 
                    defaultMessage: '完成入职流程，加入团队，开始您的AI MateX之旅！' 
                  })}
                />
              </Steps>
            </Col>
          </Row>
        </ContentContainer>
      </Section>
      
      {/* 未找到合适职位 */}
      <Section style={{ paddingBottom: '100px' }}>
        <ContentContainer>
          <Row justify="center">
            <Col xs={24} md={16} lg={14} style={{ textAlign: 'center' }}>
              <Title level={2}>
                <FormattedMessage id="careers.spontaneous.title" defaultMessage="没有找到合适的职位？" />
              </Title>
              <Paragraph style={{ fontSize: '1.1rem', color: 'var(--ant-color-text-secondary)', marginBottom: '32px' }}>
                <FormattedMessage 
                  id="careers.spontaneous.subtitle" 
                  defaultMessage="我们总是对优秀人才敞开大门。发送您的简历，我们会在有合适机会时联系您。" 
                />
              </Paragraph>
              <Button type="primary" size="large" style={{ height: '48px', fontSize: '16px' }}>
                <FormattedMessage id="careers.spontaneous.button" defaultMessage="发送您的简历" />
              </Button>
            </Col>
          </Row>
        </ContentContainer>
      </Section>
      
      <Footer />
    </PageContainer>
  );
};

export default CareersPage; 