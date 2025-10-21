
import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

const badgeVariants = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-black',
  outline: 'text-foreground border',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'default', className = '', children }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Badge;
