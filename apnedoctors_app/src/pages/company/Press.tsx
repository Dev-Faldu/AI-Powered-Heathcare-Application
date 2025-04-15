
import React from 'react';
import { motion } from "framer-motion";
import { Search, Calendar, ArrowUpRight } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Press = () => {
  const pressReleases = [
    {
      id: 1,
      title: "ApneHealth Secures $50M Series B Funding to Expand AI-Powered Healthcare Solutions",
      date: "June 15, 2023",
      category: "Funding",
      summary: "The investment will accelerate the company's mission to democratize healthcare access through innovative AI technologies.",
    },
    {
      id: 2,
      title: "ApneHealth Partners with Top Medical Institutions to Enhance AI Diagnostic Accuracy",
      date: "May 3, 2023",
      category: "Partnership",
      summary: "The collaboration aims to train AI models with diverse medical data, improving diagnostic precision for a wider range of conditions.",
    },
    {
      id: 3,
      title: "ApneHealth's AI Symptom Checker Achieves 95% Accuracy in Clinical Trials",
      date: "April 12, 2023",
      category: "Research",
      summary: "The breakthrough represents a significant advancement in AI-driven healthcare diagnostics, matching the performance of experienced physicians.",
    },
  ];

  const mediaFeatures = [
    {
      id: 1,
      publication: "TechCrunch",
      title: "How ApneHealth is Revolutionizing Remote Healthcare with AI",
      date: "July 2, 2023",
      link: "#",
    },
    {
      id: 2,
      publication: "Forbes",
      title: "ApneHealth Named Among Top 50 AI Companies Transforming Healthcare",
      date: "June 28, 2023",
      link: "#",
    },
    {
      id: 3,
      publication: "The New York Times",
      title: "The Future of Doctor Visits: AI-Powered Diagnosis and Remote Consultations",
      date: "June 10, 2023",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              ApneHealth in the News
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Stay updated with the latest news, press releases, and media coverage about our mission to transform healthcare.
            </p>
          </motion.div>
          
          <div className="relative max-w-xl mx-auto mb-12">
            <Input
              placeholder="Search press releases and news..."
              className="pl-12 pr-4 py-6 rounded-full shadow-md dark:bg-gray-800"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6">
              Search
            </Button>
          </div>
        </section>
        
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Press Releases</h2>
            <Button variant="outline" className="flex items-center gap-2">
              View All <ArrowUpRight size={18} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pressReleases.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item.id * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-medical-100 text-medical-800 dark:bg-medical-900/30 dark:text-medical-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar size={14} className="mr-1" />
                      {item.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {item.summary}
                  </p>
                  <Button variant="link" className="text-medical-600 dark:text-medical-400 p-0">
                    Read full release
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Media Coverage</h2>
            <Button variant="outline" className="flex items-center gap-2">
              View All <ArrowUpRight size={18} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaFeatures.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item.id * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {item.publication}
                    </span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar size={14} className="mr-1" />
                      {item.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <a 
                    href={item.link} 
                    className="inline-flex items-center text-medical-600 dark:text-medical-400 font-medium"
                  >
                    Read article <ArrowUpRight size={16} className="ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="bg-gradient-to-r from-medical-500 to-indigo-600 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Media Inquiries
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-3xl">
                For press inquiries, interview requests, or additional information about ApneHealth, please contact our media relations team.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Media Relations</h3>
                  <p className="text-white/80 mb-4">For general media inquiries and information</p>
                  <p className="text-white font-medium">press@apnehealth.com</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Press Kit</h3>
                  <p className="text-white/80 mb-4">Download our press kit with logos, executive bios, and product information</p>
                  <Button className="bg-white text-medical-700 hover:bg-white/90">
                    Download Press Kit
                  </Button>
                </div>
              </div>
              <div className="text-white/80 text-sm">
                We aim to respond to all media inquiries within 24 hours during business days.
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Press;
