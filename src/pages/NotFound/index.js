import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Result, Button } from 'antd';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
`;

const NotFoundPage = () => {
  const intl = useIntl();

  return (
    <NotFoundContainer>
      <Result
        status="404"
        title="404"
        subTitle={intl.formatMessage({
          id: 'notFound.subTitle',
          defaultMessage: '抱歉，您访问的页面不存在。'
        })}
        extra={
          <Button type="primary">
            <Link to="/">
              {intl.formatMessage({
                id: 'notFound.backHome',
                defaultMessage: '返回首页'
              })}
            </Link>
          </Button>
        }
      />
    </NotFoundContainer>
  );
};

export default NotFoundPage; 