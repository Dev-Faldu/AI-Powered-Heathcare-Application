import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Logo from '@/components/ui/Logo';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import AuthCard from '@/components/auth/AuthCard';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAuth, UserRole } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [userType, setUserType] = useState<UserRole>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, currentUser } = useAuth();

  const from = (location.state as any)?.from || (userType === 'doctor' ? '/doctor-dashboard' : '/health-dashboard');

  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const user = await login(data.email, data.password);
      if (user) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return; // Prevent multiple clicks
    
    setGoogleLoading(true);
    try {
      // Show a loading toast
      const loadingToast = toast({
        title: "Google Sign-In",
        description: "Opening Google login popup...",
      });
      
      const user = await loginWithGoogle(userType);
      
      // Dismiss the loading toast if needed
      if (loadingToast && loadingToast.dismiss) {
        loadingToast.dismiss();
      }
      
      if (user) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Google Login Error",
        description: "An unexpected error occurred during Google sign-in",
        variant: "destructive"
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-medical-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
        </div>

        <AuthCard
          headerContent={
            <div className="w-full">
              <ToggleGroup type="single" value={userType} onValueChange={(value) => value && setUserType(value as UserRole)} className="w-full">
                <ToggleGroupItem value="patient" className="w-1/2 data-[state=on]:bg-medical-100 dark:data-[state=on]:bg-medical-900">
                  <User className="h-4 w-4 mr-2" />
                  Patient
                </ToggleGroupItem>
                <ToggleGroupItem value="doctor" className="w-1/2 data-[state=on]:bg-teal-100 dark:data-[state=on]:bg-teal-900">
                  <User className="h-4 w-4 mr-2" />
                  Doctor
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          }
          footerContent={
            <>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                <span className="text-gray-400 dark:text-gray-500 text-sm">OR</span>
                <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={handleGoogleLogin}
                disabled={isLoading || googleLoading}
              >
                {googleLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                    <span>Connecting to Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-medical-600 dark:text-medical-400 font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </>
          }
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="name@example.com" 
                          className="pl-9" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-9" 
                          {...field} 
                          disabled={isLoading}
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600" 
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-medical-600 dark:text-medical-400 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : "Sign In"}
              </Button>
            </form>
          </Form>
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
