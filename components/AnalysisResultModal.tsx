
import React from 'react';
import { AnalysisResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { InsightIcon, AutomationIcon } from './icons';

interface AnalysisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AnalysisResult | null;
  dataSourceName: string;
  onAddInsight: (insight: AnalysisResult['insights'][0], source: string) => void;
  onAddAutomation: (suggestion: AnalysisResult['suggestions'][0]) => void;
}

const severityMap: Record<AnalysisResult['insights'][0]['severity'], 'destructive' | 'warning' | 'success'> = {
  High: 'destructive',
  Medium: 'warning',
  Low: 'success',
};

const AnalysisResultModal: React.FC<AnalysisResultModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
  dataSourceName,
  onAddInsight,
  onAddAutomation,
}) => {
  if (!isOpen || !analysisResult) return null;

  const handleAddAllInsights = () => {
    analysisResult.insights.forEach(insight => onAddInsight(insight, dataSourceName));
  };

  const handleAddAllAutomations = () => {
    analysisResult.suggestions.forEach(suggestion => onAddAutomation(suggestion));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-card rounded-lg border border-border shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <CardHeader className="border-b border-border">
          <CardTitle>ATLAS Analysis: {dataSourceName}</CardTitle>
          <CardDescription>{analysisResult.summary}</CardDescription>
        </CardHeader>
        <CardContent className="py-6 space-y-6 overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Key Insights</h3>
              <Button size="sm" variant="secondary" onClick={handleAddAllInsights}>Add All Insights</Button>
            </div>
            <div className="space-y-3">
              {analysisResult.insights.map((insight, index) => (
                <div key={index} className="p-4 rounded-md border border-border bg-background/50 flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <InsightIcon className="w-4 h-4 text-primary" />
                        <p className="font-semibold">{insight.title}</p>
                        <Badge variant={severityMap[insight.severity]}>{insight.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.summary}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onAddInsight(insight, dataSourceName)}>Add to Insights</Button>
                </div>
              ))}
            </div>
          </div>
           <div>
            <h3 className="text-lg font-semibold mb-3">Discovered Correlations</h3>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              {analysisResult.correlations.map((corr, index) => (
                <li key={index} className="text-sm">{corr.description}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Suggested Automations</h3>
                <Button size="sm" variant="secondary" onClick={handleAddAllAutomations}>Add All Automations</Button>
            </div>
             <div className="space-y-3">
              {analysisResult.suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 rounded-md border border-border bg-background/50 flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <AutomationIcon className="w-4 h-4 text-primary" />
                        <p className="font-semibold">{suggestion.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onAddAutomation(suggestion)}>Create Task</Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border">
          <Button onClick={onClose} className="ml-auto">Close</Button>
        </CardFooter>
      </div>
    </div>
  );
};

export default AnalysisResultModal;
