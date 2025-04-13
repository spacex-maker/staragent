import React from 'react';
import { Row, Col, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { StyledCard } from './StyledComponents';

const { Title, Paragraph } = Typography;

const AgentsTab: React.FC = () => {
  return (
    <StyledCard>
      <Paragraph>
        <FormattedMessage 
          id="userGuide.agents.description" 
          defaultMessage="AI助手是您的智能工作伙伴，可以根据您的需求提供专业建议、回答问题或协助完成任务。您可以自定义AI助手的性格、专业领域和工作方式。" 
        />
      </Paragraph>
      
      <Title level={4} style={{ marginTop: 24 }}>
        <FormattedMessage id="userGuide.agents.types.title" defaultMessage="AI助手类型" />
      </Title>
      
      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <StyledCard>
            <Title level={5}>
              <FormattedMessage id="userGuide.agents.type.custom" defaultMessage="自定义助手" />
            </Title>
            <Paragraph>
              <FormattedMessage id="userGuide.agents.type.custom.desc" defaultMessage="根据您的具体需求创建定制化AI助手，可以设置专业领域、性格特点和详细指令。" />
            </Paragraph>
            <ul>
              <li><FormattedMessage id="userGuide.agents.type.custom.feature1" defaultMessage="完全自定义性格和专业领域" /></li>
              <li><FormattedMessage id="userGuide.agents.type.custom.feature2" defaultMessage="可编写详细的提示词指导AI工作方式" /></li>
              <li><FormattedMessage id="userGuide.agents.type.custom.feature3" defaultMessage="根据需求调整模型参数（如温度值、最大输出长度等）" /></li>
            </ul>
          </StyledCard>
        </Col>
        <Col xs={24} md={12}>
          <StyledCard>
            <Title level={5}>
              <FormattedMessage id="userGuide.agents.type.preset" defaultMessage="预设市场助手" />
            </Title>
            <Paragraph>
              <FormattedMessage id="userGuide.agents.type.preset.desc" defaultMessage="从AI市场选择专业预设的助手，可以直接招募并使用，无需复杂设置。" />
            </Paragraph>
            <ul>
              <li><FormattedMessage id="userGuide.agents.type.preset.feature1" defaultMessage="专业预设，即招即用" /></li>
              <li><FormattedMessage id="userGuide.agents.type.preset.feature2" defaultMessage="涵盖多种行业和专业领域" /></li>
              <li><FormattedMessage id="userGuide.agents.type.preset.feature3" defaultMessage="由专家团队优化的提示词和参数配置" /></li>
            </ul>
          </StyledCard>
        </Col>
      </Row>
    </StyledCard>
  );
};

export default AgentsTab; 