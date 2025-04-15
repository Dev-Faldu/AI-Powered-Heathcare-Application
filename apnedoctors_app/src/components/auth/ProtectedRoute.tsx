
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles
}) => {
  const { currentUser, userData, isLoading } = useAuth();

  // If still loading authentication state, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    toast({
      title: "Authentication required",
      description: "Please login to access this page",
      variant: "destructive"
    });
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have required role, redirect
  if (userData?.role && !allowedRoles.includes(userData.role)) {
    toast({
      title: "Access denied",
      description: "You don't have permission to access this page",
      variant: "destructive"
    });
    
    // Redirect based on user role
    if (userData.role === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    } else {
      return <Navigate to="/health-dashboard" replace />;
    }
  }

  // If authentication passed, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
