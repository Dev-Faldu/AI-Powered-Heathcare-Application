
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingScreen from "./components/ui/LoadingScreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Diagnosis from "./pages/Diagnosis";
import Doctors from "./pages/Doctors";
import FindDoctors from "./pages/FindDoctors";
import VideoConsultationPage from "./pages/VideoConsultation";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import DoctorSignup from "./pages/auth/DoctorSignup";
import PatientSignup from "./pages/auth/PatientSignup";
import DoctorDashboard from "./pages/DoctorDashboard";
import HealthDashboard from "./pages/HealthDashboard";
import UserProfile from "./pages/auth/UserProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AboutUs from "./pages/company/AboutUs";
import Careers from "./pages/company/Careers";
import Press from "./pages/company/Press";
import Blog from "./pages/company/Blog";
import BlogPost from "./pages/company/BlogPost";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Loading ApneDoctors..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/diagnosis" element={<Diagnosis />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/find-doctors" element={<FindDoctors />} />
              <Route path="/video-consultation" element={<VideoConsultationPage />} />
              
              {/* Company Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              
              {/* Protected Routes */}
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/health-dashboard" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <HealthDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['patient', 'doctor']}>
                  <UserProfile />
                </ProtectedRoute>
              } />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/doctor-signup" element={<DoctorSignup />} />
              <Route path="/patient-signup" element={<PatientSignup />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
