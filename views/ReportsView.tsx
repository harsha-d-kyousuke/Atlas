import React, { useState } from 'react';
import { useMockData } from '../hooks/useMockData';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { exportInsightsToCSV, exportInsightsToJSON } from '../services/reportService';
import { ReportIcon } from '../components/icons';
import { Report } from '../types';

const ReportsView: React.FC = () => {
    const { reports, insights } = useMockData();
    const [weeklyReport, setWeeklyReport] = useState(true);
    const [monthlyReport, setMonthlyReport] = useState(false);
    const [notificationEmail, setNotificationEmail] = useState('');
    const [savedEmail, setSavedEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)} days ago`;
        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)} hours ago`;
        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)} minutes ago`;
        return "Just now";
    };

    const handleDownload = (format: 'csv' | 'json') => {
        if (format === 'csv') {
            exportInsightsToCSV(insights);
        } else {
            exportInsightsToJSON(insights);
        }
    };
    
    const handleImport = () => {
        alert("Feature to import previous reports is in development. This would open a file dialog to select a report file.");
    };
    
    const validateEmail = (email: string) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSaveEmail = () => {
        setEmailError('');
        setSaveSuccess('');
        if (notificationEmail && validateEmail(notificationEmail)) {
            setSavedEmail(notificationEmail);
            setSaveSuccess(`Reports will be sent to ${notificationEmail}.`);
            setTimeout(() => setSaveSuccess(''), 4000);
        } else {
            setEmailError('Please enter a valid email address.');
        }
    };

    const handleEmailNow = () => {
        if (!savedEmail) {
            alert("Please configure and save an email address first.");
        } else {
            alert(`Simulating sending a report to ${savedEmail} now...`);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Reporting & Automation</h1>
                <p className="text-muted-foreground">
                    Manage automated reports and access historical data exports.
                </p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Automation Settings</CardTitle>
                        <CardDescription>Configure scheduled analysis reports.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                <div>
                                    <h4 className="font-medium">Weekly Email Report</h4>
                                    <p className="text-sm text-muted-foreground">Send a summary every Monday.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={weeklyReport} onChange={() => setWeeklyReport(!weeklyReport)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                <div>
                                    <h4 className="font-medium">Monthly Email Report</h4>
                                    <p className="text-sm text-muted-foreground">Send a deep-dive on the 1st.</p>
                                </div>
                                 <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={monthlyReport} onChange={() => setMonthlyReport(!monthlyReport)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-3 pt-6 border-t">
                             <h4 className="font-medium">Notification Email</h4>
                             {savedEmail && <p className="text-sm text-muted-foreground">Current: <span className="font-semibold text-foreground">{savedEmail}</span></p>}
                             <div className="flex items-center space-x-2">
                                <Input 
                                    type="email" 
                                    placeholder="your.email@company.com" 
                                    value={notificationEmail}
                                    onChange={(e) => {
                                        setNotificationEmail(e.target.value);
                                        setEmailError('');
                                    }}
                                />
                                <Button onClick={handleSaveEmail} variant="secondary">Save</Button>
                             </div>
                             {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                             {saveSuccess && <p className="text-sm text-green-500">{saveSuccess}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                        <Button onClick={handleEmailNow} className="w-full">
                           Email Latest Report Now
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Report History</CardTitle>
                                <CardDescription>Download past analysis reports on demand.</CardDescription>
                            </div>
                            <Button variant="outline" onClick={handleImport}>Import Reports</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {reports.map(report => (
                                <div key={report.id} className="flex items-center justify-between p-3 rounded-md border hover:border-secondary transition-colors">
                                    <div className="flex items-center gap-3">
                                        <ReportIcon className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{report.title}</p>
                                            <p className="text-sm text-muted-foreground">{report.format} &middot; Generated {timeAgo(report.timestamp)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleDownload('csv')}>CSV</Button>
                                        <Button size="sm" variant="secondary" onClick={() => handleDownload('json')}>JSON</Button>
                                    </div>
                                </div>
                            ))}
                             {reports.length === 0 && <p className="text-sm text-center text-muted-foreground py-8">No reports generated yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReportsView;