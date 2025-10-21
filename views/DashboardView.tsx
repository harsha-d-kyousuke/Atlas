
import React, { useState } from 'react';
import { useMockData } from '../hooks/useMockData';
import InsightCard from '../components/InsightCard';
import AutomationTask from '../components/AutomationTask';
import TrendChart from '../components/TrendChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ChartDataPoint } from '../types';

const DashboardView: React.FC = () => {
  const { insights, automations, salesTrendData: initialSalesTrendData, updateAutomationStatus } = useMockData();
  const [salesTrendData, setSalesTrendData] = useState<ChartDataPoint[]>(initialSalesTrendData);

  const pendingAutomations = automations.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{insights.length}</div>
            <p className="text-xs text-muted-foreground">Detected across all connected sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{pendingAutomations.length}</div>
            <p className="text-xs text-muted-foreground">Actions awaiting your approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>High-Severity Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{insights.filter(i => i.severity === 'High').length}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 h-[400px]">
          <CardContent className="h-full pt-6">
            <TrendChart data={salesTrendData} setData={setSalesTrendData} title="Overall Sales Trend (YTD)"/>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Pending Actions</h2>
            {pendingAutomations.slice(0, 2).map(task => (
                <AutomationTask key={task.id} task={task} onStatusChange={updateAutomationStatus} />
            ))}
             {pendingAutomations.length === 0 && <p className="text-sm text-muted-foreground">No pending actions.</p>}
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Insights</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.slice(0, 3).map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
