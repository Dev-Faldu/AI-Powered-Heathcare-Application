
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Patient, DiagnosisReport, Prescription, DoctorEarnings, EarningsDataPoint } from '@/types/medical';
import { Calendar, Clock, FileText, Video, AlertCircle, Check, FileCheck, User, Users, Activity, TrendingUp, Award, Heart } from 'lucide-react';

const DoctorDashboard = () => {
  // Sample data for demonstration
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "p1",
      userId: "user1", // Added userId
      name: "John Smith",
      age: 35,
      gender: "male",
      contactInfo: {
        phone: "555-0123",
        email: "john@example.com"
      },
      waitingSince: "2023-04-23T09:15:00Z",
      aiGeneratedReport: {
        id: "report1",
        patientId: "p1",
        createdAt: "2023-04-23T09:10:00Z",
        symptoms: ["fever", "cough", "fatigue"],
        possibleConditions: [
          { name: "Common Cold", probability: 0.75, severity: "low" },
          { name: "Influenza", probability: 0.45, severity: "medium" },
          { name: "COVID-19", probability: 0.15, severity: "high" }
        ],
        recommendedTests: ["Complete Blood Count", "Chest X-Ray"],
        aiGeneratedNotes: "Patient shows symptoms consistent with upper respiratory infection. Consider antiviral medication if symptoms persist beyond 48 hours."
      }
    },
    {
      id: "p2",
      userId: "user2", // Added userId
      name: "Sarah Johnson",
      age: 42,
      gender: "female",
      contactInfo: {
        phone: "555-0456",
        email: "sarah@example.com"
      },
      waitingSince: "2023-04-23T09:30:00Z",
      aiGeneratedReport: {
        id: "report2",
        patientId: "p2",
        createdAt: "2023-04-23T09:25:00Z",
        symptoms: ["headache", "dizziness", "blurred vision"],
        possibleConditions: [
          { name: "Migraine", probability: 0.82, severity: "medium" },
          { name: "Hypertension", probability: 0.35, severity: "medium" }
        ],
        recommendedTests: ["Blood Pressure Monitoring", "Neurological Examination"],
        aiGeneratedNotes: "Patient reports recurring headaches increasing in frequency over the past month. Consider preventative medication and lifestyle modifications."
      }
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescription, setPrescription] = useState<Prescription>({
    id: "",
    consultationId: "", // Added consultationId
    patientId: "",
    doctorId: "d1",
    createdAt: new Date().toISOString(),
    medications: [],
    instructions: "",
    followUpDate: ""
  });

  // Mock data for financial analytics
  const [earnings, setEarnings] = useState<DoctorEarnings>({
    daily: 750,
    weekly: 4500,
    monthly: 18000,
    total: 89250,
    consultationCount: 595,
    averageRating: 4.8,
    averageConsultationTime: 12
  });

  // Mock data for earnings chart
  const earningsData: EarningsDataPoint[] = [
    { date: "Mon", amount: 600, consultations: 4 },
    { date: "Tue", amount: 900, consultations: 6 },
    { date: "Wed", amount: 750, consultations: 5 },
    { date: "Thu", amount: 1200, consultations: 8 },
    { date: "Fri", amount: 600, consultations: 4 },
    { date: "Sat", amount: 450, consultations: 3 },
    { date: "Sun", amount: 300, consultations: 2 }
  ];

  const monthlyEarningsData: EarningsDataPoint[] = [
    { date: "Jan", amount: 15000, consultations: 100 },
    { date: "Feb", amount: 12000, consultations: 80 },
    { date: "Mar", amount: 18000, consultations: 120 },
    { date: "Apr", amount: 22500, consultations: 150 }
  ];

  // Function to start consultation with a patient
  const startConsultation = (patient: Patient) => {
    setSelectedPatient(patient);
    setPrescription({
      id: `pres-${Date.now()}`,
      consultationId: `cons-${Date.now()}`, // Added consultationId
      patientId: patient.id,
      doctorId: "d1",
      createdAt: new Date().toISOString(),
      medications: [],
      instructions: "",
      followUpDate: ""
    });
  };

  // Function to generate prescription
  const generatePrescription = () => {
    if (selectedPatient?.aiGeneratedReport) {
      // Create a prescription based on AI-generated report
      const newPrescription: Prescription = {
        id: `pres-${Date.now()}`,
        consultationId: `cons-${Date.now()}`,
        patientId: selectedPatient.id,
        doctorId: "d1",
        createdAt: new Date().toISOString(),
        medications: [
          {
            name: "Antibiotic",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "7 days",
            notes: "Take after meals"
          }
        ],
        instructions: "Rest well and drink plenty of fluids",
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      setPrescription(newPrescription);
    }
  };

  // Function to complete consultation and remove patient from queue
  const completeConsultation = () => {
    if (selectedPatient) {
      setPatients(patients.filter(p => p.id !== selectedPatient.id));
      setSelectedPatient(null);
    }
  };

  // Specialty distribution for pie chart
  const specialtyData = [
    { name: "General Medicine", value: 45 },
    { name: "Dermatology", value: 15 },
    { name: "Pediatrics", value: 20 },
    { name: "Orthopedics", value: 10 },
    { name: "Other", value: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="patients" className="text-lg px-4 py-2">Patient Queue</TabsTrigger>
          <TabsTrigger value="finances" className="text-lg px-4 py-2">Finances</TabsTrigger>
          <TabsTrigger value="insights" className="text-lg px-4 py-2">AI Insights</TabsTrigger>
        </TabsList>
        
        {/* Patient Queue Tab */}
        <TabsContent value="patients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Queue Panel */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" />
                  Patient Queue
                </CardTitle>
                <CardDescription>
                  {patients.length} patients waiting for consultation
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {patients.length > 0 ? (
                  <div className="space-y-4">
                    {patients.map(patient => (
                      <Card key={patient.id} className="cursor-pointer hover:bg-slate-50 transition-colors">
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">{patient.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  {patient.age} years, {patient.gender}
                                </CardDescription>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startConsultation(patient)}
                            >
                              Consult
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-0">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              Waiting since: {new Date(patient.waitingSince!).toLocaleTimeString()}
                            </div>
                            {patient.aiGeneratedReport && (
                              <div className="flex items-center text-muted-foreground">
                                <FileText className="h-4 w-4 mr-1" />
                                AI Report Available
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="py-2">
                          <div className="flex flex-wrap gap-1">
                            {patient.aiGeneratedReport?.symptoms.slice(0, 3).map((symptom, i) => (
                              <span key={i} className="bg-slate-100 text-xs rounded-full px-2 py-1">
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No patients in queue
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Patient Consultation View */}
            <Card className="col-span-1 lg:col-span-2">
              {selectedPatient ? (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center">
                          <User className="mr-2" />
                          {selectedPatient.name}
                        </CardTitle>
                        <CardDescription>
                          {selectedPatient.age} years, {selectedPatient.gender} • 
                          {selectedPatient.contactInfo.phone ? ` ${selectedPatient.contactInfo.phone} • ` : ' '}
                          {selectedPatient.contactInfo.email}
                        </CardDescription>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Start Video
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Patient History
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* AI Report Summary */}
                    {selectedPatient.aiGeneratedReport && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <FileCheck className="h-5 w-5 mr-2" />
                          AI-Generated Report
                        </h3>
                        
                        <Card>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base">Symptoms & Analysis</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-sm mb-1">Reported Symptoms:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {selectedPatient.aiGeneratedReport.symptoms.map((symptom, i) => (
                                    <span key={i} className="bg-slate-100 rounded-full px-2 py-1 text-sm">
                                      {symptom}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-sm mb-1">Possible Conditions:</h4>
                                <div className="space-y-2">
                                  {selectedPatient.aiGeneratedReport.possibleConditions.map((condition, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className={`h-2 w-2 rounded-full mr-2 ${
                                          condition.severity === 'high' ? 'bg-red-500' : 
                                          condition.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} />
                                        <span>{condition.name}</span>
                                      </div>
                                      <span className="text-sm text-muted-foreground">
                                        {Math.round(condition.probability * 100)}%
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {selectedPatient.aiGeneratedReport.recommendedTests && (
                                <div>
                                  <h4 className="font-medium text-sm mb-1">Recommended Tests:</h4>
                                  <ul className="list-disc list-inside text-sm">
                                    {selectedPatient.aiGeneratedReport.recommendedTests.map((test, i) => (
                                      <li key={i}>{test}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="py-3 border-t bg-slate-50">
                            <div className="w-full">
                              <h4 className="font-medium text-sm mb-1">AI Notes:</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedPatient.aiGeneratedReport.aiGeneratedNotes}
                              </p>
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                    
                    {/* Prescription Generation */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Prescription
                        </h3>
                        <Button size="sm" onClick={generatePrescription}>
                          Auto-Generate
                        </Button>
                      </div>
                      
                      <Card>
                        <CardContent className="py-4 space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Medications:</h4>
                            {prescription.medications.length > 0 ? (
                              <div className="space-y-2">
                                {prescription.medications.map((med, i) => (
                                  <div key={i} className="bg-slate-50 p-3 rounded-md">
                                    <div className="font-medium">{med.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {med.dosage} • {med.frequency} • {med.duration}
                                    </div>
                                    {med.notes && (
                                      <div className="text-sm mt-1">Note: {med.notes}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                No medications added yet
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-2">Instructions:</h4>
                            <div className="text-sm border rounded-md p-2 min-h-[50px]">
                              {prescription.instructions || "No instructions added yet"}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-2">Follow-up Date:</h4>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">
                                {prescription.followUpDate ? new Date(prescription.followUpDate).toLocaleDateString() : "Not scheduled"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button variant="outline">Save Draft</Button>
                    <div className="space-x-2">
                      <Button variant="outline">
                        Download PDF
                      </Button>
                      <Button onClick={completeConsultation}>
                        Complete Consultation
                      </Button>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Active Consultation</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Select a patient from the queue to start a consultation and 
                    view their AI-generated report.
                  </p>
                  <Button variant="outline">
                    View Consultation History
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
        
        {/* Finances Tab */}
        <TabsContent value="finances">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="py-4">
                <CardDescription>Today's Earnings</CardDescription>
                <CardTitle className="text-2xl">₹{earnings.daily}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardDescription>Weekly Earnings</CardDescription>
                <CardTitle className="text-2xl">₹{earnings.weekly}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardDescription>Monthly Earnings</CardDescription>
                <CardTitle className="text-2xl">₹{earnings.monthly}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardDescription>Total Earnings</CardDescription>
                <CardTitle className="text-2xl">₹{earnings.total}</CardTitle>
              </CardHeader>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Daily earnings for the last week</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Consultation Statistics</CardTitle>
                <CardDescription>Performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Total Consultations
                  </div>
                  <div className="text-2xl font-semibold">{earnings.consultationCount}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Average Rating
                  </div>
                  <div className="text-2xl font-semibold flex items-center">
                    {earnings.averageRating}
                    <div className="flex ml-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`h-4 w-4 ${i < Math.floor(earnings.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Average Consultation Time
                  </div>
                  <div className="text-2xl font-semibold">
                    {earnings.averageConsultationTime} min
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* AI Insights Tab */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Practice Insights</CardTitle>
                <CardDescription>AI-powered analysis of your practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-slate-50">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      Monthly Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyEarningsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="amount" stroke="#8884d8" name="Earnings (₹)" />
                        <Line yAxisId="right" type="monotone" dataKey="consultations" stroke="#82ca9d" name="Consultations" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-blue-500" />
                        Patient Demographics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={specialtyData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {specialtyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center">
                        <Award className="h-5 w-5 mr-2 text-yellow-500" />
                        Your Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Response Time</span>
                            <span className="text-sm font-medium">Excellent</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[90%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Patient Satisfaction</span>
                            <span className="text-sm font-medium">Very Good</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[85%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Follow-up Rate</span>
                            <span className="text-sm font-medium">Good</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[70%]"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Personalized insights to grow your practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                      Growth Opportunity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm">
                      Based on your consultation patterns, extending your availability by 2 hours on weekends could increase your earnings by approximately 15%.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-green-500" />
                      Patient Care Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm">
                      Your patients report high satisfaction with your explanations. Continue this practice and consider adding more visual aids during consultations.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                      Training Suggestion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm">
                      Consider enhancing your knowledge in dermatological conditions. There's been a 30% increase in skin-related consultations in your area.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Full AI Analysis</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
