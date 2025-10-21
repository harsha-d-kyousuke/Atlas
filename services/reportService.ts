import { ReportData } from '../types';

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

const escapeCsvCell = (cellData: string | number | undefined) => {
    const stringData = String(cellData || '');
    if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
        return `"${stringData.replace(/"/g, '""')}"`;
    }
    return stringData;
};

export const exportReportToCSV = (reportData: ReportData) => {
    if (reportData.insights.length === 0 && reportData.salesTrend.length === 0) {
        alert("No data available to export.");
        return;
    }

    let csvContent = '';

    // Section 1: Key Metrics
    csvContent += 'Key Metric,Value\n';
    csvContent += `Total Insights,${reportData.keyMetrics.totalInsights}\n`;
    csvContent += `Pending Automations,${reportData.keyMetrics.pendingAutomations}\n`;
    csvContent += `High-Severity Alerts,${reportData.keyMetrics.highSeverityAlerts}\n`;
    csvContent += '\n'; // Spacer

    // Section 2: Sales Trend Data
    csvContent += 'Sales Trend\n';
    csvContent += 'Month,Value,Type\n';
    reportData.salesTrend.forEach(row => {
        csvContent += `${row.name},${row.value},${row.isForecast ? 'Forecast' : 'Actual'}\n`;
    });
    csvContent += '\n'; // Spacer

    // Section 3: Detailed Insights
    csvContent += 'Detailed Insights\n';
    const headers = ['ID', 'Title', 'Summary', 'Severity', 'Timestamp', 'Source', 'Explanation'];
    const insightRows = reportData.insights.map(insight => 
        [
            escapeCsvCell(insight.id),
            escapeCsvCell(insight.title),
            escapeCsvCell(insight.summary),
            escapeCsvCell(insight.severity),
            escapeCsvCell(insight.timestamp),
            escapeCsvCell(insight.source),
            escapeCsvCell(insight.explanation),
        ].join(',')
    );
    csvContent += headers.join(',') + '\n';
    csvContent += insightRows.join('\n');

    const fileName = `ATLAS_Report_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
};

export const exportReportToJSON = (reportData: ReportData) => {
     if (reportData.insights.length === 0 && reportData.salesTrend.length === 0) {
        alert("No data available to export.");
        return;
    }

    const jsonContent = JSON.stringify(reportData, null, 2);
    const fileName = `ATLAS_Report_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(jsonContent, fileName, 'application/json;charset=utf-8;');
};