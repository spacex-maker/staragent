import React from 'react';
import { Row, Col, Space, Card, Typography, Button } from 'antd';
import { 
  RocketOutlined, 
  ProjectOutlined, 
  RobotOutlined, 
  MessageOutlined, 
  TeamOutlined,
  ArrowRightOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import {
  FlowCard,
  StepNumber,
  StepAction,
  ActionStep,
  ImageContainer,
  GradientButton
} from './StyledComponents';

const { Paragraph } = Typography;

const GetStartedTab: React.FC = () => {
  return (
    <>
      <Row justify="center" style={{ margin: '30px 0', paddingBottom: '20px', borderBottom: '1px solid var(--ant-color-border)' }}>
        <Col span={24}>
          <Row gutter={[16, 24]} justify="space-around" align="middle">
            <Col xs={12} sm={6} md={6} lg={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: '#3b82f6', 
                  margin: '0 auto 10px',
                  boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)'
                }}></div>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px', 
                  marginBottom: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <FormattedMessage id="userGuide.step1.title" defaultMessage="创建项目" />
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--ant-color-text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <FormattedMessage id="userGuide.step1.subtitle" defaultMessage="设置工作空间" />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: '#3b82f6', 
                  margin: '0 auto 10px',
                  boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)'
                }}></div>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px', 
                  marginBottom: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <FormattedMessage id="userGuide.step2.title" defaultMessage="创建或招募AI助手" />
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--ant-color-text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <FormattedMessage id="userGuide.step2.subtitle" defaultMessage="定制专属助手" />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: '#3b82f6', 
                  margin: '0 auto 10px',
                  boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)'
                }}></div>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px', 
                  marginBottom: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <FormattedMessage id="userGuide.step3.title" defaultMessage="将AI助手添加至项目" />
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--ant-color-text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <FormattedMessage id="userGuide.step3.subtitle" defaultMessage="组建AI团队" />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: '#3b82f6', 
                  margin: '0 auto 10px',
                  boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)'
                }}></div>
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px', 
                  marginBottom: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <FormattedMessage id="userGuide.step4.title" defaultMessage="创建会话并开始交流" />
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--ant-color-text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <FormattedMessage id="userGuide.step4.subtitle" defaultMessage="智能交流" />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <FlowCard
            title={
              <Space>
                <StepNumber>1</StepNumber>
                <FormattedMessage id="userGuide.step1.title" defaultMessage="创建项目" />
              </Space>
            }
          >
            <ImageContainer>
              <img 
                src="https://px-1258150206.cos.ap-nanjing.myqcloud.com/products/1f0c7e34b101517eb57b00e7968bfe30a62ed916a1cf075285723cbabf36d196.png"
                alt="创建项目示例" 
              />
            </ImageContainer>
            <Paragraph>
              <FormattedMessage 
                id="userGuide.step1.description" 
                defaultMessage="首先，您需要创建一个项目作为您与AI助手合作的工作空间。在创建项目时，您可以设置项目名称、选择相关行业以及添加项目描述，这些信息将帮助AI助手更好地理解您的需求背景。" 
              />
            </Paragraph>
            <StepAction>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step.clickProjectsTab" defaultMessage="点击「项目」标签" />
              </ActionStep>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step.clickNewProjectButton" defaultMessage="点击「新建项目」按钮" />
              </ActionStep>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step.fillProjectInfo" defaultMessage="填写项目信息（名称、行业、描述）" />
              </ActionStep>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step.clickCreate" defaultMessage="点击「创建」完成" />
              </ActionStep>
            </StepAction>
          </FlowCard>
        </Col>
        
        <Col xs={24} md={12}>
          <FlowCard
            title={
              <Space>
                <StepNumber>2</StepNumber>
                <FormattedMessage id="userGuide.step2.title" defaultMessage="创建或招募AI助手" />
              </Space>
            }
          >
            <ImageContainer>
              <img 
                src="https://px-1258150206.cos.ap-nanjing.myqcloud.com/products/a83fa644046446da57ec3153c7e808ec1ecae34b9a93bacfc346cc5a403a3089.png"
                alt="创建AI助手示例" 
              />
            </ImageContainer>
            <Paragraph>
              <FormattedMessage 
                id="userGuide.step2.description" 
                defaultMessage="您可以选择创建自定义AI助手或从AI市场招募现有助手。自定义助手时，您可以设置名称、性格特点、专业领域以及详细的指令提示词。从市场招募时，可以直接选择适合您需求的预设助手。" 
              />
            </Paragraph>
            <StepAction>
              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small" title={<FormattedMessage id="userGuide.customAgent.title" defaultMessage="自定义AI助手" />} bordered={false} style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                    <ActionStep>
                      <CheckCircleFilled /> <FormattedMessage id="userGuide.customAgent.step1" defaultMessage="点击「AI助手」标签" />
                    </ActionStep>
                    <ActionStep>
                      <CheckCircleFilled /> <FormattedMessage id="userGuide.customAgent.step2" defaultMessage="点击「新建AI」按钮" />
                    </ActionStep>
                    <ActionStep>
                      <CheckCircleFilled /> <FormattedMessage id="userGuide.customAgent.step3" defaultMessage="设置助手信息" />
                    </ActionStep>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title={<FormattedMessage id="userGuide.marketAgent.title" defaultMessage="从市场招募" />} bordered={false} style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                    <ActionStep>
                      <CheckCircleFilled /> <FormattedMessage id="userGuide.marketAgent.step1" defaultMessage="点击「AI助手」标签" />
                    </ActionStep>
                    <ActionStep>
                      <CheckCircleFilled /> <FormattedMessage id="userGuide.marketAgent.step2" defaultMessage="点击「招募助手」按钮" />
                    </ActionStep>
                    <ActionStep>
                      <CheckCircleFilled /> <FormattedMessage id="userGuide.marketAgent.step3" defaultMessage="在市场中选择合适的AI助手" />
                    </ActionStep>
                  </Card>
                </Col>
              </Row>
            </StepAction>
          </FlowCard>
        </Col>
        
        <Col xs={24} md={12}>
          <FlowCard
            title={
              <Space>
                <StepNumber>3</StepNumber>
                <FormattedMessage id="userGuide.step3.title" defaultMessage="将AI助手添加至项目" />
              </Space>
            }
          >
            <ImageContainer>
              <img 
                src="https://px-1258150206.cos.ap-nanjing.myqcloud.com/products/1bc35c477a545b1d414594e960391133b6eb7f6ea9adf3033b2f7f5445d0e1f3.png"
                alt="将AI助手添加到项目" 
              />
            </ImageContainer>
            <Paragraph>
              <FormattedMessage 
                id="userGuide.step3.description" 
                defaultMessage="创建或招募AI助手后，您需要将其添加到您的项目中。一个项目可以添加多个AI助手，每个助手可以负责不同的专业领域，协同工作以满足您的需求。" 
              />
            </Paragraph>
            <StepAction>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step3.action1" defaultMessage="进入项目详情页" />
              </ActionStep>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step3.action2" defaultMessage="点击「添加AI助手」按钮" />
              </ActionStep>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step3.action3" defaultMessage="选择需要添加的AI助手" />
              </ActionStep>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step3.action4" defaultMessage="点击「确认添加」" />
              </ActionStep>
            </StepAction>
          </FlowCard>
        </Col>
        
        <Col xs={24} md={12}>
          <FlowCard
            title={
              <Space>
                <StepNumber>4</StepNumber>
                <FormattedMessage id="userGuide.step4.title" defaultMessage="创建会话并开始交流" />
              </Space>
            }
          >
            <ImageContainer>
              <img 
                src="https://px-1258150206.cos.ap-nanjing.myqcloud.com/products/791c6389acfc93aedcb75fcdce47c0e5a9a96bf3acfa7e040cf0f0573c3bdc6f.png"
                alt="与AI助手交流" 
              />
            </ImageContainer>
            <Paragraph>
              <FormattedMessage 
                id="userGuide.step4.description" 
                defaultMessage="一切准备就绪后，您可以在项目中创建新的会话，开始与AI助手进行交流。在输入框中使用@符号可以指定特定的AI助手回答您的问题，或让系统自动选择最适合的助手。" 
              />
            </Paragraph>
            <StepAction>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step4.action1" defaultMessage="进入项目" />
              </ActionStep>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step4.action2" defaultMessage="点击「新建会话」按钮" />
              </ActionStep>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step4.action3" defaultMessage="在输入框中输入问题" />
              </ActionStep>
              <ActionStep>
                <CheckCircleFilled /> <FormattedMessage id="userGuide.step4.action4" defaultMessage="使用@提及特定AI助手（可选）" />
              </ActionStep>
            </StepAction>
          </FlowCard>
        </Col>
      </Row>
      
      <ProcessOverview />
      
      <Row justify="center" style={{ marginTop: 40 }}>
        <Col>
          <GradientButton 
            size="large" 
            icon={<RocketOutlined />}
          >
            <FormattedMessage id="userGuide.getStarted.button" defaultMessage="立即开始使用" />
          </GradientButton>
        </Col>
      </Row>
    </>
  );
};

