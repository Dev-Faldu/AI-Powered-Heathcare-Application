import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuizSymptomChecker } from '@/components/ai/symptom-checker';
import { Switch } from '@/components/ui/switch';
import { 
  Search, Filter, MapPin, Star, Clock, MessageSquare, Video, 
  CheckCircle, Stethoscope, Languages, Calendar, RefreshCw
} from 'lucide-react';
import { Doctor } from '@/types/medical';
import { useToast } from '@/hooks/use-toast';

const fetchDoctors = async (): Promise<Doctor[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 'doc-1',
      userId: 'user-doc-1',
      name: 'Dr. Sarah Chen',
      specialty: 'General Practitioner',
      licenseNumber: 'MBBS12345',
      profileImage: 'https://randomuser.me/api/portraits/women/5.jpg',
      experience: 2,
      rating: 4.8,
      facility: 'ApneDoctors Virtual Clinic',
      qualifications: ['MBBS', 'Medical Resident'],
      languages: ['English', 'Hindi'],
      acceptingNewPatients: true,
      telemedicineAvailable: true,
      consultationFee: 150,
      nextAvailableSlot: '2023-08-12T10:00:00',
      isOnline: true,
      lastActive: new Date().toISOString(),
      availabilityStatus: 'online',
      totalEarnings: 12000,
    },
    {
      id: 'doc-2',
      userId: 'user-doc-2',
      name: 'Dr. Michael Rodriguez',
      specialty: 'Pulmonologist',
      licenseNumber: 'MBBS54321',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      experience: 1,
      rating: 4.7,
      facility: 'ApneDoctors Virtual Clinic',
      qualifications: ['MBBS', 'PG Resident - Pulmonology'],
      languages: ['English', 'Spanish'],
      acceptingNewPatients: true,
      telemedicineAvailable: true,
      consultationFee: 150,
      nextAvailableSlot: '2023-08-10T14:30:00',
      isOnline: true,
      lastActive: new Date().toISOString(),
      availabilityStatus: 'online',
      totalEarnings: 9500,
    },
    {
      id: 'doc-3',
      userId: 'user-doc-3',
      name: 'Dr. Emily Johnson',
      specialty: 'Dermatologist',
      licenseNumber: 'MBBS67890',
      profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
      experience: 3,
      rating: 4.9,
      facility: 'ApneDoctors Virtual Clinic',
      qualifications: ['MBBS', 'PG Resident - Dermatology'],
      languages: ['English', 'Gujarati'],
      acceptingNewPatients: true,
      telemedicineAvailable: true,
      consultationFee: 150,
      nextAvailableSlot: '2023-08-09T09:15:00',
      isOnline: false,
      lastActive: new Date(Date.now() - 15 * 60000).toISOString(),
      availabilityStatus: 'offline',
      totalEarnings: 15000,
    },
    {
      id: 'doc-4',
      userId: 'user-doc-4',
      name: 'Dr. Aditya Sharma',
      specialty: 'Pediatrician',
      licenseNumber: 'MBBS09876',
      profileImage: 'https://randomuser.me/api/portraits/men/22.jpg',
      experience: 2,
      rating: 4.6,
      facility: 'ApneDoctors Virtual Clinic',
      qualifications: ['MBBS', 'PG Resident - Pediatrics'],
      languages: ['English', 'Hindi', 'Bengali'],
      acceptingNewPatients: true,
      telemedicineAvailable: true,
      consultationFee: 150,
      nextAvailableSlot: '2023-08-11T11:00:00',
      isOnline: true,
      lastActive: new Date().toISOString(),
      availabilityStatus: 'online',
      totalEarnings: 8000,
    },
  ];
};

