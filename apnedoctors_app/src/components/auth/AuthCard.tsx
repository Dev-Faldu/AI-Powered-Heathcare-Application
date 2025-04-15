
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  footerContent?: React.ReactNode;
  headerContent?: React.ReactNode;
  variant?: 'default' | 'doctor' | 'patient';
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  children, 
  className,
  footerContent,
  headerContent,
  variant = 'default'
}) => {
  const cardClass = cn(
    "w-full max-w-md shadow-lg", 
    {
      "border-t-4 border-t-medical-500": variant === 'default',
      "border-t-4 border-t-blue-600": variant === 'doctor',
      "border-t-4 border-t-green-600": variant === 'patient',
    },
    className
  );
  
  return (
    <Card className={cardClass}>
      {headerContent && (
        <CardHeader className="space-y-1">
          {headerContent}
        </CardHeader>
      )}
      <CardContent className="pt-4">
        {children}
      </CardContent>
      {footerContent && (
        <CardFooter className="flex flex-col space-y-2 pt-0">
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};

export default AuthCard;
