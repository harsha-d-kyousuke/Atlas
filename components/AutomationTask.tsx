
import React from 'react';
import { AutomationTask as AutomationTaskType } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface AutomationTaskProps {
  task: AutomationTaskType;
  onStatusChange: (id: string, status: 'Approved' | 'Rejected') => void;
}

const statusMap: Record<AutomationTaskType['status'], 'default' | 'success' | 'destructive' | 'secondary'> = {
    Pending: 'default',
    Approved: 'success',
    Rejected: 'destructive',
    Completed: 'secondary',
};

const AutomationTask: React.FC<AutomationTaskProps> = ({ task, onStatusChange }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-base">{task.title}</CardTitle>
            <Badge variant={statusMap[task.status]}>{task.status}</Badge>
        </div>
        <CardDescription>Triggered by Insight: {task.triggeringInsightId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </CardContent>
      {task.status === 'Pending' && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onStatusChange(task.id, 'Rejected')}>
            Reject
          </Button>
          <Button variant="default" size="sm" onClick={() => onStatusChange(task.id, 'Approved')}>
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AutomationTask;
