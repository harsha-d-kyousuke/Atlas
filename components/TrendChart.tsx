
import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { ChartDataPoint } from '../types';
import Button from './ui/Button';
import { WandIcon, Loader2 } from './icons';
import { forecastSalesData } from '../services/geminiService';

interface TrendChartProps {
  data: ChartDataPoint[];
  setData: (data: ChartDataPoint[]) => void;
  title: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, setData, title }) => {
    const [isForecasting, setIsForecasting] = useState(false);
    
    const actualData = data.filter(d => !d.isForecast);
    const forecastData = data.filter(d => d.isForecast);
    const hasForecast = forecastData.length > 0;
    
    // To connect the lines, forecast data should start with the last actual data point
    const displayForecastData = hasForecast ? [actualData[actualData.length - 1], ...forecastData] : [];

    const handleForecast = async () => {
        if(hasForecast) return;
        setIsForecasting(true);
        const newForecasts = await forecastSalesData(actualData);
        if (newForecasts) {
            const forecastPoints: ChartDataPoint[] = newForecasts.map(d => ({...d, isForecast: true}));
            setData([...actualData, ...forecastPoints]);
        } else {
            // Handle error case, e.g., show a toast notification
            console.error("Failed to fetch forecast data.");
        }
        setIsForecasting(false);
    };

    return (
        <div className="h-full w-full relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold text-card-foreground">{title}</h3>
                <Button size="sm" variant="outline" onClick={handleForecast} disabled={isForecasting || hasForecast}>
                    {isForecasting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Forecasting...
                        </>
                    ) : (
                       <>
                            <WandIcon className="mr-2 h-4 w-4" />
                            {hasForecast ? 'Forecast Generated' : 'Forecast Q4'}
                       </>
                    )}
                </Button>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            borderColor: '#27272a',
                            borderRadius: '0.5rem',
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Area type="monotone" dataKey="value" data={actualData} stroke="#60a5fa" fill="url(#colorValue)" strokeWidth={2} name="Sales" />
                    <Area type="monotone" dataKey="value" data={displayForecastData} stroke="#a78bfa" fill="url(#colorForecast)" strokeWidth={2} name="Forecast" strokeDasharray="5 5"/>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;
