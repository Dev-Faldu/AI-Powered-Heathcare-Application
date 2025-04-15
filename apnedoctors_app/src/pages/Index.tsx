import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { ArrowRight, Star, Shield, Activity, HeartPulse, Users, Brain, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground interactive dotCount={6} />
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <Features />
        
        <HowItWorks />
        
        {/* AI Diagnosis CTA Section */}
        <section className="py-16 bg-gradient-to-br from-medical-50 to-teal-50 dark:from-medical-900/20 dark:to-teal-900/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto glass-card p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-medical-500 to-teal-500 flex items-center justify-center text-white mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                  <Brain className="w-12 h-12 md:w-16 md:h-16" />
                </div>
                
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Advanced AI Symptom Analysis
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Our medical AI can analyze your symptoms in real-time, provide instant insights, and suggest potential conditions with confidence scores.
                  </p>
                  <Link 
                    to="/diagnosis" 
                    className="glass-button inline-flex items-center"
                  >
                    Try AI Diagnosis <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-medical-50 to-teal-50 dark:from-medical-900/20 dark:to-teal-900/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">
                Trusted by <span className="gradient-text">Thousands</span> of Patients
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                See what our users have to say about their experience with ApneDoctors.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "The AI diagnosis was incredibly accurate. It helped me understand my condition before I even talked to a doctor.",
                  author: "Priya Sharma",
                  role: "Patient",
                  rating: 5
                },
                {
                  quote: "As a doctor, this platform streamlines my workflow and helps me provide better care to more patients. The AI triage is excellent.",
                  author: "Dr. Rajesh Kumar",
                  role: "Cardiologist",
                  rating: 5
                },
                {
                  quote: "Managing my diabetes has never been easier. The app sends me timely reminders and the doctors are always available for consultation.",
                  author: "Amit Patel",
                  role: "Patient",
                  rating: 4
                }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="glass-card p-8 flex flex-col animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className={i < testimonial.rating 
                          ? "text-yellow-500 fill-yellow-500" 
                          : "text-gray-300 dark:text-gray-600"
                        } 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">"{testimonial.quote}"</p>
                  <div className="mt-auto">
                    <p className="font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">
                Making <span className="gradient-text">Healthcare</span> Accessible
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Breaking barriers and improving healthcare outcomes for everyone.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Users className="h-8 w-8 text-medical-500" />,
                  stat: "50k+",
                  label: "Patients Helped"
                },
                {
                  icon: <HeartPulse className="h-8 w-8 text-medical-500" />,
                  stat: "95%",
                  label: "Accurate Diagnoses"
                },
                {
                  icon: <Activity className="h-8 w-8 text-teal-500" />,
                  stat: "24/7",
                  label: "AI Availability"
                },
                {
                  icon: <Shield className="h-8 w-8 text-teal-500" />,
                  stat: "100%",
                  label: "HIPAA Compliant"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="glass-card p-6 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{item.stat}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-medical-500 to-teal-500 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Healthcare Experience?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of patients and healthcare professionals who are already benefiting from ApneDoctors.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/signup" 
                  className="px-8 py-4 bg-white text-medical-600 rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-lg text-lg font-medium"
                >
                  Get Started
                </Link>
                <Link 
                  to="/diagnosis" 
                  className="px-8 py-4 bg-transparent border border-white rounded-xl hover:bg-white/10 transition-colors duration-300 text-lg font-medium flex items-center justify-center"
                >
                  Try AI Diagnosis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
