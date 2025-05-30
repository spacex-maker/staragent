import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";

import LogoImage from "../../images/logo.svg";
import { ReactComponent as FacebookIcon } from "../../images/company-icon/facebook-icon.svg";
import { ReactComponent as TwitterIcon } from "../../images/twitter-icon.svg";
import { ReactComponent as YoutubeIcon } from "../../images/company-icon/youtube-icon.svg";

const Container = styled.div`
  ${tw`relative px-8 py-20 lg:py-24 bg-gray-100 dark:bg-gray-900`}
`;
const Content = tw.div`max-w-screen-xl mx-auto relative z-10`;
const SixColumns = tw.div`flex flex-wrap text-center sm:text-left justify-center sm:justify-start md:justify-between -mt-12`;

const Column = tw.div`px-4 sm:px-0 sm:w-1/4 md:w-auto mt-12`;

const ColumnHeading = tw.h5`uppercase font-bold text-gray-900 dark:text-gray-100`;

const LinkList = tw.ul`mt-6 text-sm font-medium`;
const LinkListItem = tw.li`mt-3`;
const Link = tw.a`
  border-b-2 border-transparent 
  text-gray-700 dark:text-gray-300
  hocus:text-primary-500 dark:hocus:text-primary-400
  hocus:border-primary-500 dark:hocus:border-primary-400
  pb-1 transition duration-300
`;

const SubscribeNewsletterColumn = tw(Column)`text-center lg:text-left w-full! lg:w-auto! mt-20 lg:mt-12`;
const SubscribeNewsletterContainer = tw.div`max-w-sm mx-auto lg:mx-0`;
const SubscribeText = tw.p`mt-2 lg:mt-6 text-sm font-medium text-gray-600 dark:text-gray-400`;
const SubscribeForm = tw.form`mt-4 lg:mt-6 text-sm sm:flex max-w-xs sm:max-w-none mx-auto sm:mx-0`;
const Input = tw.input`
  px-6 py-3 
  rounded sm:rounded-r-none 
  border-2 sm:border-r-0 
  focus:outline-none 
  transition duration-300 
  w-full
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-gray-100
  border-gray-300 dark:border-gray-600
  focus:border-primary-500 dark:focus:border-primary-400
  placeholder-gray-500 dark:placeholder-gray-400
`;
const SubscribeButton = tw(PrimaryButtonBase)`
  mt-4 sm:mt-0 
  w-full sm:w-auto 
  rounded sm:rounded-l-none 
  px-8 py-3
  bg-primary-500 dark:bg-primary-600
  hover:bg-primary-600 dark:hover:bg-primary-500
  text-gray-100
`;

const Divider = tw.div`my-16 border-b-2 border-gray-300 dark:border-gray-700 w-full`;

const ThreeColRow = tw.div`flex flex-col md:flex-row items-center justify-between`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`ml-2 text-xl font-black tracking-wider text-gray-900 dark:text-gray-100`;

const CopywrightNotice = tw.p`
  text-center text-sm sm:text-base 
  mt-8 md:mt-0 
  font-medium 
  text-gray-600 dark:text-gray-400
`;

const SocialLinksContainer = tw.div`mt-8 md:mt-0 flex`;
const SocialLink = styled.a`
  ${tw`
    cursor-pointer 
    p-2 rounded-full 
    bg-gray-200 dark:bg-gray-700
    text-gray-900 dark:text-gray-100
    hover:bg-gray-300 dark:hover:bg-gray-600
    transition duration-300 
    mr-4 last:mr-0
    flex items-center justify-center
  `}
  svg {
    ${tw`w-4 h-4`}
    fill: currentColor;
  }
`;

export default () => {
  const defaultLinks = [
    {
      url: "https://facebook.com",
      icon: <FacebookIcon />,
    },
    {
      url: "https://twitter.com",
      icon: <TwitterIcon />,
    },
    {
      url: "https://youtube.com",
      icon: <YoutubeIcon />,
    }
  ];

  return (
    <Container>
      <Content>
        <SixColumns>
          <Column>
            <ColumnHeading>主要链接</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="/partner-survey">合伙人调查</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">博客</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">常见问题</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">关于我们</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Product</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="#">Log In</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Personal</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Business</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Team</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Press</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="#">Logos</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Events</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Stories</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Office</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <Column>
            <ColumnHeading>Legal</ColumnHeading>
            <LinkList>
              <LinkListItem>
                <Link href="#">GDPR</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Privacy Policy</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Terms of Service</Link>
              </LinkListItem>
              <LinkListItem>
                <Link href="#">Disclaimer</Link>
              </LinkListItem>
            </LinkList>
          </Column>
          <SubscribeNewsletterColumn>
            <SubscribeNewsletterContainer>
              <ColumnHeading>Subscribe to our Newsletter</ColumnHeading>
              <SubscribeText>
                We deliver high quality blog posts written by professionals weekly. And we promise no spam.
              </SubscribeText>
              <SubscribeForm method="get" action="#">
                <Input type="email" placeholder="Your Email Address" />
                <SubscribeButton type="submit">Subscribe</SubscribeButton>
              </SubscribeForm>
            </SubscribeNewsletterContainer>
          </SubscribeNewsletterColumn>
        </SixColumns>
        <Divider />
        <ThreeColRow>
          <LogoContainer>
            <LogoImg src={LogoImage} />
            <LogoText>Treact</LogoText>
          </LogoContainer>
          <CopywrightNotice>&copy; 2024 Treact Inc. All Rights Reserved.</CopywrightNotice>
          <SocialLinksContainer>
            {defaultLinks.map((link, index) => (
              <SocialLink key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.icon}
              </SocialLink>
            ))}
          </SocialLinksContainer>
        </ThreeColRow>
      </Content>
    </Container>
  );
};
