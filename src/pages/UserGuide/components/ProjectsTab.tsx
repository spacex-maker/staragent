import React from 'react';
import { Row, Col, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { StyledCard } from './StyledComponents';

const { Title, Text, Paragraph } = Typography;

const ProjectsTab: React.FC = () => {
  return (
    <StyledCard>
      <Paragraph>
        <FormattedMessage 
          id="userGuide.projects.description" 
          defaultMessage="项目是组织您与AI助手协作的工作空间。您可以根据不同的需求创建多个项目，每个项目可以有自己的AI助手团队。" 
        />
      </Paragraph>
      
      <Title level={4} style={{ marginTop: 24 }}>
        <FormattedMessage id="userGuide.projects.features.title" defaultMessage="项目功能特点" />
      </Title>
      
      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} md={8}>
          <StyledCard>
            <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>
              <FormattedMessage id="userGuide.projects.feature.collaboration" defaultMessage="多助手协作" />
            </Text>
            <Paragraph>
              <FormattedMessage id="userGuide.projects.feature.collaboration.desc" defaultMessage="一个项目中可以添加多个不同专业领域的AI助手，形成专属智能团队。" />
            </Paragraph>
          </StyledCard>
        </Col>
        <Col xs={24} md={8}>
          <StyledCard>
            <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>
              <FormattedMessage id="userGuide.projects.feature.history" defaultMessage="会话历史保存" />
            </Text>
            <Paragraph>
              <FormattedMessage id="userGuide.projects.feature.history.desc" defaultMessage="所有与AI助手的对话历史都会被保存，方便您随时查看和继续之前的讨论。" />
            </Paragraph>
          </StyledCard>
        </Col>
        <Col xs={24} md={8}>
          <StyledCard>
            <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>
              <FormattedMessage id="userGuide.projects.feature.industry" defaultMessage="行业针对性" />
            </Text>
            <Paragraph>
              <FormattedMessage id="userGuide.projects.feature.industry.desc" defaultMessage="可以为项目选择特定行业，AI助手将根据行业特点提供更专业的回答。" />
            </Paragraph>
          </StyledCard>
        </Col>
      </Row>
    </StyledCard>
  );
};

export default ProjectsTab; 