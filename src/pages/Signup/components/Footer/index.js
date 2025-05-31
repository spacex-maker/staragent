import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MailOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { 
  FooterWrapper, 
  PhilosophyQuoteWrapper, 
  PoweredByWrapper,
  TeamMemberCard,
  TeamMembersContainer,
  JoinTeamCard,
  EmailInfo
} from './styles';

export const Footer = () => {
  return (
    <FooterWrapper>
      <PhilosophyQuote>
        技术应是为人民服务
      </PhilosophyQuote>
      <PoweredBy>
        © 2024 ProTX Team. All rights reserved.
      </PoweredBy>
    </FooterWrapper>
  );
};

const TeamMember = ({ name, role }) => (
  <TeamMemberCard>
    <div className="content">
      <div className="name">{name}</div>
      <div className="role">{role}</div>
    </div>
    <div className="hover-effect" />
  </TeamMemberCard>
);

const JoinTeam = () => {
  const teamEmail = 'aimatex2024@gmail.com';
  
  const handleJoinClick = () => {
    const emailSubject = "申请加入 ProTX 团队";
    const emailBody = `亲爱的 ProTX 团队：

我想申请加入您们的团队。以下是我的个人信息：

姓名：
职业/专业：
技术栈：
个人简介：
期望职位：
联系方式：

[请附上您的简历或作品集链接]

期待您的回复！

祝好，
[您的姓名]`;

    const mailtoLink = `mailto:${teamEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <>
      <JoinTeamCard onClick={handleJoinClick}>
        <MailOutlined className="mail-icon" />
        <div className="text">申请加入团队</div>
        <div className="hover-effect" />
      </JoinTeamCard>
      <EmailInfo>
        <MailOutlined className="icon" />
        <span className="email">{teamEmail}</span>
      </EmailInfo>
    </>
  );
};

export const PhilosophyQuote = ({ children }) => (
  <PhilosophyQuoteWrapper>
    {children.split('').map((char, index) => (
      <span key={index}>{char}</span>
    ))}
  </PhilosophyQuoteWrapper>
);

export const PoweredBy = ({ children }) => {
  const teamMembers = [
    { name: 'YUNPEI AN', role: 'CTO' }
  ];

  const teamInfo = (
    <TeamMembersContainer>
      {teamMembers.map((member, index) => (
        <TeamMember key={index} {...member} />
      ))}
      <JoinTeam />
    </TeamMembersContainer>
  );

  const text = children.split('ProTX Team');
  
  return (
    <PoweredByWrapper>
      {text[0]}
      <Tooltip 
        title={teamInfo}
        placement="top"
        color="#1a1a1a"
        overlayInnerStyle={{ 
          padding: '16px',
          minWidth: '200px',
          borderRadius: '12px'
        }}
      >
        <span className="team-name">ProTX Team</span>
      </Tooltip>
      {text[1]}
    </PoweredByWrapper>
  );
}; 