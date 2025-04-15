
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  className?: string;
}

const HowItWorks = ({ className }: HowItWorksProps) => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      title: "Describe Your Symptoms",
      description: "Enter your symptoms through text or voice input. Our AI system will analyze your description and begin the diagnostic process.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Person describing symptoms"
    },
    {
      title: "AI Assessment",
      description: "Our advanced AI analyzes your symptoms, medical history, and relevant risk factors to provide an initial assessment of possible conditions.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "AI processing medical data"
    },
    {
      title: "Connect with Doctors",
      description: "Based on the assessment, connect with specialists for a video consultation. They'll review the AI analysis and provide expert guidance.",
      image: "https://images.unsplash.com/photo-1609904403133-c8c7414ebf7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Doctor consulting with patient"
    },
    {
      title: "Receive Treatment Plan",
      description: "Get a personalized treatment plan and prescription if needed. Follow-up reminders and progress tracking help ensure your recovery.",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Treatment plan on mobile device"
    }
  ];

  return (
    <div className={cn("py-20", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">
            How <span className="gradient-text">ApneDoctors</span> Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A seamless journey from symptoms to treatment, powered by AI and medical expertise.
          </p>
        </div>

        <div className="relative mb-16">
          <div className="absolute top-8 left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-0.5 h-[calc(100%-60px)] bg-gradient-to-b from-medical-500 to-teal-500 hidden md:block"></div>
          
          {steps.map((step, index) => (
            <div 
              key={index}
              className={cn(
                "mb-12 md:mb-24 relative flex flex-col md:flex-row items-center justify-center animate-fade-in", 
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              )}
              onMouseEnter={() => setActiveStep(index)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="md:w-1/2 flex flex-col md:p-8">
                <div className="flex items-center mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium z-10 border-2 transition-colors duration-300",
                    activeStep === index 
                      ? "bg-gradient-to-r from-medical-500 to-teal-500 text-white border-transparent"
                      : "bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700"
                  )}>
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-16 mb-6">{step.description}</p>
                
                {index === steps.length - 1 && (
                  <button className="glass-button self-start ml-16">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="md:w-1/2 p-4">
                <div className={cn(
                  "glass-card overflow-hidden transition-all duration-500",
                  activeStep === index ? "shadow-xl scale-105" : "shadow-md scale-100"
                )}>
                  <img 
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-60 md:h-80 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
