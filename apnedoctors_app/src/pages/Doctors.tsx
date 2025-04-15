
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { cn } from '@/lib/utils';
import { 
  MapPin, 
  Calendar, 
  Video, 
  Star, 
  Clock, 
  Filter,
  Search,
  Phone,
  Mail,
  Globe,
  FileText,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Clock4,
  Languages,
  Award,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Doctor, HealthcareFacility } from '@/types/medical';
import { diagnosisService, DiagnosisResult, Symptom } from '@/services/DiagnosisService';

const Doctors = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [appointmentType, setAppointmentType] = useState<'all' | 'in-person' | 'telemedicine'>('all');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  
  // Extract diagnosis result from location state if available
  useEffect(() => {
    if (location.state?.diagnosisResult) {
      setDiagnosisResult(location.state.diagnosisResult);
      
      // Load recommended doctors based on diagnosis
      if (location.state.diagnosisResult.suggestedSpecialists?.length > 0) {
        loadDoctors(location.state.diagnosisResult.suggestedSpecialists);
      } else {
        loadDoctors(['General Practitioner']);
      }
    } else {
      loadDoctors(['General Practitioner']);
    }
    
    // Load healthcare facilities
    loadFacilities(['General Medicine', 'Family Medicine']);
  }, [location]);
  
  const loadDoctors = async (specialistTypes: string[]) => {
    setLoadingDoctors(true);
    try {
      const results = await diagnosisService.getRecommendedDoctors(specialistTypes);
      setDoctors(results);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recommended doctors',
        variant: 'destructive',
      });
    } finally {
      setLoadingDoctors(false);
    }
  };
  
  const loadFacilities = async (specialties: string[]) => {
    try {
      const results = await diagnosisService.getHealthcareFacilities(specialties);
      setFacilities(results);
    } catch (error) {
      console.error('Error loading facilities:', error);
    }
  };
  
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: 'Incomplete Information',
        description: 'Please select a date and time for your appointment',
        variant: 'destructive',
      });
      return;
    }
    
    setBookingInProgress(true);
    
    try {
      const result = await diagnosisService.bookAppointment(
        selectedDoctor.id,
        'patient-123', // In a real app, this would be the current user's ID
        selectedDate,
        selectedTime,
        appointmentType === 'telemedicine' ? 'telemedicine' : 'in-person'
      );
      
      if (result.success) {
        toast({
          title: 'Appointment Booked',
          description: result.message,
        });
        setAppointmentModalOpen(false);
      } else {
        toast({
          title: 'Booking Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while booking your appointment',
        variant: 'destructive',
      });
    } finally {
      setBookingInProgress(false);
    }
  };
  
  const filteredDoctors = doctors.filter(doctor => {
    // Filter by search query (name or specialty)
    const matchesSearch = searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by specialty
    const matchesSpecialty = specialty === '' || doctor.specialty === specialty;
    
    // Filter by appointment type
    const matchesAppointmentType = 
      appointmentType === 'all' || 
      (appointmentType === 'telemedicine' && doctor.telemedicineAvailable) ||
      (appointmentType === 'in-person' && true); // All doctors support in-person by default
    
    return matchesSearch && matchesSpecialty && matchesAppointmentType;
  });
  
  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    // In a real app, this would fetch actual availability from a backend API
    return [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
    ];
  };
  
  // Get all unique specialties from the doctors list
  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
  
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground dotCount={4} />
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block rounded-full bg-medical-100 dark:bg-medical-900/30 px-4 py-1.5 mb-4 animate-fade-in">
                <span className="text-medical-700 dark:text-medical-400 text-sm font-medium">
                  Healthcare Network
                </span>
              </span>
              <h1 className="font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
                Find <span className="gradient-text">Specialists</span> & Book Appointments
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
                Connect with top-rated healthcare providers specializing in your condition and book appointments instantly
              </p>
            </div>
            
            {diagnosisResult && (
              <div className="glass-card p-6 mb-8 animate-fade-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Based on Your Recent Diagnosis
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We've found specialists who can help with your condition: 
                      <span className="font-medium text-medical-600 dark:text-medical-400 ml-1">
                        {diagnosisResult.conditions[0]?.name}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/diagnosis')}
                    >
                      View Full Diagnosis
                    </Button>
                    <Button 
                      variant="default" 
                      className="bg-medical-500 hover:bg-medical-600 text-white"
                      onClick={() => window.scrollTo({
                        top: document.getElementById('doctors-list')?.offsetTop ?? 0,
                        behavior: 'smooth'
                      })}
                    >
                      See Recommended Doctors
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="glass-card p-6 mb-8 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Search by doctor name or specialty"
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-64">
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Specialties</SelectItem>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-64">
                  <Select 
                    value={appointmentType} 
                    onValueChange={(value) => setAppointmentType(value as 'all' | 'in-person' | 'telemedicine')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Appointment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="in-person">In-Person Only</SelectItem>
                      <SelectItem value="telemedicine">Telemedicine Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6" id="doctors-list">
                  {loadingDoctors ? 'Loading Doctors...' : `${filteredDoctors.length} Doctors Found`}
                </h2>
                
                {loadingDoctors ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="glass-card p-6 animate-pulse">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No doctors found matching your criteria</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('');
                        setSpecialty('');
                        setAppointmentType('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    {filteredDoctors.map((doctor) => (
                      <div key={doctor.id} className="glass-card p-6 transition-all hover:shadow-lg">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                            <img 
                              src={doctor.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(doctor.name) + '&background=0D8ABC&color=fff'}
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{doctor.name}</h3>
                              <div className="flex items-center">
                                <Star className="text-yellow-500 w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">{doctor.rating}/5</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-medical-600 dark:text-medical-400 mb-2">{doctor.specialty}</p>
                            
                            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <div className="flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                <span>{doctor.experience} years exp.</span>
                              </div>
                              <div className="flex items-center">
                                <Clock4 className="w-4 h-4 mr-1" />
                                <span>Next: {new Date(doctor.nextAvailableSlot || '').toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                <span>${doctor.consultationFee}/visit</span>
                              </div>
                              {doctor.telemedicineAvailable && (
                                <div className="flex items-center text-medical-600 dark:text-medical-400">
                                  <Video className="w-4 h-4 mr-1" />
                                  <span>Telemedicine</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              <Button 
                                variant="outline" 
                                className="text-xs h-8"
                                onClick={() => setSelectedDoctor(doctor)}
                              >
                                View Profile
                              </Button>
                              <Button 
                                variant="default" 
                                className="text-xs h-8 bg-medical-500 hover:bg-medical-600 text-white"
                                onClick={() => {
                                  setSelectedDoctor(doctor);
                                  setAppointmentModalOpen(true);
                                }}
                              >
                                Book Appointment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-6 animate-fade-in">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Healthcare Facilities</h3>
                  <div className="space-y-4">
                    {facilities.slice(0, 3).map((facility) => (
                      <div key={facility.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">{facility.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}</p>
                        
                        {facility.location && (
                          <div className="flex items-start mb-2">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {facility.location.address}, {facility.location.city}, {facility.location.state}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-3">
                          {facility.contactInfo.phone && (
                            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                              <Phone className="w-3 h-3 mr-1" /> Call
                            </Button>
                          )}
                          {facility.contactInfo.website && (
                            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                              <Globe className="w-3 h-3 mr-1" /> Website
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Facilities <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Healthcare Options</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mr-3 mt-0.5">
                        <Video className="h-4 w-4 text-medical-600 dark:text-medical-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Telemedicine</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get virtual care from home with video consultations
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mr-3 mt-0.5">
                        <Calendar className="h-4 w-4 text-medical-600 dark:text-medical-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Same-day Appointments</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Many providers offer same-day or next-day visits
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mr-3 mt-0.5">
                        <FileText className="h-4 w-4 text-medical-600 dark:text-medical-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Medical Records</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Share your diagnosis results with healthcare providers
                        </p>
                      </div>
                    </li>
                  </ul>
                  
                  <Button className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white">
                    Run New Symptom Analysis <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Doctor Profile Dialog */}
      {selectedDoctor && (
        <Dialog open={!!selectedDoctor && !appointmentModalOpen} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Doctor Profile</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                  <img 
                    src={selectedDoctor.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedDoctor.name) + '&background=0D8ABC&color=fff'}
                    alt={selectedDoctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-xl font-medium text-center mb-1">{selectedDoctor.name}</h3>
                <p className="text-medical-600 dark:text-medical-400 text-center mb-4">{selectedDoctor.specialty}</p>
                
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-5 h-5", 
                        i < Math.floor(selectedDoctor.rating) 
                          ? "text-yellow-500 fill-yellow-500" 
                          : i < selectedDoctor.rating 
                            ? "text-yellow-500 fill-yellow-500 opacity-50" 
                            : "text-gray-300 dark:text-gray-700"
                      )} 
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{selectedDoctor.rating}/5</span>
                </div>
                
                <Button 
                  className="w-full bg-medical-500 hover:bg-medical-600 text-white"
                  onClick={() => {
                    setAppointmentModalOpen(true);
                  }}
                >
                  Book Appointment
                </Button>
                
                {selectedDoctor.telemedicineAvailable && (
                  <Button 
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                      setAppointmentType('telemedicine');
                      setAppointmentModalOpen(true);
                    }}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Schedule Telemedicine
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  className="w-full mt-2"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>
              
              <div className="md:col-span-2">
                <Tabs defaultValue="about">
                  <TabsList className="w-full">
                    <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
                    <TabsTrigger value="education" className="flex-1">Education & Experience</TabsTrigger>
                    <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">About {selectedDoctor.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Dr. {selectedDoctor.name.split(' ')[1]} is a board-certified {selectedDoctor.specialty} with {selectedDoctor.experience} years of clinical experience. 
                      {selectedDoctor.specialty === 'General Practitioner' && 
                        ' They specialize in preventative care, managing chronic conditions, and comprehensive health assessments.'}
                      {selectedDoctor.specialty === 'Pulmonologist' && 
                        ' They specialize in the diagnosis and treatment of lung conditions, including asthma, COPD, and respiratory infections.'}
                      {selectedDoctor.specialty === 'Allergist' && 
                        ' They specialize in diagnosing and treating allergies, asthma, and immunological disorders.'}
                      {selectedDoctor.specialty === 'Infectious Disease Specialist' && 
                        ' They specialize in diagnosing and treating complex infections, particularly those that are difficult to diagnose or don\'t respond to standard treatments.'}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Languages</h5>
                        <div className="flex gap-2">
                          {selectedDoctor.languages.map(language => (
                            <span 
                              key={language} 
                              className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Practice</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedDoctor.facility}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Availability</h5>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Next available: {new Date(selectedDoctor.nextAvailableSlot || '').toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>Consultation fee: ${selectedDoctor.consultationFee}</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="education" className="mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Qualifications</h4>
                    <ul className="space-y-3 mb-6">
                      {selectedDoctor.qualifications.map((qualification, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mr-3 mt-0.5">
                            <Award className="h-3 w-3 text-medical-600 dark:text-medical-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{qualification}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Experience</h4>
                    <div className="space-y-4">
                      <div className="border-l-2 border-medical-500 pl-4 ml-3 pb-1">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200">{selectedDoctor.facility}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedDoctor.specialty}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {2023 - selectedDoctor.experience} - Present
                        </p>
                      </div>
                      
                      <div className="border-l-2 border-gray-300 dark:border-gray-700 pl-4 ml-3">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200">Previous Experience</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedDoctor.experience > 10 ? 'Senior ' : ''}{selectedDoctor.specialty}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {2023 - selectedDoctor.experience - 5} - {2023 - selectedDoctor.experience}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Patient Reviews</h4>
                      <Button variant="outline" size="sm">Write a Review</Button>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        {
                          name: 'Sarah M.',
                          rating: 5,
                          date: '2 months ago',
                          comment: `Dr. ${selectedDoctor.name.split(' ')[1]} was incredibly thorough and took the time to listen to all my concerns. The diagnosis was spot on and the treatment plan worked perfectly.`
                        },
                        {
                          name: 'Michael T.',
                          rating: 4,
                          date: '4 months ago',
                          comment: `Very knowledgeable doctor with great bedside manner. The wait time was a bit long, but the quality of care was worth it.`
                        },
                        {
                          name: 'Jessica K.',
                          rating: 5,
                          date: '6 months ago',
                          comment: `I've been seeing Dr. ${selectedDoctor.name.split(' ')[1]} for years and always receive excellent care. Highly recommended!`
                        }
                      ].map((review, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-800 dark:text-gray-200">{review.name}</h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "w-4 h-4", 
                                    i < review.rating 
                                      ? "text-yellow-500 fill-yellow-500" 
                                      : "text-gray-300 dark:text-gray-700"
                                  )} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      Load More Reviews
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Appointment Booking Dialog */}
      <Dialog open={appointmentModalOpen} onOpenChange={setAppointmentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>
              Select your preferred date and time for an appointment with {selectedDoctor?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Appointment Type
              </label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <Checkbox 
                    id="appointment-type-in-person" 
                    checked={appointmentType !== 'telemedicine'}
                    onCheckedChange={() => setAppointmentType('in-person')}
                  />
                  <label 
                    htmlFor="appointment-type-in-person" 
                    className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    In-Person
                  </label>
                </div>
                
                <div className="flex items-center">
                  <Checkbox 
                    id="appointment-type-telemedicine" 
                    checked={appointmentType === 'telemedicine'}
                    disabled={!selectedDoctor?.telemedicineAvailable}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAppointmentType('telemedicine');
                      } else {
                        setAppointmentType('in-person');
                      }
                    }}
                  />
                  <label 
                    htmlFor="appointment-type-telemedicine" 
                    className={`ml-2 text-sm ${
                      !selectedDoctor?.telemedicineAvailable 
                        ? 'text-gray-400 dark:text-gray-600' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Telemedicine
                    {!selectedDoctor?.telemedicineAvailable && ' (Not available)'}
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Date
              </label>
              <Input 
                type="date" 
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Time
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {getAvailableTimeSlots().map((time) => (
                  <Button 
                    key={time}
                    type="button"
                    variant={selectedTime === time ? 'default' : 'outline'}
                    className={cn(
                      "text-sm h-9",
                      selectedTime === time ? "bg-medical-500 hover:bg-medical-600 text-white" : ""
                    )}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 mt-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Appointment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
                  <span className="text-gray-900 dark:text-gray-100">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Specialty:</span>
                  <span className="text-gray-900 dark:text-gray-100">{selectedDoctor?.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {appointmentType === 'telemedicine' ? 'Telemedicine' : 'In-Person'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {selectedTime || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Fee:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">${selectedDoctor?.consultationFee}</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAppointmentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-medical-500 hover:bg-medical-600 text-white"
              disabled={!selectedDate || !selectedTime || bookingInProgress}
              onClick={handleBookAppointment}
            >
              {bookingInProgress ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Doctors;