const FindDoctors = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState<string>('all-specialties');
  const [language, setLanguage] = useState<string>('all-languages');
  const [sortBy, setSortBy] = useState<string>('availability');
  const [activeTab, setActiveTab] = useState<string>('doctors');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data: doctors = [], isLoading, error, refetch } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    
    toast({
      title: "Doctors list refreshed",
      description: "Showing the most up-to-date availability.",
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (showOnlyAvailable && !doctor.isOnline) {
      return false;
    }
    
    const matchesSearch = searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = specialty === 'all-specialties' || doctor.specialty === specialty;
    
    const matchesLanguage = language === 'all-languages' || doctor.languages.includes(language);
    
    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.experience - a.experience;
      case 'availability':
      default:
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        if (a.isOnline && b.isOnline) {
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        }
        return new Date(a.nextAvailableSlot).getTime() - new Date(b.nextAvailableSlot).getTime();
    }
  });

  const handleBookAppointment = (doctor: Doctor) => {
    if (!doctor.isOnline) {
      toast({
        title: "Doctor Unavailable",
        description: "This doctor is currently offline. Please choose an available doctor.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Connecting to Doctor",
      description: "Your symptom report has been sent to the doctor. Starting video consultation now.",
    });
    
    navigate(`/video-consultation?doctor=${doctor.id}`);
  };

  const handleDoctorSelection = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setActiveTab('doctors');
    
    toast({
      title: "Doctor Recommended",
      description: "Based on your symptoms, we've recommended a doctor for you.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">
        Connect with a Doctor Now
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Instantly consult with available MBBS graduates and PG residents. All consultations are fixed at ₹150.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="doctors" className="text-lg py-3">
            Available Doctors
          </TabsTrigger>
          <TabsTrigger value="symptom-checker" className="text-lg py-3">
            Symptom Checker
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="doctors" className="mt-0">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className={`flex items-center gap-2 ${isRefreshing ? 'animate-spin text-medical-500' : ''}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} /> Refresh
              </Button>
              
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-specialties">All Specialties</SelectItem>
                  <SelectItem value="General Practitioner">General Practitioner</SelectItem>
                  <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                  <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="Pulmonologist">Pulmonologist</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-languages">All Languages</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="Bengali">Bengali</SelectItem>
                  <SelectItem value="Gujarati">Gujarati</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="availability">Recently Active</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Switch 
                id="available-doctors" 
                checked={showOnlyAvailable} 
                onCheckedChange={setShowOnlyAvailable} 
              />
              <label 
                htmlFor="available-doctors" 
                className="text-sm font-medium cursor-pointer"
              >
                Show only available doctors
              </label>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredDoctors.filter(d => d.isOnline).length} doctors online now
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              Failed to load doctors. Please try again later.
            </div>
          ) : sortedDoctors.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No doctors match your search criteria.</p>
              <Button onClick={() => {
                setSearchQuery('');
                setSpecialty('all-specialties');
                setLanguage('all-languages');
                setShowOnlyAvailable(false);
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedDoctors.map((doctor) => (
                <Card key={doctor.id} className={`overflow-hidden border ${selectedDoctorId === doctor.id ? 'border-medical-500 ring-2 ring-medical-500/30' : ''} ${doctor.isOnline ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900/50 opacity-75'}`}>
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img 
                          src={doctor.profileImage} 
                          alt={doctor.name} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800"
                        />
                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${doctor.isOnline ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white dark:border-gray-900`}></span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{doctor.name}</h3>
                          {doctor.isOnline && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                              Online Now
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Stethoscope size={16} />
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="text-yellow-500" size={16} fill="currentColor" />
                          <span className="font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-wrap gap-1">
                        {doctor.qualifications.map((qualification, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            {qualification}
                          </Badge>
                        ))}
                      </div>
                      
                      {doctor.isOnline ? (
                        <div className="flex items-center text-green-600 dark:text-green-400 text-sm gap-1">
                          <Clock size={16} />
                          <span>Available for instant consultation</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm gap-1">
                          <Clock size={16} />
                          <span>Next available: {new Date(doctor.nextAvailableSlot).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm gap-1">
                        <Languages size={16} />
                        <span>Speaks: {doctor.languages.join(', ')}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm gap-1">
                        <MapPin size={16} />
                        <span>{doctor.facility}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Consultation Fee</p>
                        <p className="font-semibold text-xl">₹{doctor.consultationFee}</p>
                      </div>
                      
                      <Button 
                        onClick={() => handleBookAppointment(doctor)} 
                        className="gap-2"
                        disabled={!doctor.isOnline}
                        variant={doctor.isOnline ? "default" : "outline"}
                      >
                        <Video size={18} />
                        {doctor.isOnline ? "Consult Now" : "Unavailable"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="symptom-checker" className="mt-0">
          <div className="max-w-3xl mx-auto">
            <QuizSymptomChecker 
              onDiagnosisComplete={(result) => {
                if (doctors.length > 0) {
                  const availableDoctor = doctors.find(doc => doc.isOnline);
                  
                  if (availableDoctor) {
                    handleDoctorSelection(availableDoctor.id);
                  } else {
                    toast({
                      title: "No Doctors Available",
                      description: "There are currently no doctors available. Please try again later.",
                      variant: "destructive",
                    });
                  }
                }
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FindDoctors;
