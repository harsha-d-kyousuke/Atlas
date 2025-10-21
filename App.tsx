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

type AppState = 'start' | 'auth';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [appState, setAppState] = useState<AppState>('start');
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000); // Start fading out after 2 seconds

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Remove splash screen after fade out (0.5s animation)

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(splashTimer);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen isFadingOut={isFadingOut} />;
  }
  
  if (appState === 'start') {
    return <StartScreen onGetStarted={() => setAppState('auth')} />;
  }

  if (loading) {
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