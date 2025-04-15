
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import AuthCard from '@/components/auth/AuthCard';
import { useAuth } from '@/contexts/AuthContext';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.email);
      setIsEmailSent(true);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEmailSent ? 'Check Your Email' : 'Reset Password'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isEmailSent 
              ? 'We have sent you an email with password reset instructions' 
              : 'Enter your email address to receive a password reset link'}
          </p>
        </div>

        <AuthCard
          headerContent={
            <Link to="/login" className="inline-flex items-center text-sm text-medical-600 dark:text-medical-400 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
            </Link>
          }
          footerContent={
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <Link to="/login" className="text-medical-600 dark:text-medical-400 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          }
        >
          {isEmailSent ? (
            <div className="py-6 text-center">
              <div className="bg-medical-50 dark:bg-medical-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-10 w-10 text-medical-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                If an account exists with the email you entered, we've sent instructions to reset your password.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
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
                            disabled={isSubmitting}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Link...
                    </div>
                  ) : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}
        </AuthCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
