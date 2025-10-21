import React from 'react';
import { AtlasLogo } from '../components/icons';
import Button from '../components/ui/Button';

interface StartScreenProps {
  onGetStarted: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
      <div className="relative flex w-full max-w-4xl flex-col items-center overflow-hidden rounded-lg border bg-card p-8 md:flex-row animate-fadeInUp">
        <div className="relative z-10 w-full space-y-6 text-center md:w-1/2 md:text-left">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <AtlasLogo className="h-12 w-12 text-primary animate-pulseGlow" />
            <h1 className="text-4xl font-bold">ATLAS</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Welcome to the future of Cognitive Workspace Intelligence.
          </p>
          <p className="text-sm text-muted-foreground">
            Unlock actionable insights, automate complex workflows, and drive decisions with an AI-powered platform that understands your enterprise data.
          </p>
          <Button size="lg" onClick={onGetStarted} className="w-full md:w-auto">
            Get Started
          </Button>
        </div>
        <div className="relative mt-8 h-64 w-full md:mt-0 md:h-auto md:w-1/2">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>
          <AtlasLogo className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 text-primary/20" />
        </div>
      </div>
    </div>
  );
};

export default StartScreen;