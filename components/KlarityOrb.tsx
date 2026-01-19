import React, { useMemo } from 'react';
import { User } from '../types.ts';

interface KlarityOrbProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const KlarityOrb: React.FC<KlarityOrbProps> = ({ user, size = 'md' }) => {
  const { color, glowColor, animationDuration } = useMemo(() => {
    const score = user.burnoutScore;
    
    if (score > 70) {
      return { 
        color: 'bg-semantic-burnout', 
        glowColor: 'shadow-red-500/50',
        animationDuration: 'duration-75' // Fast pulse
      };
    } else if (score > 40) {
      return { 
        color: 'bg-semantic-warning', 
        glowColor: 'shadow-amber-500/50',
        animationDuration: 'duration-500' // Medium pulse
      };
    } else {
      return { 
        color: 'bg-semantic-success', 
        glowColor: 'shadow-emerald-500/50',
        animationDuration: 'duration-[3000ms]' // Slow, calm pulse
      };
    }
  }, [user.burnoutScore]);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-6 h-6',
    lg: 'w-12 h-12',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Glow */}
      <div 
        className={`absolute rounded-full opacity-40 animate-ping ${color} ${sizeClasses[size]}`}
        style={{ animationDuration: user.burnoutScore > 70 ? '1s' : '3s' }}
      />
      {/* Core */}
      <div 
        className={`relative rounded-full transition-colors ${color} ${glowColor} shadow-lg ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default KlarityOrb;