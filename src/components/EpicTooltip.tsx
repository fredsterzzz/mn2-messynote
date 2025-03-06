import React, { useState } from 'react';

interface EpicTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function EpicTooltip({ content, children, position = 'top' }: EpicTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: '-left-2 top-1/2 -translate-x-full -translate-y-1/2',
    right: '-right-2 top-1/2 translate-x-full -translate-y-1/2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`epic-tooltip ${positionClasses[position]} animate-scale`}>
          {content}
        </div>
      )}
    </div>
  );
}
