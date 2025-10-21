import React from 'react';
import { AtlasLogo } from './icons';

interface SplashScreenProps {
  isFadingOut: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isFadingOut }) => {
  return (
    <div className={`fixed inset-0 bg-background flex items-center justify-center z-50 transition-opacity duration-500 ${isFadingOut ? 'animate-fadeOut' : 'opacity-100'}`}>
      <div className="animate-popIn">
        <AtlasLogo className="h-24 w-24 text-primary" />
      </div>
    </div>
  );
};

export default SplashScreen;