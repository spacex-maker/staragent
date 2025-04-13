import React from 'react';
import { Row, Col, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { StyledCard } from './StyledComponents';

const { Title, Text, Paragraph } = Typography;

const ChatTipsTab: React.FC = () => {
  return (
    <StyledCard>
      <Paragraph>
        <FormattedMessage 
          id="userGuide.chat.description" 
          defaultMessage="掌握与AI助手高效沟通的技巧，可以帮助您获得更精准、更有价值的回答。" 
        />
      </Paragraph>
      
      <Title level={4} style={{ marginTop: 24 }}>
        <FormattedMessage id="userGuide.chat.tips.title" defaultMessage="高效沟通技巧" />
      </Title>
      
      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} md={8}>
          <StyledCard>
            <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>
              <FormattedMessage id="userGuide.chat.tip.mention" defaultMessage="使用@提及特定AI助手" />
            </Text>
            <Paragraph>
              <FormattedMessage id="userGuide.chat.tip.mention.desc" defaultMessage="在输入框中使用@符号后跟助手名称，可以指定特定的AI助手回答您的问题，特别适合多助手协作场景。" />
            </Paragraph>
          </StyledCard>
        </Col>
        <Col xs={24} md={8}>
          <StyledCard>
            <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>
              <FormattedMessage id="userGuide.chat.tip.context" defaultMessage="提供清晰的上下文" />
            </Text>
            <Paragraph>
              <FormattedMessage id="userGuide.chat.tip.context.desc" defaultMessage="在提问时提供足够的背景信息和上下文，帮助AI助手更好地理解您的需求并给出准确回答。" />
            </Paragraph>
          </StyledCard>
        </Col>
        <Col xs={24} md={8}>
          <StyledCard>
            <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>
              <FormattedMessage id="userGuide.chat.tip.step" defaultMessage="分步骤提问复杂问题" />
            </Text>
            <Paragraph>
              <FormattedMessage id="userGuide.chat.tip.step.desc" defaultMessage="对于复杂问题，可以将其分解为多个简单问题逐步提问，与AI助手一起构建解决方案。" />
            </Paragraph>
          </StyledCard>
        </Col>
      </Row>
    </StyledCard>
  );
};

export default ChatTipsTab; 