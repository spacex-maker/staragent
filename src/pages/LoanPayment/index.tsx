import React, { useState } from 'react';
import { Card, Form, DatePicker, Button, Table, Select, Typography, Row, Col, InputNumber } from 'antd';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const ResultCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: 24px;
  background-color: var(--ant-color-primary-bg);
`;

const SummaryText = styled(Text)`
  font-size: 16px;
  margin-bottom: 8px;
  display: block;
`;

interface TableDataItem {
  key: number;
  period: number;
  date: string;
  income: string;
  payment: string;
  remainingLoan: string;
}

interface SummaryData {
  totalPaid: number;
  payoffDate: string;
  totalPeriods: number;
  monthsToPayoff: number;
}

interface FormValues {
  loanAmount: number;
  incomeFrequency: 'monthly' | 'biweekly' | 'weekly';
  incomeAmount: number;
  firstPayDate: Dayjs;
  paymentPercentage: number;
}

const LoanPaymentSchedule: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm<FormValues>();
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 检查当前路径是否为工具箱路径
  const location = window.location.pathname;
  const isInToolkit = location.includes('/toolkit/');

  // 收入周期选项
  const incomeFrequencyOptions = [
    { value: 'monthly', label: intl.formatMessage({ id: 'loanPayment.frequency.monthly' }) },
    { value: 'biweekly', label: intl.formatMessage({ id: 'loanPayment.frequency.biweekly' }) },
    { value: 'weekly', label: intl.formatMessage({ id: 'loanPayment.frequency.weekly' }) }
  ];

  // 表格列配置
  const columns = [
    {
      title: intl.formatMessage({ id: 'loanPayment.table.period' }),
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: intl.formatMessage({ id: 'loanPayment.table.date' }),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: intl.formatMessage({ id: 'loanPayment.table.income' }),
      dataIndex: 'income',
      key: 'income',
    },
    {
      title: intl.formatMessage({ id: 'loanPayment.table.payment' }),
      dataIndex: 'payment',
      key: 'payment',
    },
    {
      title: intl.formatMessage({ id: 'loanPayment.table.remainingLoan' }),
      dataIndex: 'remainingLoan',
      key: 'remainingLoan',
    }
  ];

  // 计算还款计划
  const calculatePaymentSchedule = (values: FormValues) => {
    setLoading(true);
    
    const { loanAmount, incomeFrequency, incomeAmount, firstPayDate, paymentPercentage = 50 } = values;
    
    // 将还款比例转换为小数
    const paymentRatio = paymentPercentage / 100;
    
    let remainingLoan = loanAmount;
    let currentDate = firstPayDate;
    let period = 1;
    const schedule: TableDataItem[] = [];
    
    // 根据收入频率设置日期增量单位和值
    let incrementUnit: 'month' | 'week' = 'month';
    let incrementValue = 1;
    
    if (incomeFrequency === 'biweekly') {
      incrementUnit = 'week';
      incrementValue = 2;
    } else if (incomeFrequency === 'weekly') {
      incrementUnit = 'week';
      incrementValue = 1;
    }
    
    while (remainingLoan > 0) {
      // 本期收入金额
      const income = incomeAmount;
      
      // 计算本期还款金额（收入的一定比例，但不超过剩余贷款金额）
      const payment = Math.min(income * paymentRatio, remainingLoan);
      
      // 计算剩余贷款
      remainingLoan = Math.max(0, remainingLoan - payment);
      
      // 添加到还款计划
      schedule.push({
        key: period,
        period,
        date: currentDate.format('YYYY-MM-DD'),
        income: income.toFixed(2),
        payment: payment.toFixed(2),
        remainingLoan: remainingLoan.toFixed(2)
      });
      
      // 增加日期
      currentDate = currentDate.add(incrementValue, incrementUnit);
      period++;
      
      // 防止无限循环（最多计算10年还款计划）
      if (period > 500) {
        break;
      }
    }
    
    setTableData(schedule);
    
    // 计算摘要数据
    const totalPaid = schedule.reduce((sum, item) => sum + parseFloat(item.payment), 0);
    const payoffDate = schedule[schedule.length - 1].date;
    const totalPeriods = schedule.length;
    
    setSummaryData({
      totalPaid,
      payoffDate,
      totalPeriods,
      monthsToPayoff: Math.ceil(totalPeriods * (incomeFrequency === 'monthly' ? 1 : incomeFrequency === 'biweekly' ? 0.5 : 0.25))
    });
    
    setLoading(false);
  };
  
  const onFinish = (values: FormValues) => {
    calculatePaymentSchedule(values);
  };

  return (
    <PageContainer style={{ padding: isInToolkit ? 0 : '24px auto' }}>
      {!isInToolkit && (
        <Helmet>
          <title>{intl.formatMessage({ id: 'loanPayment.page.title' })}</title>
          <meta name="description" content={intl.formatMessage({ id: 'loanPayment.page.description' })} />
        </Helmet>
      )}
      
      {!isInToolkit && (
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          <FormattedMessage id="loanPayment.title" />
        </Title>
      )}
      
      <StyledCard>
        <Form 
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            paymentPercentage: 50,
            incomeFrequency: 'monthly'
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="loanAmount"
                label={<FormattedMessage id="loanPayment.form.loanAmount" />}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'loanPayment.form.loanAmount.required' }) },
                  { type: 'number', min: 1, message: intl.formatMessage({ id: 'loanPayment.form.loanAmount.min' }) }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({ id: 'loanPayment.form.loanAmount.placeholder' })}
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  onChange={value => {
                    if (value === null) {
                      form.setFieldsValue({ loanAmount: 0 });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="firstPayDate"
                label={<FormattedMessage id="loanPayment.form.firstPayDate" />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'loanPayment.form.firstPayDate.required' }) }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  placeholder={intl.formatMessage({ id: 'loanPayment.form.firstPayDate.placeholder' })}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="incomeFrequency"
                label={<FormattedMessage id="loanPayment.form.incomeFrequency" />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'loanPayment.form.incomeFrequency.required' }) }]}
              >
                <Select placeholder={intl.formatMessage({ id: 'loanPayment.form.incomeFrequency.placeholder' })}>
                  {incomeFrequencyOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="incomeAmount"
                label={<FormattedMessage id="loanPayment.form.incomeAmount" />}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'loanPayment.form.incomeAmount.required' }) },
                  { type: 'number', min: 1, message: intl.formatMessage({ id: 'loanPayment.form.incomeAmount.min' }) }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({ id: 'loanPayment.form.incomeAmount.placeholder' })}
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  onChange={value => {
                    if (value === null) {
                      form.setFieldsValue({ incomeAmount: 0 });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="paymentPercentage"
                label={<FormattedMessage id="loanPayment.form.paymentPercentage" />}
                tooltip={intl.formatMessage({ id: 'loanPayment.form.paymentPercentage.tooltip' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'loanPayment.form.paymentPercentage.required' }) },
                  { 
                    type: 'number', 
                    min: 1, 
                    max: 100, 
                    message: intl.formatMessage({ id: 'loanPayment.form.paymentPercentage.range' }) 
                  }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={100}
                  formatter={value => `${value}%`}
                  onChange={value => {
                    if (value === null) {
                      form.setFieldsValue({ paymentPercentage: 50 });
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              <FormattedMessage id="loanPayment.form.submit" />
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
      
      {summaryData && (
        <ResultCard>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <SummaryText strong><FormattedMessage id="loanPayment.result.payoffDate" />: {summaryData.payoffDate}</SummaryText>
              <SummaryText strong><FormattedMessage id="loanPayment.result.totalPeriods" />: {summaryData.totalPeriods}</SummaryText>
            </Col>
            <Col xs={24} md={12}>
              <SummaryText strong><FormattedMessage id="loanPayment.result.totalPaid" />: ¥{summaryData.totalPaid.toFixed(2)}</SummaryText>
              <SummaryText strong><FormattedMessage id="loanPayment.result.monthsToPayoff" />: {summaryData.monthsToPayoff} <FormattedMessage id="loanPayment.result.months" /></SummaryText>
            </Col>
          </Row>
        </ResultCard>
      )}
      
      {tableData.length > 0 && (
        <Table 
          columns={columns} 
          dataSource={tableData} 
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          style={{ marginTop: 24 }}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}><strong><FormattedMessage id="loanPayment.table.summary" /></strong></Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <strong>¥{tableData.reduce((sum, item) => sum + parseFloat(item.income), 0).toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <strong>¥{tableData.reduce((sum, item) => sum + parseFloat(item.payment), 0).toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      )}
    </PageContainer>
  );
};

export default LoanPaymentSchedule; 