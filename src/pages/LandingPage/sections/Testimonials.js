import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';
import { 
  Section, 
  SectionContainer, 
  SectionTitle, 
  SectionSubtitle,
  TestimonialCard,
  GradientBackground
} from '../styles';
import styled from 'styled-components';

// Additional styled components
const TestimonialsContainer = styled.div`
  position: relative;
  margin-top: 4rem;
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialQuote = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: var(--ant-color-text);
  margin-bottom: 1.5rem;
  position: relative;
  font-style: italic;
  
  &::before, &::after {
    content: '"';
    font-size: 2rem;
    color: var(--ant-color-primary);
    font-family: serif;
    position: absolute;
    opacity: 0.3;
  }
  
  &::before {
    left: -1rem;
    top: -0.5rem;
  }
  
  &::after {
    right: -1rem;
    bottom: -1.5rem;
  }
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: var(--ant-color-text);
`;

const AuthorRole = styled.div`
  font-size: 0.875rem;
  color: var(--ant-color-text-secondary);
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #f59e0b;
`;

const TestimonialHeader = styled.div`
  margin-bottom: 2rem;
`;

const Testimonials = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Star icon component
  const StarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      quote: "AI MateX 彻底改变了我的工作方式。现在我有一个专业的 AI 团队，根据不同任务自动调用不同的专业 AI，效率提升了200%。",
      author: {
        name: "李明",
        role: "营销总监",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      },
      rating: 5
    },
    {
      id: 2,
      quote: "作为一名开发者，我训练并出售了几个专业的编程辅助 AI 角色，不仅帮助了全球的开发者，还为我创造了可观的收入。",
      author: {
        name: "王静",
        role: "软件工程师",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      },
      rating: 5
    },
    {
      id: 3,
      quote: "AI MateX 让我能同时使用多种 AI 模型，每个模型都有其独特优势。我的研究团队现在使用定制 AI 角色分析复杂数据，效果惊人。",
      author: {
        name: "张伟",
        role: "数据科学家",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      },
      rating: 5
    }
  ];

  return (
    <Section>
      <GradientBackground />
      <SectionContainer>
        <TestimonialHeader>
          <Row justify="center" style={{ textAlign: 'center' }}>
            <Col xs={24} md={16}>
              <SectionTitle>
                <FormattedMessage id="landing.testimonials.title" defaultMessage="用户喜爱的 AI 团队平台" />
              </SectionTitle>
              <SectionSubtitle style={{ margin: '0 auto' }}>
                <FormattedMessage 
                  id="landing.testimonials.subtitle" 
                  defaultMessage="看看全球各行各业的专业人士如何使用 AI MateX 提升工作效率和创造力" 
                />
              </SectionSubtitle>
            </Col>
          </Row>
        </TestimonialHeader>
        
        <TestimonialsContainer>
          <TestimonialGrid as={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} as={motion.div} variants={itemVariants}>
                <StarRating>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </StarRating>
                <TestimonialQuote>{testimonial.quote}</TestimonialQuote>
                <TestimonialAuthor>
                  <AuthorAvatar>
                    <img src={testimonial.author.avatar} alt={testimonial.author.name} />
                  </AuthorAvatar>
                  <AuthorInfo>
                    <AuthorName>{testimonial.author.name}</AuthorName>
                    <AuthorRole>{testimonial.author.role}</AuthorRole>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialGrid>
        </TestimonialsContainer>
      </SectionContainer>
    </Section>
  );
};

export default Testimonials; 