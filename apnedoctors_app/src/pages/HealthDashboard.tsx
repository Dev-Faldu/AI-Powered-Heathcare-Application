
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Calendar, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  BrainCircuit, 
  Pill, 
  Bell,
  TrendingUp,
  ShieldCheck,
  Users,
  FileText,
  MessageSquare 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SymptomChecker from '@/components/ai/SymptomChecker';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

// Mock data for dashboard
const healthScoreData = [
  { date: 'Jan', score: 78 },
  { date: 'Feb', score: 75 },
  { date: 'Mar', score: 82 },
  { date: 'Apr', score: 79 },
  { date: 'May', score: 85 },
  { date: 'Jun', score: 82 },
  { date: 'Jul', score: 91 },
];

const vitalSignsData = [
  { date: 'Mon', heartRate: 72, bloodPressure: 120, oxygenLevel: 98 },
  { date: 'Tue', heartRate: 75, bloodPressure: 118, oxygenLevel: 97 },
  { date: 'Wed', heartRate: 70, bloodPressure: 122, oxygenLevel: 98 },
  { date: 'Thu', heartRate: 74, bloodPressure: 119, oxygenLevel: 99 },
  { date: 'Fri', heartRate: 72, bloodPressure: 121, oxygenLevel: 98 },
  { date: 'Sat', heartRate: 68, bloodPressure: 117, oxygenLevel: 97 },
  { date: 'Sun', heartRate: 71, bloodPressure: 120, oxygenLevel: 98 },
];

const upcomingAppointments = [
  { id: 'a1', doctorName: 'Dr. Sharma', specialty: 'Cardiologist', date: '2023-08-10', time: '10:30 AM', isVideo: true },
  { id: 'a2', doctorName: 'Dr. Patel', specialty: 'Neurologist', date: '2023-08-15', time: '2:00 PM', isVideo: false },
];

