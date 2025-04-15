import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, Check, ChevronLeft, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
import { verifyMedicalLicense, VerificationResult } from '@/services/medicalLicenseService';

// Sample specializations
const specializations = [
  'General Practitioner',
  'Cardiologist',
  'Dermatologist',
  'Endocrinologist',
  'Gastroenterologist',
  'Neurologist',
  'Oncologist',
  'Ophthalmologist',
  'Orthopedist',
  'Pediatrician',
  'Psychiatrist',
  'Pulmonologist',
  'Radiologist',
  'Surgeon',
  'Urologist'
];

const doctorSignupSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  phoneNumber: z.string().min(10, { message: 'Valid phone number is required' }),
  medicalLicenseNumber: z.string().min(5, { message: 'Valid license number is required' }),
  specialization: z.string().min(1, { message: 'Specialization is required' }),
  clinicName: z.string().min(1, { message: 'Clinic or hospital name is required' }),
  experience: z.string(),
  bio: z.string(),
  termsAccepted: z.boolean()
    .refine(val => val === true, {
      message: "You must accept the terms and conditions",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type DoctorSignupFormValues = z.infer<typeof doctorSignupSchema>;

const DoctorSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [verificationDetails, setVerificationDetails] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const form = useForm<DoctorSignupFormValues>({
    resolver: zodResolver(doctorSignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      medicalLicenseNumber: '',
      specialization: '',
      clinicName: '',
      experience: '',
      bio: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: DoctorSignupFormValues) => {
    try {
      // Check for license file
      if (!licenseFile) {
        toast({
          title: "Missing document",
          description: "Please upload your medical license document",
          variant: "destructive",
        });
        return;
      }

      // Check verification status
      if (!verificationDetails?.first_level_passed) {
        toast({
          title: "Verification required",
          description: "Please ensure your medical license is verified successfully",
          variant: "destructive",
        });
        return;
      }

      // Merge verification details with form data
      const submitData = {
        ...data,
        verificationDetails: {
          experience: verificationDetails.candidate_details.experience,
          certifications: verificationDetails.candidate_details.certifications,
          verificationScore: verificationDetails.candidate_details.scores.cosine_similarity
        }
      };

      console.log('Doctor signup:', submitData, 'License file:', licenseFile);
      
      toast({
        title: "Registration submitted",
        description: "We'll verify your details and send you an email once approved.",
      });
      
      // Redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenseFile(file);

      try {
        setIsVerifying(true);
        toast({
          title: "Verifying document",
          description: "Please wait while we verify your medical license...",
        });

        const result = await verifyMedicalLicense(file);
        setVerificationDetails(result);

        if (result.first_level_passed) {
          toast({
            title: "Verification successful",
            description: "Your medical license has been verified successfully.",
            variant: "default",
          });
        } else {
          toast({
            title: "Verification failed",
            description: result.reason || "Please ensure you've uploaded a valid medical license.",
            variant: "destructive",
          });
          setLicenseFile(null);
        }
      } catch (error) {
        toast({
          title: "Verification error",
          description: "There was an error verifying your document. Please try again.",
          variant: "destructive",
        });
        setLicenseFile(null);
      } finally {
        setIsVerifying(false);
      }
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

  function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div className="min-h-screen py-12 flex items-center justify-center p-4 bg-gradient-to-br from-medical-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-2xl space-y-8">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Registration</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Join our medical network and connect with patients</p>
        </div>

        <AuthCard
          className="max-w-2xl"
          headerContent={
            <Button variant="ghost" size="sm" onClick={() => navigate('/signup')} className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to account type
            </Button>
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
          <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300">
            <AlertDescription>
              Your account will require verification before activation. We'll review your credentials within 24-48 hours.
            </AlertDescription>
          </Alert>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Jane Smith" {...field} />
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
                        <Input placeholder="doctor@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="medicalLicenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical License Number</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., MCI-12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specializations.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="E.g., 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="clinicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic/Hospital Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., City Medical Center" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of your qualifications and experience" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border rounded-md p-4 space-y-2">
                <FormLabel>Upload Medical License Document</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, JPG or PNG (Max. 5MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={handleFileChange}
                    />
                  </label>
                  
                  <div className="space-y-3">
                    {licenseFile && (
                      <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300">
                        <p className="font-medium text-sm">File uploaded:</p>
                        <p className="text-sm truncate">{licenseFile.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(licenseFile.size / 1024)} KB
                        </p>
                      </div>
                    )}
                    
                    {isVerifying && (
                      <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Verifying document...
                          </p>
                        </div>
                      </div>
                    )}

                    {verificationDetails && (
                      <div className={cn(
                        "p-3 border rounded-md",
                        verificationDetails.first_level_passed 
                          ? "bg-green-50 dark:bg-green-900/20" 
                          : "bg-red-50 dark:bg-red-900/20"
                      )}>
                        <h4 className="font-medium text-sm mb-2">
                          Verification Results:
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p>Experience: {verificationDetails.candidate_details.experience} years</p>
                          <p>Certifications found: {
                            verificationDetails.candidate_details.certifications.join(', ') || 'None'
                          }</p>
                          <div className="flex items-center space-x-2">
                            <span>Similarity score:</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={cn(
                                  "h-2 rounded-full",
                                  verificationDetails.first_level_passed 
                                    ? "bg-green-500" 
                                    : "bg-red-500"
                                )}
                                style={{ 
                                  width: `${verificationDetails.candidate_details.scores.cosine_similarity * 100}%` 
                                }}
                              />
                            </div>
                            <span>{
                              Math.round(verificationDetails.candidate_details.scores.cosine_similarity * 100)
                            }%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {!licenseFile && (
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Please upload a clear copy of your medical license or registration certificate
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        I agree to the <Link to="#" className="text-medical-600 dark:text-medical-400 hover:underline">Terms of Service</Link>, <Link to="#" className="text-medical-600 dark:text-medical-400 hover:underline">Privacy Policy</Link> and <Link to="#" className="text-medical-600 dark:text-medical-400 hover:underline">Medical Ethics Guidelines</Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </Form>
        </AuthCard>
      </div>
    </div>
  );
};

export default DoctorSignup;
