import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import InsightsView from './views/InsightsView';
import AutomationsView from './views/AutomationsView';
import ChatView from './views/ChatView';
import DataSourcesView from './views/DataSourcesView';
import ReportsView from './views/ReportsView';
import LoginView from './views/LoginView';
import StartScreen from './views/StartScreen';
import SplashScreen from './components/SplashScreen';
import { ViewType } from './types';
import { useAuth } from './hooks/AuthProvider';
import { Loader2 } from './components/icons';

type AppStatus = 'splash' | 'start' | 'auth' | 'loading' | 'ready';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [status, setStatus] = useState<AppStatus>('splash');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (status === 'splash') {
      const fadeTimer = setTimeout(() => setIsFadingOut(true), 1500);
      const splashTimer = setTimeout(() => setStatus('start'), 2000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(splashTimer);
      };
    }
  }, [status]);

  if (status === 'splash') {
    return <SplashScreen isFadingOut={isFadingOut} />;
  }

  if (status === 'start') {
    return <StartScreen onGetStarted={() => setStatus('auth')} />;
  }
  
  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'insights':
        return <InsightsView />;
      case 'automations':
        return <AutomationsView />;
      case 'datasources':
        return <DataSourcesView />;
      case 'chat':
        return <ChatView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header view={activeView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;