const medications = [
  { id: 'm1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', time: '8:00 AM', remaining: 12 },
  { id: 'm2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '8:00 AM, 8:00 PM', remaining: 24 },
  { id: 'm3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', time: '8:00 PM', remaining: 15 },
];

const recentTests = [
  { id: 't1', name: 'Complete Blood Count', date: '2023-07-20', status: 'Completed', abnormal: false },
  { id: 't2', name: 'Lipid Panel', date: '2023-07-20', status: 'Completed', abnormal: true },
  { id: 't3', name: 'Hemoglobin A1C', date: '2023-07-15', status: 'Completed', abnormal: false },
];

const healthAlerts = [
  { id: 'h1', title: 'High Blood Pressure', description: 'Your blood pressure readings have been elevated for the past 3 days.', severity: 'high', date: '2 hours ago' },
  { id: 'h2', title: 'Medication Reminder', description: 'Take your evening dose of Atorvastatin.', severity: 'medium', date: '5 mins ago' },
  { id: 'h3', title: 'Sleep Pattern', description: 'Your sleep duration has decreased by 1.5 hours in the last week.', severity: 'low', date: '1 day ago' },
];

// AI health insights predictions
const aiHealthInsights = [
  { 
    title: 'Heart Health', 
    description: 'Your heart rate variability has improved by 12% over the last month, indicating better cardiac efficiency.',
    recommendation: 'Continue with your current exercise routine for optimal results.',
    confidence: 92
  },
  { 
    title: 'Sleep Quality', 
    description: 'Sleep analysis shows interrupted REM patterns which may be affecting your energy levels during the day.',
    recommendation: 'Consider reducing screen time 1 hour before bedtime.',
    confidence: 87
  },
  { 
    title: 'Stress Management', 
    description: 'Elevated cortisol levels detected based on heart rate and sleep patterns analysis.',
    recommendation: 'Incorporate 10-minute mindfulness exercises in your morning routine.',
    confidence: 83
  }
];

// Specialist recommendations based on health data
const specialistRecommendations = [
  { specialty: 'Cardiologist', reason: 'Based on your family history and recent BP readings', urgency: 'medium' },
  { specialty: 'Nutritionist', reason: 'To address recent changes in glucose levels', urgency: 'low' },
  { specialty: 'Sleep Specialist', reason: 'To improve your sleep quality and patterns', urgency: 'low' }
];

const HealthDashboard = () => {
  const [healthScore, setHealthScore] = useState(91);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-medical-500 animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-600 to-teal-600 dark:from-medical-800 dark:to-teal-800">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white">Health Dashboard</h1>
              <p className="text-medical-100">Your personalized health at a glance</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <FileText className="mr-2 h-4 w-4" /> Export Health Data
              </Button>
              <Button className="bg-white text-medical-600 hover:bg-medical-50">
                <MessageSquare className="mr-2 h-4 w-4" /> Talk to Doctor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white dark:bg-gray-800 shadow-md">
              <TabsTrigger value="overview" className="data-[state=active]:bg-medical-50 dark:data-[state=active]:bg-medical-900/40">
                Overview
              </TabsTrigger>
              <TabsTrigger value="vitals" className="data-[state=active]:bg-medical-50 dark:data-[state=active]:bg-medical-900/40">
                Vitals
              </TabsTrigger>
              <TabsTrigger value="appointments" className="data-[state=active]:bg-medical-50 dark:data-[state=active]:bg-medical-900/40">
                Appointments
              </TabsTrigger>
              <TabsTrigger value="medications" className="data-[state=active]:bg-medical-50 dark:data-[state=active]:bg-medical-900/40">
                Medications
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-medical-50 dark:data-[state=active]:bg-medical-900/40">
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Health Score Card */}
              <Card className="shadow-md bg-white dark:bg-gray-800 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-medical-50 to-teal-50 dark:from-medical-900/30 dark:to-teal-900/30 pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-lg font-medium">AI Health Score</span>
                    <Badge className={cn(
                      "text-xs font-medium",
                      healthScore >= 80 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                      healthScore >= 60 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    )}>
                      {healthScore >= 80 ? "Excellent" : 
                       healthScore >= 60 ? "Good" : "Needs Attention"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-2xl font-bold text-medical-600 dark:text-medical-400">{healthScore}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">out of 100</div>
                  </div>
                  <Progress value={healthScore} className="h-2 mb-4" />
                  
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthScoreData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" stroke="#9e9e9e" />
                        <YAxis domain={[60, 100]} stroke="#9e9e9e" />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                          dot={{ r: 4, fill: "#3b82f6" }} 
                          activeDot={{ r: 6, fill: "#3b82f6" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800/60 pt-2">
                  <div className="w-full text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                    <span>Updated daily</span>
                    <Link 
                      to="/health-score" 
                      className="flex items-center text-medical-600 dark:text-medical-400 hover:underline"
                    >
                      View details <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </CardFooter>
              </Card>

              {/* Real-time Health Alerts */}
              <Card className="shadow-md bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-medical-500" /> 
                    Health Alerts
                  </CardTitle>
                  <CardDescription>
                    AI-detected patterns requiring attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[220px]">
                    <div className="px-6">
                      {healthAlerts.map((alert, index) => (
                        <div key={alert.id} className={`py-3 ${index < healthAlerts.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                          <div className="flex items-start">
                            <div className={cn(
                              "w-2 h-2 rounded-full mt-1.5 mr-2",
                              alert.severity === 'high' ? "bg-red-500" :
                              alert.severity === 'medium' ? "bg-yellow-500" : "bg-green-500"
                            )} />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{alert.description}</p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-400">{alert.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800/60 pt-2">
                  <div className="w-full text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                    <span>Updated in real-time</span>
                    <Button variant="link" size="sm" className="text-medical-600 dark:text-medical-400 p-0 h-auto">
                      View all alerts <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Symptom Checker Integration */}
              <div className="row-span-2">
                <SymptomChecker className="h-full shadow-md" />
              </div>

              {/* AI Health Insights */}
              <Card className="shadow-md bg-white dark:bg-gray-800 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <BrainCircuit className="mr-2 h-5 w-5 text-medical-500" /> 
                    AI Health Insights
                  </CardTitle>
                  <CardDescription>
                    Personalized health analysis and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[220px]">
                    <div className="px-6">
                      {aiHealthInsights.map((insight, index) => (
                        <div key={index} className={`py-3 ${index < aiHealthInsights.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                                <Badge className="bg-medical-100 text-medical-800 dark:bg-medical-900/30 dark:text-medical-300">
                                  {insight.confidence}% Confidence
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                              <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  <span className="font-medium">AI Recommendation:</span> {insight.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800/60 pt-2">
                  <div className="w-full text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                    <span>Based on your health data and latest research</span>
                    <Button variant="link" size="sm" className="text-medical-600 dark:text-medical-400 p-0 h-auto">
                      View all insights <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Bottom cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Specialist Recommendations */}
              <Card className="shadow-md bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Users className="mr-2 h-5 w-5 text-medical-500" /> 
                    Recommended Specialists
                  </CardTitle>
                  <CardDescription>
                    Based on your health data
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {specialistRecommendations.map((rec, index) => (
                    <div key={index} className={`px-6 py-3 ${index < specialistRecommendations.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{rec.specialty}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{rec.reason}</p>
                        </div>
                        <Badge className={cn(
                          "text-xs",
                          rec.urgency === 'high' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                          rec.urgency === 'medium' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        )}>
                          {rec.urgency.charAt(0).toUpperCase() + rec.urgency.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-2 flex justify-center">
                  <Button className="w-full bg-medical-500 hover:bg-medical-600 text-white">
                    Find Specialists Near You
                  </Button>
                </CardFooter>
              </Card>

              {/* Upcoming Appointments */}
              <Card className="shadow-md bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-medical-500" /> 
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment, index) => (
                      <div key={appointment.id} className={`px-6 py-3 ${index < upcomingAppointments.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{appointment.doctorName}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{appointment.specialty}</p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">{formatDate(appointment.date)} • {appointment.time}</span>
                            </div>
                          </div>
                          <Badge className={appointment.isVideo ? 
                            "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" : 
                            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }>
                            {appointment.isVideo ? 'Video' : 'In-Person'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming appointments</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2 flex justify-center">
                  <Button variant="outline" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Schedule Appointment
                  </Button>
                </CardFooter>
              </Card>

              {/* Medication Reminders */}
              <Card className="shadow-md bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Pill className="mr-2 h-5 w-5 text-medical-500" /> 
                    Medications
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  {medications.map((medication, index) => (
                    <div key={medication.id} className={`px-6 py-3 ${index < medications.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{medication.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{medication.dosage} • {medication.frequency}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{medication.time}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Remaining</div>
                          <div className={cn(
                            "text-sm font-medium",
                            medication.remaining <= 5 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
                          )}>
                            {medication.remaining} days
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-2 flex justify-center">
                  <Button variant="outline" className="w-full">
                    <Bell className="mr-2 h-4 w-4" /> Set Medication Reminders
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-md bg-white dark:bg-gray-800 md:col-span-3">
                <CardHeader>
                  <CardTitle>Vital Signs Trends</CardTitle>
                  <CardDescription>
                    Monitor your health metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vitalSignsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate (bpm)" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line yAxisId="left" type="monotone" dataKey="bloodPressure" name="Blood Pressure (systolic)" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="oxygenLevel" name="Oxygen Level (%)" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md bg-white dark:bg-gray-800">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg font-medium">Heart Rate</CardTitle>
                    <CardDescription>Beats per minute</CardDescription>
                  </div>
                  <Heart className="h-6 w-6 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">72 <span className="text-sm font-normal text-gray-500">bpm</span></div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> Normal range
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-md bg-white dark:bg-gray-800">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg font-medium">Blood Pressure</CardTitle>
                    <CardDescription>Systolic/Diastolic</CardDescription>
                  </div>
                  <Activity className="h-6 w-6 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">120/80 <span className="text-sm font-normal text-gray-500">mmHg</span></div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> Normal range
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-md bg-white dark:bg-gray-800">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg font-medium">Oxygen Level</CardTitle>
                    <CardDescription>Blood oxygen saturation</CardDescription>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">98<span className="text-sm font-normal text-gray-500">%</span></div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> Excellent
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Additional tabs would be implemented similarly */}
          <TabsContent value="appointments">
            <div className="grid gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Manage Your Appointments</CardTitle>
                  <CardDescription>
                    View and manage your upcoming and past medical appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 my-8">Appointment content would go here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="medications">
            <div className="grid gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Medication Management</CardTitle>
                  <CardDescription>
                    Track and manage your medications and receive timely reminders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 my-8">Medication content would go here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reports">
            <div className="grid gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Health Reports</CardTitle>
                  <CardDescription>
                    Access your medical test results and health reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 my-8">Reports content would go here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthDashboard;
