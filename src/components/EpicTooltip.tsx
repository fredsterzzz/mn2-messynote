import React, { useState } from 'react';

interface EpicTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function EpicTooltip({ content, children, position = 'top' }: EpicTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2',
    left: 'right-full top-1/2 -translate-x-2 -translate-y-1/2',
    right: 'left-full top-1/2 translate-x-2 -translate-y-1/2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`absolute z-50 ${positionClasses[position]} p-2 min-w-[200px] bg-background-secondary rounded-lg border border-accent-purple/20 shadow-glow-sm text-sm text-text-secondary`}
          style={{ 
            animation: 'tooltip-enter 0.2s ease-out forwards',
          }}
        >
          {content}
          <style jsx>{`
            @keyframes tooltip-enter {
              from {
                opacity: 0;
                transform: scale(0.95) ${position === 'top' ? 'translateY(5px)' : 
                  position === 'bottom' ? 'translateY(-5px)' : 
                  position === 'left' ? 'translateX(5px)' : 
                  'translateX(-5px)'};
              }
              to {
                opacity: 1;
                transform: scale(1) translate(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
