
import React from 'react';
import { useMockData } from '../hooks/useMockData';
import InsightCard from '../components/InsightCard';

const InsightsView: React.FC = () => {
  const { insights } = useMockData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Insights</h1>
        <p className="text-muted-foreground">
          A complete log of all intelligence gathered from your connected workspace.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {insights.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
};

export default InsightsView;
