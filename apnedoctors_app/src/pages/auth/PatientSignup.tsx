
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import AuthCard from '@/components/auth/AuthCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

// Modified schema to allow boolean for termsAccepted with refinement
const patientSignupSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  age: z.string().min(1, { message: 'Age is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  phoneNumber: z.string().min(10, { message: 'Valid phone number is required' }),
  termsAccepted: z.boolean()
    .refine(val => val === true, {
      message: "You must accept the terms and conditions",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PatientSignupFormValues = z.infer<typeof patientSignupSchema>;

const PatientSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, currentUser, loginWithGoogle } = useAuth();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/health-dashboard');
    }
  }, [currentUser, navigate]);

  const form = useForm<PatientSignupFormValues>({
    resolver: zodResolver(patientSignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      gender: '',
      phoneNumber: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: PatientSignupFormValues) => {
    setIsLoading(true);
    try {
      const user = await signUp(
        data.email, 
        data.password, 
        'patient', 
        data.fullName,
        data.phoneNumber
      );
      
      if (user) {
        // Redirect to login page after successful signup
        toast({
          title: "Registration successful",
          description: "Please verify your email before logging in",
        });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const user = await loginWithGoogle('patient');
      if (user) {
        navigate('/health-dashboard');
      }
    } catch (error) {
      console.error("Google signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-medical-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center mb-4">
            <div className="relative w-10 h-10 bg-gradient-to-br from-medical-400 to-teal-500 rounded-md flex items-center justify-center text-white font-bold text-lg">
              <span className="relative z-10">A</span>
              <div className="absolute inset-0 bg-white opacity-20 rounded-md blur-sm"></div>
            </div>
            <span className="ml-2 font-medium text-2xl">
              <span className="text-medical-700 dark:text-medical-400">Apne</span>
              <span className="text-teal-600 dark:text-teal-400">Doctors</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Patient Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Join as a patient to access healthcare services</p>
        </div>

        <AuthCard
          headerContent={
            <Button variant="ghost" size="sm" onClick={() => navigate('/signup')} className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to account type
            </Button>
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
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
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
              </Button>
            
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-medical-600 dark:text-medical-400 font-medium hover:underline">
                    Sign in
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="30" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" {...field} disabled={isLoading} />
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
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
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
                    {field.value && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                          <div 
                            className={`h-1.5 rounded-full ${getPasswordStrengthColor(passwordStrength(field.value))}`}
                            style={{ width: `${passwordStrength(field.value) * 20}%` }}
                          ></div>
                        </div>
                        <p className={`text-xs ${passwordStrength(field.value) <= 2 ? 'text-red-500' : passwordStrength(field.value) <= 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {getPasswordStrengthText(passwordStrength(field.value))}
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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

              <Alert className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <AlertDescription className="text-xs space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Password must contain:</p>
                  <div className="flex items-center space-x-2">
                    <Check className={`h-3 w-3 ${form.watch('password').length >= 8 ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                    <span className={`text-xs ${form.watch('password').length >= 8 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className={`h-3 w-3 ${/[A-Z]/.test(form.watch('password')) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                    <span className={`text-xs ${/[A-Z]/.test(form.watch('password')) ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className={`h-3 w-3 ${/[a-z]/.test(form.watch('password')) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                    <span className={`text-xs ${/[a-z]/.test(form.watch('password')) ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                      At least one lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className={`h-3 w-3 ${/[0-9]/.test(form.watch('password')) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                    <span className={`text-xs ${/[0-9]/.test(form.watch('password')) ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                      At least one number
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
              
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        I agree to the <Link to="#" className="text-medical-600 dark:text-medical-400 hover:underline">Terms of Service</Link> and <Link to="#" className="text-medical-600 dark:text-medical-400 hover:underline">Privacy Policy</Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : "Create Account"}
              </Button>
            </form>
          </Form>
        </AuthCard>
      </div>
    </div>
  );
};

export default PatientSignup;
