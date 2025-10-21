export interface ChartDataPoint {
  name: string;
  value: number;
  isForecast?: boolean;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
  chartData?: ChartDataPoint[];
  source: string;
  explanation?: string;
}

export interface AutomationTask {
  id:string;
  title: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  triggeringInsightId?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'CSV' | 'JSON' | 'PDF' | 'UNKNOWN';
  timestamp: string;
  status: 'Ingested' | 'Processing' | 'Error';
}

export interface Report {
    id: string;
    title: string;
    timestamp: string;
    format: 'Weekly' | 'Monthly';
}

export type ViewType = 'dashboard' | 'insights' | 'automations' | 'chat' | 'datasources' | 'reports';

export interface AnalysisResult {
    summary: string;
    insights: {
        title: string;
        summary: string;
        severity: 'High' | 'Medium' | 'Low';
        explanation: string;
    }[];
    correlations: {
        description: string;
    }[];
    suggestions: {
        title: string;
        description: string;
    }[];
}

export interface ReportData {
    keyMetrics: {
        totalInsights: number;
        pendingAutomations: number;
        highSeverityAlerts: number;
    };
    salesTrend: ChartDataPoint[];
    insights: Insight[];
}