import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthCard from '@/components/auth/AuthCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, User } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const Signup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>('patient');

  const handleContinue = () => {
    navigate(selectedRole === 'doctor' ? '/doctor-signup' : '/patient-signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-medical-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Join ApneDoctors and take control of your health</p>
        </div>

        <AuthCard
          headerContent={
            <h3 className="text-lg font-medium">Who are you?</h3>
          }
          footerContent={
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-medical-600 dark:text-medical-400 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          }
        >
          <Tabs defaultValue="patient" className="w-full" onValueChange={(value) => setSelectedRole(value as 'patient' | 'doctor')}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="patient">
                <User className="h-4 w-4 mr-2" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="doctor">
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctor
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient" className="space-y-4">
              <div className="border rounded-lg p-4 text-center space-y-4 bg-white dark:bg-gray-800">
                <div className="w-16 h-16 bg-medical-100 dark:bg-medical-900 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-medical-600 dark:text-medical-400" />
                </div>
                <h3 className="text-lg font-medium">Patient Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Access online consultations, get medicine reminders, and keep your medical records in one place.
                </p>
                <ul className="text-left text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Book appointments with doctors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Get AI-powered health recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Store and access your medical records</span>
                  </li>
                </ul>
              </div>
              <Button onClick={handleContinue} className="w-full">Continue as Patient</Button>
            </TabsContent>
            
            <TabsContent value="doctor" className="space-y-4">
              <div className="border rounded-lg p-4 text-center space-y-4 bg-white dark:bg-gray-800">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto">
                  <Stethoscope className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-medium">Doctor Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your practice, connect with patients, and access advanced healthcare tools.
                </p>
                <ul className="text-left text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Manage your appointments and schedule</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Conduct video consultations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Access AI-powered diagnostic tools</span>
                  </li>
                </ul>
              </div>
              <Button onClick={handleContinue} className="w-full">Continue as Doctor</Button>
            </TabsContent>
          </Tabs>
        </AuthCard>
      </div>
    </div>
  );
};

export default Signup;
