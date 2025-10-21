import React from 'react';
import { ViewType } from '../types';
import { useAuth } from '../hooks/AuthProvider';
import Button from './ui/Button';

interface HeaderProps {
  view: ViewType;
}

const viewTitles: Record<ViewType, string> = {
  dashboard: 'Cognitive Dashboard',
  insights: 'Insight Engine',
  automations: 'Automation Hub',
  datasources: 'Data Ingestion Pipeline',
  chat: 'ATLAS Conversational AI',
  reports: 'Reporting & Automation',
};

const Header: React.FC<HeaderProps> = ({ view }) => {
    const { user, logout } = useAuth();
  return (
    <header className="h-16 flex items-center px-6 lg:px-8 border-b border-border bg-card">
      <h1 className="text-xl font-semibold">{viewTitles[view]}</h1>
      <div className="ml-auto flex items-center space-x-4">
        {user && (
            <>
                <div className="text-sm text-muted-foreground">{user.email}</div>
                <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
            </>
        )}
      </div>
    </header>
  );
};

export default Header;