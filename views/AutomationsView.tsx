import React, { useState, useMemo } from 'react';
import { useMockData } from '../hooks/useMockData';
import AutomationTask from '../components/AutomationTask';
import { AutomationTask as AutomationTaskType } from '../types';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';

type FilterStatus = 'All' | AutomationTaskType['status'];
type SortOrder = 'newest' | 'oldest';

const filterOptions: FilterStatus[] = ['All', 'Pending', 'Completed', 'Approved', 'Rejected'];

const AutomationsView: React.FC = () => {
  const { automations, updateAutomationStatus } = useMockData();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [insightIdFilter, setInsightIdFilter] = useState('');

  const filteredAndSortedAutomations = useMemo(() => {
    let filtered = automations;

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Filter by Insight ID
    if (insightIdFilter.trim() !== '') {
        filtered = filtered.filter(task => 
            task.triggeringInsightId?.toLowerCase().includes(insightIdFilter.trim().toLowerCase())
        );
    }

    // Filter by date range
    if (dateRange.start) {
        const startOfDay = new Date(dateRange.start);
        startOfDay.setUTCHours(0, 0, 0, 0);
        filtered = filtered.filter(task => new Date(task.timestamp) >= startOfDay);
    }
    if (dateRange.end) {
        const endOfDay = new Date(dateRange.end);
        endOfDay.setUTCHours(23, 59, 59, 999);
        filtered = filtered.filter(task => new Date(task.timestamp) <= endOfDay);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [automations, filterStatus, sortOrder, dateRange, insightIdFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Automation History</h1>
        <p className="text-muted-foreground">
          Track and manage all automated actions proposed and executed by ATLAS.
        </p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Filter & Sort Automations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium mr-2">Status:</span>
                {filterOptions.map(status => (
                    <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    >
                    {status}
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                    <label htmlFor="insight-id-filter" className="text-sm font-medium mb-2 block">Triggering Insight ID</label>
                    <Input 
                        id="insight-id-filter"
                        placeholder="e.g., INS-001"
                        value={insightIdFilter}
                        onChange={(e) => setInsightIdFilter(e.target.value)}
                    />
                </div>
                 <div>
                    <label htmlFor="start-date" className="text-sm font-medium mb-2 block">Start Date</label>
                    <Input 
                        id="start-date"
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                </div>
                <div>
                    <label htmlFor="end-date" className="text-sm font-medium mb-2 block">End Date</label>
                    <Input 
                        id="end-date"
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        min={dateRange.start}
                    />
                </div>
                 <div>
                    <label htmlFor="sort-order" className="text-sm font-medium mb-2 block">Sort by</label>
                    <Select
                        id="sort-order"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </Select>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredAndSortedAutomations.length > 0 ? (
          filteredAndSortedAutomations.map(task => (
            <AutomationTask key={task.id} task={task} onStatusChange={updateAutomationStatus} />
          ))
        ) : (
          <div className="text-center py-10 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No automations match the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomationsView;
