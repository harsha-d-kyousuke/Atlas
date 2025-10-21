
import React from 'react';
import { Insight } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import Badge from './ui/Badge';
import { InsightIcon } from './icons';

interface InsightCardProps {
  insight: Insight;
}

const severityMap: Record<Insight['severity'], 'destructive' | 'warning' | 'success'> = {
  High: 'destructive',
  Medium: 'warning',
  Low: 'success',
};

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };
    
  return (
    <Card className="hover:border-primary transition-colors flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-base mb-1">{insight.title}</CardTitle>
                <CardDescription>{timeAgo(insight.timestamp)} from {insight.source}</CardDescription>
            </div>
            <Badge variant={severityMap[insight.severity]}>{insight.severity}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{insight.summary}</p>
        {insight.explanation && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <h4 className="text-xs font-semibold text-foreground mb-1">Rationale</h4>
            <p className="text-xs text-muted-foreground">{insight.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightCard;
