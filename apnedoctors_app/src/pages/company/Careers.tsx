
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Search, Filter, Users, Coffee, Award } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Careers = () => {
  const [department, setDepartment] = useState("all");
  const [location, setLocation] = useState("all");
  
  const jobOpenings = [
    {
      id: 1,
      title: "AI Research Scientist",
      department: "AI & Research",
      location: "Bangalore, India",
      type: "Full-time",
      postedDate: "3 days ago",
      description: "Join our AI team to develop cutting-edge machine learning models for healthcare diagnostics.",
    },
    {
      id: 2,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      postedDate: "1 week ago",
      description: "Build responsive and accessible user interfaces for our telehealth platform.",
    },
    {
      id: 3,
      title: "Product Manager - Healthcare",
      department: "Product",
      location: "Delhi, India",
      type: "Full-time",
      postedDate: "2 weeks ago",
      description: "Lead product initiatives to transform the healthcare experience through technology.",
    },
    {
      id: 4,
      title: "UX Researcher",
      department: "Design",
      location: "Bangalore, India",
      type: "Full-time",
      postedDate: "3 days ago",
      description: "Conduct user research to inform the design of our healthcare applications.",
    },
    {
      id: 5,
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      postedDate: "5 days ago",
      description: "Develop scalable backend services for our healthcare platform.",
    },
    {
      id: 6,
      title: "Medical Content Writer",
      department: "Content",
      location: "Remote",
      type: "Part-time",
      postedDate: "1 week ago",
      description: "Create accurate and accessible health content for our platform.",
    },
  ];
  
  const filteredJobs = jobOpenings.filter(job => {
    if (department !== "all" && job.department !== department) return false;
    if (location !== "all" && job.location !== location) return false;
    return true;
  });
  
  const departments = ["AI & Research", "Engineering", "Product", "Design", "Content", "Marketing"];
  const locations = ["Bangalore, India", "Delhi, India", "Remote"];
  
  const benefits = [
    {
      icon: <Users size={24} />,
      title: "Health Benefits",
      description: "Comprehensive health insurance for you and your family"
    },
    {
      icon: <Coffee size={24} />,
      title: "Work-Life Balance",
      description: "Flexible working hours and remote work options"
    },
    {
      icon: <Award size={24} />,
      title: "Career Growth",
      description: "Regular training and development opportunities"
    },
    {
      icon: <Briefcase size={24} />,
      title: "Stock Options",
      description: "Employee stock ownership plan for all full-time employees"
    }
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
              Build the Future of Healthcare
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join our mission to transform healthcare through AI and telemedicine, making quality healthcare accessible to everyone.
            </p>
          </motion.div>
          
          <div className="bg-gradient-to-r from-medical-500 to-indigo-600 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Why Join ApneHealth?
                  </h2>
                  <p className="text-white/90 mb-6">
                    Work on meaningful problems in healthcare with a team of passionate individuals dedicated to making a difference.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{benefit.title}</h3>
                          <p className="text-white/70 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="/images/team-collaboration.jpg" 
                    alt="Team collaboration" 
                    className="rounded-xl shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Open Positions
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Search jobs..." className="pl-10 w-[200px]" />
              </div>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="engineering">Engineering</TabsTrigger>
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="ai">AI & Research</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: job.id * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Briefcase size={14} /> {job.department}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin size={14} /> {job.location}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock size={14} /> {job.type}
                            </Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Posted {job.postedDate}
                            </span>
                          </div>
                        </div>
                        <Button className="mt-4 md:mt-0">
                          Apply Now
                        </Button>
                      </div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">
                        {job.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No job openings match your filter criteria.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setDepartment("all");
                    setLocation("all");
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {["engineering", "product", "ai", "design"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {jobOpenings
                    .filter((job) => {
                      if (tab === "ai" && job.department === "AI & Research") return true;
                      if (job.department.toLowerCase().includes(tab)) return true;
                      return false;
                    })
                    .map((job) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: job.id * 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {job.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Briefcase size={14} /> {job.department}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <MapPin size={14} /> {job.location}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Clock size={14} /> {job.type}
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Posted {job.postedDate}
                                </span>
                              </div>
                            </div>
                            <Button className="mt-4 md:mt-0">
                              Apply Now
                            </Button>
                          </div>
                          <p className="mt-4 text-gray-600 dark:text-gray-400">
                            {job.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
        
        <section>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Don't See a Perfect Match?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                We're always looking for talented individuals who are passionate about transforming healthcare. 
                Send us your resume, and we'll keep you in mind for future opportunities.
              </p>
              <Button size="lg">
                Submit Your Resume
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
