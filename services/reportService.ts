import { Insight } from '../types';

const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportInsightsToCSV = (insights: Insight[]) => {
    if (insights.length === 0) {
        alert("No insights available to export.");
        return;
    }

    const headers = ['ID', 'Title', 'Summary', 'Severity', 'Timestamp', 'Source', 'Explanation'];
    const rows = insights.map(insight => 
        [
            `"${insight.id}"`,
            `"${insight.title.replace(/"/g, '""')}"`,
            `"${insight.summary.replace(/"/g, '""')}"`,
            `"${insight.severity}"`,
            `"${insight.timestamp}"`,
            `"${insight.source}"`,
            `"${(insight.explanation || '').replace(/"/g, '""')}"`,
        ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const fileName = `ATLAS_Insights_Report_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
};

export const exportInsightsToJSON = (insights: Insight[]) => {
    if (insights.length === 0) {
        alert("No insights available to export.");
        return;
    }

    const jsonContent = JSON.stringify(insights, null, 2);
    const fileName = `ATLAS_Insights_Report_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(jsonContent, fileName, 'application/json;charset=utf-8;');
};