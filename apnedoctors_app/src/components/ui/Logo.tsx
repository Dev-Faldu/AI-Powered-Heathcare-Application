
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  linkTo?: string;
  onClick?: () => void;
}

const Logo = ({ 
  className, 
  size = 'md', 
  showText = true,
  linkTo = '/',
  onClick
}: LogoProps) => {
  const sizes = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-14 w-auto'
  };

  // Fallback image in case the uploaded logo doesn't load
  const fallbackImage = '/placeholder.svg';
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
    e.currentTarget.onerror = null; // Prevent infinite error loops
    console.log('Logo image failed to load, using fallback');
  };

  const logo = (
    <div className={cn('flex items-center', className)} onClick={onClick}>
      <img 
        src="/lovable-uploads/apnedoctors_logo.png" 
        alt="ApneDoctors Logo" 
        className={cn(sizes[size], 'object-contain')}
        onError={handleImageError}
      />
      {showText && (
        <span className="ml-2 font-medium text-xl">
          <span className="text-medical-700 dark:text-medical-400">Apne</span>
          <span className="text-teal-600 dark:text-teal-400">Doctors</span>
        </span>
      )}
    </div>
  );

  // We should return only the logo without the Link component in the LoadingScreen
  // This fixes the error with react-router-dom context
  if (linkTo && typeof document !== 'undefined' && document.getElementById('root')) {
    try {
      return (
        <Link to={linkTo} className="inline-flex items-center" onClick={onClick}>
          {logo}
        </Link>
      );
    } catch (error) {
      console.log('Error rendering Link component:', error);
      return logo;
    }
  }

  return logo;
};

export default Logo;
