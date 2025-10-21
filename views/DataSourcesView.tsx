import React, { useState } from 'react';
import { useMockData } from '../hooks/useMockData';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { DataSource, AnalysisResult } from '../types';
import { CsvIcon, JsonIcon, PdfIcon, FileIcon, TrashIcon, Loader2 } from '../components/icons';
import { analyzeDataSource } from '../services/geminiService';
import AnalysisResultModal from '../components/AnalysisResultModal';

const typeIconMap: Record<DataSource['type'], React.FC<any>> = {
  CSV: CsvIcon,
  JSON: JsonIcon,
  PDF: PdfIcon,
  UNKNOWN: FileIcon,
};

const DataSourcesView: React.FC = () => {
    const { dataSources, addDataSource, deleteDataSource, addInsight, addAutomation } = useMockData();
    const [sourceName, setSourceName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDataSourceName, setSelectedDataSourceName] = useState('');

    const validateFileAndSetState = (selectedFile: File | null) => {
        if (!selectedFile) {
            setFile(null);
            setUploadError(null);
            return;
        }
        
        const allowedExtensions = ['csv', 'json', 'pdf'];
        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

        if (fileExtension && allowedExtensions.includes(fileExtension)) {
            setFile(selectedFile);
            if (!sourceName) {
                setSourceName(selectedFile.name);
            }
            setUploadError(null);
        } else {
            setFile(null);
            if (sourceName === selectedFile.name) {
                setSourceName('');
            }
            setUploadError('Invalid file type. Please upload a CSV, JSON, or PDF file.');
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        validateFileAndSetState(e.target.files?.[0] || null);
    };
    
    const handleSubmit = () => {
        if (!file) {
            setUploadError('Please select a valid file to upload.');
            return;
        }
        addDataSource(file, sourceName);
        setSourceName('');
        setFile(null);
        setUploadError(null);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        validateFileAndSetState(e.dataTransfer.files?.[0] || null);
    };

    const handleAnalyze = async (dataSource: DataSource) => {
        setAnalyzingId(dataSource.id);
        const result = await analyzeDataSource(dataSource.name);
        setAnalyzingId(null);
        if (result) {
            setAnalysisResult(result);
            setSelectedDataSourceName(dataSource.name);
            setIsModalOpen(true);
        } else {
            alert('Failed to analyze the data source. Please check the console for errors.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAnalysisResult(null);
        setSelectedDataSourceName('');
    };

    const statusMap: Record<DataSource['status'], 'secondary' | 'default' | 'destructive'> = {
        Ingested: 'secondary',
        Processing: 'default',
        Error: 'destructive',
    };
    
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Manage Data Sources</h1>
                <p className="text-muted-foreground">
                    Upload new datasets for ATLAS to analyze and derive insights from.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Add New Data Source</CardTitle>
                    <CardDescription>Upload a CSV, JSON, or PDF file.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label htmlFor="source-name" className="text-sm font-medium mb-2 block">Data Source Name</label>
                        <Input 
                            id="source-name"
                            placeholder="e.g., Q4 Customer Feedback"
                            value={sourceName}
                            onChange={(e) => setSourceName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Upload File</label>
                        <label 
                            htmlFor="file-upload" 
                            className={`flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md cursor-pointer transition-colors ${isDragging ? 'border-primary bg-muted' : ''}`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="space-y-1 text-center flex flex-col justify-center">
                                {isDragging ? (
                                    <>
                                        <FileIcon className="mx-auto h-12 w-12 text-primary" />
                                        <p className="mt-2 font-semibold text-primary">Drop file here</p>
                                    </>
                                ) : (
                                    <>
                                        <svg className="mx-auto h-10 w-10 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <div className="flex text-sm text-muted-foreground">
                                            <span className="relative rounded-md font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv,.json,.pdf" />
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        {file ? <p className="text-sm text-foreground pt-1">{file.name}</p> : <p className="text-xs text-muted-foreground">CSV, JSON, PDF up to 10MB</p>}
                                    </>
                                )}
                            </div>
                        </label>
                        {uploadError && <p className="text-sm text-destructive mt-2">{uploadError}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} disabled={!file}>
                        Ingest Data
                    </Button>
                </CardFooter>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">Ingested Sources</h2>
                {dataSources.length > 0 ? dataSources.map(ds => {
                    const Icon = typeIconMap[ds.type];
                    return (
                    <Card key={ds.id} className="flex items-center p-4 justify-between hover:border-secondary transition-colors">
                        <div className="flex items-center gap-4 min-w-0">
                            <Icon className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{ds.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {ds.type} &middot; Ingested {timeAgo(ds.timestamp)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <Badge variant={statusMap[ds.status]}>{ds.status}</Badge>
                            {ds.status === 'Ingested' && (
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleAnalyze(ds)}
                                    disabled={analyzingId === ds.id}
                                    className="w-[180px]"
                                >
                                     {analyzingId === ds.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Analyze with ATLAS'
                                    )}
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => deleteDataSource(ds.id)}>
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                )}) : (
                     <div className="text-center py-10 bg-card rounded-lg">
                        <p className="text-muted-foreground">No data sources have been ingested yet.</p>
                    </div>
                )}
            </div>
             <AnalysisResultModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                analysisResult={analysisResult}
                dataSourceName={selectedDataSourceName}
                onAddInsight={addInsight}
                onAddAutomation={addAutomation}
            />
        </div>
    );
};

export default DataSourcesView;