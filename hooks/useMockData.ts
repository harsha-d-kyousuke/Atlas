import { useState } from 'react';
import { Insight, AutomationTask, DataSource, AnalysisResult, ChartDataPoint, Report } from '../types';

const initialInsights: Insight[] = [
  {
    id: 'INS-001',
    title: 'Q3 Sales Drop in EMEA',
    summary: 'Sales in the EMEA region have dropped by 18% quarter-over-quarter, primarily driven by a slowdown in the manufacturing sector.',
    severity: 'High',
    timestamp: '2023-10-26T10:00:00Z',
    source: 'Salesforce CRM',
    explanation: 'Correlation analysis shows a strong negative relationship between manufacturing output in Germany and our sales figures for the same period.',
    chartData: [
      { name: 'Week 1', value: 45000 },
      { name: 'Week 2', value: 42000 },
      { name: 'Week 3', value: 44000 },
      { name: 'Week 4', value: 38000 },
      { name: 'Week 5', value: 35000 },
    ],
  },
  {
    id: 'INS-002',
    title: 'Increased Customer Churn Rate',
    summary: 'Monthly customer churn rate increased by 5% in September, correlated with a recent pricing model update.',
    severity: 'High',
    timestamp: '2023-10-25T14:30:00Z',
    source: 'Stripe Billings',
    explanation: 'A cohort analysis of customers who churned in September reveals 78% were on the new pricing plan introduced in August.',
  },
  {
    id: 'INS-003',
    title: 'Positive Sentiment on New Feature',
    summary: 'User feedback sentiment for the new "Project Templates" feature is 92% positive across Intercom and Twitter channels.',
    severity: 'Low',
    timestamp: '2023-10-25T09:15:00Z',
    source: 'Intercom Feed',
    explanation: 'Natural Language Processing of 500+ comments shows dominant keywords like "love", "easy", and "time-saver".',
  },
  {
    id: 'INS-004',
    title: 'Jira Ticket Resolution Time Spike',
    summary: 'Average resolution time for P1 tickets in the "Frontend" project spiked by 4 hours over the last 7 days.',
    severity: 'Medium',
    timestamp: '2023-10-24T11:00:00Z',
    source: 'Jira',
    explanation: 'This spike coincides with the deployment of version 3.2.1 and an increase in bug reports mentioning "UI lag".',
  },
];

const initialAutomations: AutomationTask[] = [
  {
    id: 'AUT-001',
    title: 'Draft Q3 Sales Report for EMEA',
    description: 'Based on INS-001, generate a Google Doc summarizing the sales drop and schedule a meeting with regional leads.',
    status: 'Pending',
    triggeringInsightId: 'INS-001',
    timestamp: '2023-10-26T10:05:00Z',
  },
  {
    id: 'AUT-002',
    title: 'Notify Product Team about Churn',
    description: 'Create a high-priority Jira ticket for the Product team to investigate the correlation between churn and pricing changes (INS-002).',
    status: 'Pending',
    triggeringInsightId: 'INS-002',
    timestamp: '2023-10-25T14:35:00Z',
  },
  {
    id: 'AUT-003',
    title: 'Share Positive Feedback on Slack',
    description: 'Post a summary of the positive user feedback for "Project Templates" (INS-003) to the #product-updates Slack channel.',
    status: 'Completed',
    triggeringInsightId: 'INS-003',
    timestamp: '2023-10-25T09:20:00Z',
  },
];

const initialDataSources: DataSource[] = [
    {
        id: 'DS-001',
        name: 'Q3_Sales_EMEA.csv',
        type: 'CSV',
        timestamp: '2023-10-26T09:30:00Z',
        status: 'Ingested',
    },
    {
        id: 'DS-002',
        name: 'Customer_Feedback_Sept.json',
        type: 'JSON',
        timestamp: '2023-10-25T08:00:00Z',
        status: 'Ingested',
    },
     {
        id: 'DS-003',
        name: 'Project_Phoenix_Brief.pdf',
        type: 'PDF',
        timestamp: '2023-10-24T15:00:00Z',
        status: 'Error',
    },
];

const initialReports: Report[] = [
    {
        id: 'REP-001',
        title: 'Weekly Summary: Oct 16-22, 2023',
        timestamp: '2023-10-23T09:00:00Z',
        format: 'Weekly',
    },
    {
        id: 'REP-002',
        title: 'Weekly Summary: Oct 9-15, 2023',
        timestamp: '2023-10-16T09:00:00Z',
        format: 'Weekly',
    },
    {
        id: 'REP-003',
        title: 'Monthly Summary: September 2023',
        timestamp: '2023-10-01T09:00:00Z',
        format: 'Monthly',
    },
];

export const useMockData = () => {
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [automations, setAutomations] = useState<AutomationTask[]>(initialAutomations);
  const [dataSources, setDataSources] = useState<DataSource[]>(initialDataSources);
  const [reports, setReports] = useState<Report[]>(initialReports);

  const updateAutomationStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setAutomations(prev =>
      prev.map(task => (task.id === id ? { ...task, status } : task))
    );
  };

  const addDataSource = (file: File, name: string) => {
    const fileType = file.name.split('.').pop()?.toUpperCase();
    const supportedTypes: Array<'CSV' | 'JSON' | 'PDF'> = ['CSV', 'JSON', 'PDF'];
    const type: DataSource['type'] = supportedTypes.find(t => t === fileType) || 'UNKNOWN';

    const newSource: DataSource = {
      id: `DS-${Date.now()}`,
      name: name || file.name,
      type: type,
      timestamp: new Date().toISOString(),
      status: 'Processing',
    };
    setDataSources(prev => [newSource, ...prev]);

    setTimeout(() => {
      setDataSources(prev =>
        prev.map(ds =>
          ds.id === newSource.id
            ? { ...ds, status: type === 'UNKNOWN' ? 'Error' : 'Ingested' }
            : ds
        )
      );
    }, 2000 + Math.random() * 1000);
  };
  
  const deleteDataSource = (id: string) => {
      setDataSources(prev => prev.filter(ds => ds.id !== id));
  };

  const addInsight = (insight: AnalysisResult['insights'][0], source: string) => {
    const newInsight: Insight = {
        id: `INS-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: source,
        ...insight,
    };
    setInsights(prev => [newInsight, ...prev]);
    };

    const addAutomation = (suggestion: AnalysisResult['suggestions'][0], triggeringInsightId?: string) => {
        const newAutomation: AutomationTask = {
            id: `AUT-${Date.now()}`,
            title: suggestion.title,
            description: suggestion.description,
            status: 'Pending',
            triggeringInsightId: triggeringInsightId,
            timestamp: new Date().toISOString(),
        };
        setAutomations(prev => [newAutomation, ...prev]);
    };

  const salesTrendData: ChartDataPoint[] = [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 500 },
      { name: 'Jun', value: 700 },
      { name: 'Jul', value: 900 },
      { name: 'Aug', value: 850 },
      { name: 'Sep', value: 650 },
  ];

  return { insights, automations, salesTrendData, updateAutomationStatus, dataSources, addDataSource, deleteDataSource, addInsight, addAutomation, reports };
};