const ProcessOverview: React.FC = () => {
  return (
    <div style={{ 
      marginTop: 40, 
      padding: '40px 0',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)',
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite linear'
      }}></div>
      
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 0% 0; }
            100% { background-position: -200% 0; }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          
          .flow-step {
            position: relative;
            transition: all 0.3s ease;
          }
          
          .flow-step:hover {
            transform: translateY(-5px);
          }
          
          .flow-step::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -40px;
            width: 40px;
            height: 2px;
            background: rgba(59, 130, 246, 0.5);
          }
          
          .flow-step:last-child::after {
            display: none;
          }
          
          @media (max-width: 768px) {
            .flow-step::after {
              display: none;
            }
          }
        `}
      </style>
      
      <Typography.Title level={3} style={{ 
        textAlign: 'center', 
        marginBottom: 50,
        backgroundImage: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        fontWeight: 700
      }}>
        <FormattedMessage id="userGuide.processOverview.title" defaultMessage="使用流程概览" />
      </Typography.Title>
      
      <Row justify="center" gutter={[40, 30]}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <div className="flow-step" style={{ 
            textAlign: 'center',
            padding: '20px 10px',
            height: '100%',
            animation: 'float 6s ease-in-out infinite'
          }}>
            <div style={{ 
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
              animation: 'pulse 2s infinite'
            }}>
              <ProjectOutlined style={{ fontSize: '32px', color: 'white' }} />
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '8px', 
              color: '#3b82f6'
            }}>01</div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '10px'
            }}>
              <FormattedMessage id="userGuide.flow.step1.title" defaultMessage="创建专属工作空间" />
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--ant-color-text-secondary)',
              lineHeight: '1.5'
            }}>
              <FormattedMessage id="userGuide.flow.step1.description" defaultMessage="建立项目，明确目标和行业背景" />
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <div className="flow-step" style={{ 
            textAlign: 'center',
            padding: '20px 10px',
            height: '100%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '0.4s'
          }}>
            <div style={{ 
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
              animation: 'pulse 2s infinite',
              animationDelay: '0.4s'
            }}>
              <RobotOutlined style={{ fontSize: '32px', color: 'white' }} />
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '8px', 
              color: '#3b82f6'
            }}>02</div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '10px'
            }}>
              <FormattedMessage id="userGuide.flow.step2.title" defaultMessage="定制专属助手" />
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--ant-color-text-secondary)',
              lineHeight: '1.5'
            }}>
              <FormattedMessage id="userGuide.flow.step2.description" defaultMessage="自定义或从市场招募专业AI助手" />
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <div className="flow-step" style={{ 
            textAlign: 'center',
            padding: '20px 10px',
            height: '100%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '0.8s'
          }}>
            <div style={{ 
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
              animation: 'pulse 2s infinite',
              animationDelay: '0.8s'
            }}>
              <TeamOutlined style={{ fontSize: '32px', color: 'white' }} />
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '8px', 
              color: '#3b82f6'
            }}>03</div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '10px'
            }}>
              <FormattedMessage id="userGuide.flow.step3.title" defaultMessage="组建AI团队" />
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--ant-color-text-secondary)',
              lineHeight: '1.5'
            }}>
              <FormattedMessage id="userGuide.flow.step3.description" defaultMessage="建立多元化的智能协作团队" />
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <div className="flow-step" style={{ 
            textAlign: 'center',
            padding: '20px 10px',
            height: '100%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '1.2s'
          }}>
            <div style={{ 
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
              animation: 'pulse 2s infinite',
              animationDelay: '1.2s'
            }}>
              <MessageOutlined style={{ fontSize: '32px', color: 'white' }} />
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '8px', 
              color: '#3b82f6'
            }}>04</div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '10px'
            }}>
              <FormattedMessage id="userGuide.flow.step4.title" defaultMessage="连接沟通" />
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--ant-color-text-secondary)',
              lineHeight: '1.5'
            }}>
              <FormattedMessage id="userGuide.flow.step4.description" defaultMessage="开始高效智能的协作交流" />
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <div className="flow-step" style={{ 
            textAlign: 'center',
            padding: '20px 10px',
            height: '100%',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '1.6s'
          }}>
            <div style={{ 
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
              animation: 'pulse 2s infinite',
              animationDelay: '1.6s'
            }}>
              <ArrowRightOutlined style={{ fontSize: '32px', color: 'white' }} />
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '8px', 
              color: '#3b82f6'
            }}>05</div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              marginBottom: '10px'
            }}>
              <FormattedMessage id="userGuide.flow.step5.title" defaultMessage="持续优化和学习" />
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--ant-color-text-secondary)',
              lineHeight: '1.5'
            }}>
              <FormattedMessage id="userGuide.flow.step5.description" defaultMessage="AI助手不断学习和改进" />
            </div>
          </div>
        </Col>
      </Row>
      
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
        top: '10%',
        left: '-100px',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
        bottom: '5%',
        right: '-50px',
        zIndex: 0
      }}></div>
    </div>
  );
};

export default GetStartedTab; 