import React, { useState, useRef, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface EpicTooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showIcon?: boolean;
}

const EpicTooltip: React.FC<EpicTooltipProps> = ({ 
  children, 
  content, 
  position = 'top',
  showIcon = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const getTooltipPosition = () => {
    if (!tooltipRef.current || !childRef.current) return {};

    const childRect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '0.5rem'
        };
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '0.5rem'
        };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '0.5rem'
        };
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '0.5rem'
        };
      default:
        return {};
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      ref={childRef}
    >
      <div className="flex items-center gap-2">
        {children}
        {showIcon && (
          <Info className="h-4 w-4 text-text-secondary" />
        )}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className="absolute z-50 w-64 p-4 bg-background-secondary/95 backdrop-blur-sm
                     rounded-lg border border-accent-purple/20 shadow-glow-sm"
            style={getTooltipPosition()}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
          >
            <div className="text-sm">
              {typeof content === 'string' ? (
                <p className="text-text-secondary">{content}</p>
              ) : (
                content
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EpicTooltip;
