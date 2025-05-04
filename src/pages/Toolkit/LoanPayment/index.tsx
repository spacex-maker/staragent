import React, { useState } from 'react';
import { Card, Form, DatePicker, Button, Table, Select, Typography, Row, Col, InputNumber, Space, Divider, Tooltip, Input } from 'antd';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs, { Dayjs } from 'dayjs';
import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// 样式组件
const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const ContentCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  overflow: hidden;
  width: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const ResultCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  margin-top: 24px;
  margin-bottom: 24px;
  background-color: var(--ant-color-primary-bg);
  overflow: hidden;
  width: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
  
  .ant-card-body {
    padding: 20px;
  }
`;

const SummaryText = styled(Text)`
  font-size: 16px;
  margin-bottom: 16px;
  display: block;
  font-weight: 500;
  
  span {
    font-weight: 600;
    color: var(--ant-color-primary);
    margin-left: 8px;
  }
`;

const IncomeItemCard = styled.div`
  border: 1px solid var(--ant-color-border);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  background-color: var(--ant-color-bg-container-disabled);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border-color: var(--ant-color-primary-border);
    transform: translateY(-2px);
    background-color: var(--ant-color-bg-container);
  }
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 12px;
  right: 12px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 14px;
  transition: all 0.3s;
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 16px;
  
  .ant-form-item-label > label {
    font-weight: 500;
    color: var(--ant-color-text-secondary);
  }
  
  .ant-input,
  .ant-picker {
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    transition: all 0.3s;
    padding: 8px 16px;
    height: 40px;
    
    &:hover, &:focus {
      border-color: var(--ant-color-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }
  }
  
  .ant-input-number {
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    transition: all 0.3s;
    height: 40px;
    display: flex;
    align-items: center;
    
    .ant-input-number-input-wrap {
      height: 100%;
      display: flex;
      align-items: center;
      
      input {
        height: 100%;
        padding: 0 16px;
        display: flex;
        align-items: center;
      }
    }
    
    .ant-input-number-handler-wrap {
      border-radius: 0 20px 20px 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .ant-input-number-handler {
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .ant-input-number-handler-up-inner,
    .ant-input-number-handler-down-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    
    &:hover, &:focus {
      border-color: var(--ant-color-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }
  }
  
  .ant-select-selector {
    border-radius: 20px !important;
    padding: 0 16px !important;
    height: 40px !important;
    
    .ant-select-selection-search {
      left: 16px;
    }
    
    .ant-select-selection-item {
      padding-left: 0;
      line-height: 38px;
    }
  }
  
  .ant-picker {
    padding: 0 16px;
    height: 40px;
    
    .ant-picker-input > input {
      height: 100%;
    }
  }
`;

const StyledDivider = styled(Divider)`
  margin: 32px 0 24px;
  
  .ant-divider-inner-text {
    font-weight: 600;
    color: var(--ant-color-primary);
    font-size: 16px;
  }
`;

const ActionButtonsWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
  
  .ant-btn {
    border-radius: 20px;
    height: 42px;
    padding: 0 20px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.09);
    }
  }
`;

const FullWidthTable = styled(Table)`
  margin-top: 24px;
  width: 100%;
  
  .ant-table-container {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .ant-table-content {
    width: 100%;
    overflow-x: auto;
  }
  
  table {
    width: 100%;
  }
  
  .ant-table-thead > tr > th {
    background-color: var(--ant-color-primary-bg);
    color: var(--ant-color-primary);
    font-weight: 600;
    font-size: 14px;
    padding: 16px;
  }
  
  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    transition: all 0.3s;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: var(--ant-color-primary-bg);
    transform: scale(1.01);
  }
  
  .ant-pagination {
    margin-top: 16px;
  }
  
  .ant-pagination-item,
  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    border-radius: 20px;
  }
  
  .ant-table-summary {
    font-weight: 600;
    
    .ant-table-cell {
      background-color: var(--ant-color-primary-bg);
      padding: 16px;
    }
  }
`;

// 接口定义
interface TableDataItem {
  key: number;
  period: number;
  date: string;
  incomeSource: string;
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

interface IncomeItem {
  id: string;
  name: string;
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'yearly' | 'once';
  amount: number;
  startDate: Dayjs;
}

interface FormValues {
  loanAmount: number;
  paymentPercentage: number;
}

// 主组件
const ToolkitLoanPayment: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm<FormValues>();
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([
    {
      id: '1',
      name: intl.formatMessage({ id: 'loanPayment.income.default' }) || '主要收入',
      frequency: 'monthly',
      amount: 0,
      startDate: dayjs()
    }
  ]);

  // 收入周期选项
  const incomeFrequencyOptions = [
    { value: 'monthly', label: intl.formatMessage({ id: 'loanPayment.frequency.monthly' }) },
    { value: 'biweekly', label: intl.formatMessage({ id: 'loanPayment.frequency.biweekly' }) },
    { value: 'weekly', label: intl.formatMessage({ id: 'loanPayment.frequency.weekly' }) },
    { value: 'yearly', label: intl.formatMessage({ id: 'loanPayment.frequency.yearly' }) },
    { value: 'once', label: intl.formatMessage({ id: 'loanPayment.frequency.once' }) }
  ];

  // 表格列配置
  const columns = [
    {
      title: intl.formatMessage({ id: 'loanPayment.table.period' }),
      dataIndex: 'period',
      key: 'period',
      width: '10%',
    },
    {
      title: intl.formatMessage({ id: 'loanPayment.table.date' }),
      dataIndex: 'date',
      key: 'date',
      width: '15%',
    },
    {
      title: intl.formatMessage({ id: 'loanPayment.table.incomeSource' }) || '收入来源',
      dataIndex: 'incomeSource',
      key: 'incomeSource',
      width: '20%',
    },
    {
      title: intl.formatMessage({ id: 'loanPayment.table.income' }),
      dataIndex: 'income',
      key: 'income',
      width: '15%',
    },
    {
      title: intl.formatMessage({ id: 'loanPayment.table.payment' }),
      dataIndex: 'payment',
      key: 'payment',
      width: '15%',
    },
    {
      title: intl.formatMessage({ id: 'loanPayment.table.remainingLoan' }),
      dataIndex: 'remainingLoan',
      key: 'remainingLoan',
      width: '25%',
    }
  ];

  // 添加新收入项
  const addIncomeItem = () => {
    const newItem: IncomeItem = {
      id: Date.now().toString(),
      name: `${intl.formatMessage({ id: 'loanPayment.income.new' }) || '收入项'} ${incomeItems.length + 1}`,
      frequency: 'monthly',
      amount: 0,
      startDate: dayjs()
    };
    
    setIncomeItems([...incomeItems, newItem]);
  };

  // 删除收入项
  const removeIncomeItem = (id: string) => {
    if (incomeItems.length <= 1) {
      return; // 至少保留一个收入项
    }
    setIncomeItems(incomeItems.filter(item => item.id !== id));
  };

  // 更新收入项
  const updateIncomeItem = (id: string, field: keyof IncomeItem, value: any) => {
    setIncomeItems(
      incomeItems.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // 计算还款计划
  const calculatePaymentSchedule = () => {
    setLoading(true);
    
    const values = form.getFieldsValue();
    const { loanAmount, paymentPercentage = 50 } = values;
    
    // 将还款比例转换为小数
    const paymentRatio = paymentPercentage / 100;
    
    // 初始化变量
    let remainingLoan = loanAmount;
    let period = 1;
    const schedule: TableDataItem[] = [];
    
    // 创建收入项的下一次收入日期映射
    const incomeNextDates = incomeItems.reduce((acc, item) => {
      acc[item.id] = {
        date: item.startDate,
        name: item.name,
        frequency: item.frequency,
        amount: item.amount,
        processed: item.frequency === 'once' ? false : undefined // 标记单次收入是否已处理
      };
      return acc;
    }, {} as Record<string, { date: Dayjs, name: string, frequency: string, amount: number, processed?: boolean }>);
    
    // 计算最远的结束日期（默认30年）
    const endDate = dayjs().add(30, 'year');
    
    while (remainingLoan > 0) {
      // 找出最近的收入日期
      let nextIncomeDate: Dayjs | null = null;
      let nextIncomeId: string | null = null;
      
      for (const [id, data] of Object.entries(incomeNextDates)) {
        // 如果是单次收入且已经处理过，则跳过
        if (data.frequency === 'once' && data.processed) {
          continue;
        }
        
        if (!nextIncomeDate || data.date.isBefore(nextIncomeDate)) {
          nextIncomeDate = data.date;
          nextIncomeId = id;
        }
      }
      
      if (!nextIncomeDate || !nextIncomeId || nextIncomeDate.isAfter(endDate)) {
        break;
      }
      
      // 获取当前收入项的数据
      const currentIncome = incomeNextDates[nextIncomeId];
      
      // 计算该收入的还款金额
      const payment = Math.min(currentIncome.amount * paymentRatio, remainingLoan);
      
      // 更新剩余贷款金额
      remainingLoan = Math.max(0, remainingLoan - payment);
      
      // 添加到还款计划
      schedule.push({
        key: period,
        period,
        date: nextIncomeDate.format('YYYY-MM-DD'),
        incomeSource: currentIncome.name,
        income: currentIncome.amount.toFixed(2),
        payment: payment.toFixed(2),
        remainingLoan: remainingLoan.toFixed(2)
      });
      
      // 更新该收入项的下一次收入日期
      if (currentIncome.frequency === 'once') {
        // 单次收入标记为已处理
        incomeNextDates[nextIncomeId].processed = true;
      } else {
        let incrementUnit: 'month' | 'week' | 'year' = 'month';
        let incrementValue = 1;
        
        if (currentIncome.frequency === 'biweekly') {
          incrementUnit = 'week';
          incrementValue = 2;
        } else if (currentIncome.frequency === 'weekly') {
          incrementUnit = 'week';
          incrementValue = 1;
        } else if (currentIncome.frequency === 'yearly') {
          incrementUnit = 'year';
          incrementValue = 1;
        }
        
        incomeNextDates[nextIncomeId].date = nextIncomeDate.add(incrementValue, incrementUnit);
      }
      
      // 递增期数
      period++;
      
      // 防止无限循环
      if (period > 1000) {
        break;
      }
      
      // 检查是否所有的单次收入都已处理完，且没有周期性收入
      const hasUnprocessedIncome = Object.values(incomeNextDates).some(data => 
        data.frequency !== 'once' || (data.frequency === 'once' && !data.processed)
      );
      
      if (!hasUnprocessedIncome) {
        break; // 如果所有收入都已处理完毕，结束循环
      }
    }
    
    setTableData(schedule);
    
    // 计算摘要数据
    if (schedule.length > 0) {
      const totalPaid = schedule.reduce((sum, item) => sum + parseFloat(item.payment), 0);
      const payoffDate = schedule[schedule.length - 1].date;
      const totalPeriods = schedule.length;
      
      // 计算还款月数
      const firstPayDate = dayjs(schedule[0].date);
      const lastPayDate = dayjs(payoffDate);
      const monthsDiff = lastPayDate.diff(firstPayDate, 'month', true);
      
      setSummaryData({
        totalPaid,
        payoffDate,
        totalPeriods,
        monthsToPayoff: Math.ceil(monthsDiff)
      });
    }
    
    setLoading(false);
  };

  return (
    <ContentWrapper>
      <ContentCard>
        <StyledCard>
          <Form 
            form={form}
            layout="vertical"
            onFinish={calculatePaymentSchedule}
            initialValues={{
              paymentPercentage: 50,
            }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <StyledFormItem
                  name="loanAmount"
                  label={<FormattedMessage id="loanPayment.form.loanAmount" />}
                  rules={[
                    { required: true, message: intl.formatMessage({ id: 'loanPayment.form.loanAmount.required' }) },
                    { type: 'number', min: 1, message: intl.formatMessage({ id: 'loanPayment.form.loanAmount.min' }) }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%', height: '40px' }}
                    placeholder={intl.formatMessage({ id: 'loanPayment.form.loanAmount.placeholder' })}
                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value ? parseFloat(value.replace(/[^\d.]/g, '')) : undefined}
                  />
                </StyledFormItem>
              </Col>
              
              <Col xs={24} md={12}>
                <StyledFormItem
                  name="paymentPercentage"
                  label={
                    <span>
                      <FormattedMessage id="loanPayment.form.paymentPercentage" />
                      <Tooltip title={intl.formatMessage({ id: 'loanPayment.form.paymentPercentage.tooltip' })}>
                        <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </span>
                  }
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
                    formatter={(value) => `${value}%`}
                    parser={(value) => {
                      if (!value) return 0;
                      const parsedValue = parseFloat(value.replace('%', ''));
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                  />
                </StyledFormItem>
              </Col>
            </Row>
            
            <StyledDivider>
              <FormattedMessage id="loanPayment.incomeItems.title" defaultMessage="收入项目" />
            </StyledDivider>
            
            {incomeItems.map((item) => (
              <IncomeItemCard key={item.id}>
                {incomeItems.length > 1 && (
                  <DeleteButton 
                    type="text" 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeIncomeItem(item.id)}
                    danger
                  />
                )}
                
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <StyledFormItem
                      label={intl.formatMessage({ id: 'loanPayment.income.name' }) || '收入名称'}
                    >
                      <Input
                        style={{ width: '100%' }}
                        value={item.name}
                        onChange={(e) => updateIncomeItem(item.id, 'name', e.target.value)}
                        placeholder={intl.formatMessage({ id: 'loanPayment.income.name.placeholder' }) || '请输入收入名称'}
                      />
                    </StyledFormItem>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <StyledFormItem
                      label={intl.formatMessage({ id: 'loanPayment.form.firstPayDate' })}
                    >
                      <DatePicker 
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        value={item.startDate}
                        onChange={(date) => updateIncomeItem(item.id, 'startDate', date)}
                        placeholder={intl.formatMessage({ id: 'loanPayment.form.firstPayDate.placeholder' })}
                      />
                    </StyledFormItem>
                  </Col>
                </Row>
                
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <StyledFormItem
                      label={intl.formatMessage({ id: 'loanPayment.form.incomeFrequency' })}
                    >
                      <Select 
                        value={item.frequency}
                        onChange={(value) => updateIncomeItem(item.id, 'frequency', value)}
                        placeholder={intl.formatMessage({ id: 'loanPayment.form.incomeFrequency.placeholder' })}
                      >
                        {incomeFrequencyOptions.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                            {option.value === 'once' && (
                              <Tooltip title={intl.formatMessage({ id: 'loanPayment.frequency.once.tooltip' })}>
                                <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                              </Tooltip>
                            )}
                          </Option>
                        ))}
                      </Select>
                    </StyledFormItem>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <StyledFormItem
                      label={intl.formatMessage({ id: 'loanPayment.form.incomeAmount' })}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        value={item.amount}
                        onChange={(value) => updateIncomeItem(item.id, 'amount', value || 0)}
                        placeholder={intl.formatMessage({ id: 'loanPayment.form.incomeAmount.placeholder' })}
                        formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value ? parseFloat(value.replace(/[^\d.]/g, '')) : undefined}
                      />
                    </StyledFormItem>
                  </Col>
                </Row>
              </IncomeItemCard>
            ))}
            
            <ActionButtonsWrapper>
              <Button 
                type="dashed" 
                onClick={addIncomeItem} 
                icon={<PlusOutlined />}
                style={{ flex: 1 }}
              >
                <FormattedMessage id="loanPayment.incomeItems.add" defaultMessage="添加收入项目" />
              </Button>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                style={{ flex: 1 }}
              >
                <FormattedMessage id="loanPayment.form.submit" />
              </Button>
            </ActionButtonsWrapper>
          </Form>
        </StyledCard>
        
        {summaryData && (
          <ResultCard>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <SummaryText>
                  <FormattedMessage id="loanPayment.result.payoffDate" />:
                  <span>{summaryData.payoffDate}</span>
                </SummaryText>
                <SummaryText>
                  <FormattedMessage id="loanPayment.result.totalPeriods" />:
                  <span>{summaryData.totalPeriods}</span>
                </SummaryText>
              </Col>
              <Col xs={24} md={12}>
                <SummaryText>
                  <FormattedMessage id="loanPayment.result.totalPaid" />:
                  <span>¥{summaryData.totalPaid.toFixed(2)}</span>
                </SummaryText>
                <SummaryText>
                  <FormattedMessage id="loanPayment.result.monthsToPayoff" />:
                  <span>{summaryData.monthsToPayoff} <FormattedMessage id="loanPayment.result.months" /></span>
                </SummaryText>
              </Col>
            </Row>
          </ResultCard>
        )}
        
        {tableData.length > 0 && (
          <FullWidthTable 
            columns={columns} 
            dataSource={tableData} 
            pagination={{ pageSize: 10 }}
            scroll={{ x: '100%' }}
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}><strong><FormattedMessage id="loanPayment.table.summary" /></strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <strong>¥{tableData.reduce((sum, item) => sum + parseFloat(item.income), 0).toFixed(2)}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <strong>¥{tableData.reduce((sum, item) => sum + parseFloat(item.payment), 0).toFixed(2)}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}></Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        )}
      </ContentCard>
    </ContentWrapper>
  );
};

export default ToolkitLoanPayment; 