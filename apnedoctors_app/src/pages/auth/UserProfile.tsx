
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const UserProfile = () => {
  const { currentUser, userData, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('profile');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: currentUser?.displayName || '',
      bio: '',
      phoneNumber: '',
      address: '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await updateUserProfile({
        displayName: data.displayName,
        // Add other fields to Firestore
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 pb-10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and personal information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 group">
                    <Avatar className="w-28 h-28 border-4 border-white dark:border-gray-800 shadow-md">
                      <AvatarImage src={currentUser?.photoURL || undefined} />
                      <AvatarFallback className="bg-medical-100 text-medical-700 text-xl">
                        {getInitials(currentUser?.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{currentUser?.displayName || 'User'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{currentUser?.email}</p>
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-medical-100 text-medical-800 dark:bg-medical-900/50 dark:text-medical-300 capitalize mb-6">
                    {userData?.role || 'User'}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mb-2"
                    onClick={() => setSelectedTab('account')}
                  >
                    Account Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full mb-2"
                    onClick={() => setSelectedTab('security')}
                  >
                    Security
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your full name" 
                                  {...field} 
                                  disabled={isLoading}
                                />
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
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about yourself" 
                                  className="min-h-[120px]" 
                                  {...field} 
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., +91 98765 43210" 
                                    {...field} 
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Your full address" 
                                  className="min-h-[80px]" 
                                  {...field} 
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="account">
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Email Address</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Your current email address is <strong>{currentUser?.email}</strong>
                        </p>
                        <Button variant="outline" size="sm">Change Email</Button>
                      </div>
                      
                      {userData?.role === 'doctor' && (
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">Doctor Verification</h3>
                          <div className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-2 rounded mb-4">
                            <div className="bg-green-500 rounded-full w-3 h-3 mr-2"></div>
                            <span className="text-sm">Your account is verified</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your medical license has been verified. If you need to update your credentials, please contact support.
                          </p>
                        </div>
                      )}
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Account Management</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Your account was created on {new Date().toLocaleDateString()}.
                        </p>
                        <Button variant="destructive" size="sm">Delete Account</Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Change Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Update your password to keep your account secure.
                        </p>
                        <div className="space-y-4">
                          <Input type="password" placeholder="Current password" />
                          <Input type="password" placeholder="New password" />
                          <Input type="password" placeholder="Confirm new password" />
                          <Button>Update Password</Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Active Sessions</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          You're currently signed in on this device.
                        </p>
                        <Button variant="outline" size="sm">Sign Out From All Devices</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
