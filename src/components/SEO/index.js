import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url = 'https://aimatex.com',
  type = 'website',
  locale = 'zh_CN',
  twitterHandle = '@aimatex'
}) => {
  const siteTitle = 'AI MateX';
  const fullTitle = title ? `${title} - ${siteTitle}` : siteTitle;
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const fullUrl = `${url}${currentPath}`;
  
  return (
    <Helmet>
      {/* 基本 Meta 标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="AI MateX Team" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta 标签 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card Meta 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}${image}`} />
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "${siteTitle}",
            "url": "${url}",
            "description": "${description}",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "${url}/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
      </script>
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "${siteTitle}",
            "url": "${url}",
            "logo": "${url}/images/logo.png",
            "sameAs": [
              "https://twitter.com/aimatex",
              "https://facebook.com/aimatex",
              "https://linkedin.com/company/aimatex",
              "https://github.com/aimatex"
            ]
          }
        `}
      </script>
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string,
  type: PropTypes.string,
  locale: PropTypes.string,
  twitterHandle: PropTypes.string
};

export default SEO; 