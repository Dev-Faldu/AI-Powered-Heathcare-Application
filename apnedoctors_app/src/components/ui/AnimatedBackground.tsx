
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  className?: string;
  dotCount?: number;
  interactive?: boolean;
}

const AnimatedBackground = ({ 
  className, 
  dotCount = 8,
  interactive = false 
}: AnimatedBackgroundProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);
  
  const generateDots = () => {
    const dots = [];
    
    for (let i = 0; i < dotCount; i++) {
      const size = Math.random() * 300 + 100;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const hue = Math.random() < 0.5 ? '204' : '187'; // Primary or secondary hue
      const animationDelay = Math.random() * 5;
      
      dots.push(
        <div
          key={i}
          className="blur-dot"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            backgroundColor: `hsla(${hue}, 100%, 50%, 0.15)`,
            animationDelay: `${animationDelay}s`,
            transform: interactive 
              ? `translate(${(mousePosition.x - window.innerWidth/2) * 0.02}px, ${(mousePosition.y - window.innerHeight/2) * 0.02}px)`
              : 'none'
          }}
        />
      );
    }
    
    return dots;
  };
  
  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none", className)}>
      {generateDots()}
    </div>
  );
};

export default AnimatedBackground;
