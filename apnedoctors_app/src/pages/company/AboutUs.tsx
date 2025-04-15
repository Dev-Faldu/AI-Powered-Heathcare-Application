
import React from 'react';
import { motion } from "framer-motion";
import { Heart, Shield, Zap, Users, Rocket, Globe, Check, Calendar, MapPin } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface CoreValue {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutUs: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Dr. Ajay Kumar",
      role: "Founder & CEO",
      bio: "Dr. Kumar is a seasoned medical professional with over 15 years of experience in healthcare technology, committed to democratizing healthcare access.",
      image: "/placeholder.svg"
    },
    {
      name: "Dev Faldu",
      role: "Chief Technology Officer",
      bio: "Dev drives the technical architecture and development of the app, ensuring robust performance and seamless user experience.",
      image: "/placeholder.svg"
    },
    {
      name: "Aryan Pawar",
      role: "Head of Finance & Strategy",
      bio: "Aryan spearheads the financial strategy and ensures alignment with business expansion, funding, and long-term sustainability.",
      image: "/placeholder.svg"
    },
    {
      name: "Dr. Priya Sharma",
      role: "Chief Medical Officer",
      bio: "Dr. Sharma oversees all medical protocols and ensures the highest standards of care across our AI-powered platform.",
      image: "/placeholder.svg"
    }
  ];

  const milestones: Milestone[] = [
    {
      year: "2024",
      title: "The Beginning",
      description: "Founded with the vision to use AI for instant, affordable healthcare access. Developed the ApneDoctors AI Symptom Analyzer & Verification System."
    },
    {
      year: "2024",
      title: "AI-Powered Expansion",
      description: "Launched the AI-driven symptom quiz, diagnosing 1,000+ patients in the first 3 months. Verified over 500+ MBBS doctors & PG residents for instant availability."
    },
    {
      year: "2025",
      title: "Scaling to Nationwide Impact",
      description: "Achieved 5,000+ successful patient consultations. Introduced instant doctor matching with AI-based availability tracking."
    },
    {
      year: "2025",
      title: "Funding Milestone",
      description: "Secured initial seed funding to scale operations and expand AI capabilities across India's healthcare ecosystem."
    }
  ];

  const coreValues: CoreValue[] = [
    {
      icon: <Heart className="w-10 h-10 text-primary" />,
      title: "Patient-Centric Innovation",
      description: "AI-powered diagnostics that prioritize accurate, personalized healthcare for every patient."
    },
    {
      icon: <Globe className="w-10 h-10 text-primary" />,
      title: "Accessibility for All",
      description: "Flat ₹150 consultations, no matter where the patient is located across India."
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "Doctor Empowerment",
      description: "Helping MBBS & PG residents gain experience, build reputation & earn through our platform."
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: "Trust & Security",
      description: "HIPAA-compliant data protection and AI-enhanced doctor verification for complete peace of mind."
    }
  ];

  const technologies = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "AI-Powered Symptom Analysis",
      description: "Detects & predicts health conditions with high accuracy using advanced machine learning."
    },
    {
      icon: <Check className="w-8 h-8 text-primary" />,
      title: "Doctor Verification System",
      description: "Ensures real & licensed doctors using AI-based document scanning and credential verification."
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Automated PDF Reports",
      description: "Instant medical summaries generated for assigned doctors and patients after consultations."
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Real-Time Doctor Matching",
      description: "AI automatically assigns the next available MBBS doctor or PG resident based on patient needs."
    }
  ];

  const roadmap = [
    {
      year: "2025",
      title: "Progressive Web App (PWA)",
      description: "Full offline & mobile experience for seamless access in low-connectivity areas."
    },
    {
      year: "2025",
      title: "Multilingual Support",
      description: "AI chatbot & diagnostics in 10+ Indian languages to reach more patients across the country."
    },
    {
      year: "2026",
      title: "Advanced AI-Driven Disease Prediction",
      description: "Using deep learning for faster, more accurate diagnosis across a wider range of conditions."
    },
    {
      year: "2026",
      title: "Doctor Prescription Automation",
      description: "FHIR-compliant e-prescriptions sent directly via the app with integrated pharmacy fulfillment."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              Revolutionizing Healthcare with AI
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300 mb-8">
              ApneDoctors is bridging the healthcare gap in India by connecting patients 
              with MBBS doctors and PG residents through instant, AI-powered consultations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full">
                Join as Doctor
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              className="glass-card p-8 rounded-2xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 gradient-text">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300">
                To bridge the healthcare gap in India by leveraging AI & real-time doctor consultations.
                We enable MBBS graduates and PG residents to establish themselves without years of 
                experience, while providing instant, affordable ₹150 consultations without long wait times.
              </p>
            </motion.div>

            <motion.div 
              className="glass-card p-8 rounded-2xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 gradient-text">Our Vision</h2>
              <p className="text-gray-700 dark:text-gray-300">
                A future where anyone, anywhere can receive instant, AI-driven medical assistance from a 
                qualified doctor. We aim to empower young medical professionals and create a network of 
                10,000+ doctors across India, making quality healthcare accessible to all.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-center text-primary">{value.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">AI & Technology That Powers ApneDoctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technologies.map((tech, index) => (
              <motion.div 
                key={index}
                className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  {tech.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{tech.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{tech.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders & Team */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">The ApneDoctors Journey</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>
            
            {/* Timeline items */}
            <div className="relative">
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={index}
                  className={`relative mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} md:flex md:items-center`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Timeline node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary z-10"></div>
                  
                  {/* Content */}
                  <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8 md:ml-auto text-right'}`}>
                    <Card className="glass-card">
                      <CardContent className="p-6">
                        <div className="text-xl font-bold text-primary mb-1">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Future Roadmap */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Future Roadmap</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our vision for ApneDoctors extends beyond today. Here's what we're building for the future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roadmap.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Rocket className="w-10 h-10 text-primary" />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">Planned for</span>
                    <span className="text-lg font-bold text-primary">{item.year}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-medical-500 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Join ApneDoctors Today</h2>
            <p className="text-xl text-white/80 mb-8">
              Whether you're a patient looking for quick medical advice or a doctor ready to consult,
              ApneDoctors is your platform for the future of healthcare.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-medical-700 hover:bg-white/90 px-8">
                Get Started as Patient
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-8">
                Join as Doctor
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
