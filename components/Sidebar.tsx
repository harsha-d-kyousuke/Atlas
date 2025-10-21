import React from 'react';
import { ViewType } from '../types';
import { AtlasLogo, DashboardIcon, InsightIcon, AutomationIcon, ChatIcon, DatabaseIcon, ReportIcon } from './icons';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'insights', label: 'Insights', icon: InsightIcon },
  { id: 'automations', label: 'Automations', icon: AutomationIcon },
  { id: 'datasources', label: 'Data Sources', icon: DatabaseIcon },
  { id: 'reports', label: 'Reports', icon: ReportIcon },
  { id: 'chat', label: 'ATLAS Chat', icon: ChatIcon },
] as const;

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="flex items-center h-16 px-6 border-b border-border">
        <AtlasLogo className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-lg font-bold">ATLAS</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
       <div className="px-6 py-4 border-t border-border">
        <div className="text-xs text-muted-foreground">© 2024 ATLAS Corp.</div>
      </div>
    </div>
  );
};

export default Sidebar;