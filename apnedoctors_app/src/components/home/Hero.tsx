
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  return (
    <div className={cn("relative overflow-hidden pt-20 md:pt-32 pb-16", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block rounded-full bg-medical-100 dark:bg-medical-900/30 px-4 py-1.5 mb-6 animate-fade-in">
            <span className="text-medical-700 dark:text-medical-400 text-sm font-medium">
              AI-Powered Healthcare
            </span>
          </div>
          
          <h1 className="font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Your Personal AI Doctor <br className="hidden sm:block" />
            <span className="gradient-text">Always Available</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in">
            Get instant medical guidance, connect with doctors, and manage your health records—all in one secure app.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <Link 
              to="/diagnosis?mode=chat"
              className="glass-button w-full sm:w-auto flex items-center justify-center"
            >
              Try AI Diagnosis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/diagnosis?mode=quiz" 
              className="glass-button w-full sm:w-auto flex items-center justify-center bg-teal-500/80 hover:bg-teal-600/80"
            >
              Symptom Quiz <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/doctors" 
              className="px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
            >
              Find Doctors
            </Link>
          </div>
        </div>
        
        <div className="mt-16 max-w-5xl mx-auto animate-fade-in-up">
          <div className="glass-card overflow-hidden shadow-xl">
            <div className="aspect-[16/9] w-full bg-gradient-to-br from-medical-500 to-teal-500 relative">
              <div className="absolute inset-0 opacity-30 bg-[url('/img/grid-pattern.svg')]"></div>
              
              {/* Placeholder for app UI mockup */}
              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center items-center">
                <div className="bg-white/95 dark:bg-gray-900/95 rounded-2xl p-4 sm:p-6 shadow-lg w-full max-w-lg mx-auto">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-medical-500 flex items-center justify-center text-white font-medium text-lg">
                      AI
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">AI Doctor</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Online • Responding now</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 mb-3 text-sm text-gray-700 dark:text-gray-300">
                    Hello! I'm your AI health assistant. What symptoms are you experiencing today?
                  </div>
                  
                  <div className="bg-medical-100 dark:bg-medical-900/30 rounded-xl p-3 mb-3 text-sm text-gray-700 dark:text-gray-300 ml-auto max-w-[80%]">
                    I've had a headache and fever for the past two days.
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-300 animate-pulse">
                    I'll help you assess that. Let me ask you a few questions to better understand your condition...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up">
          {[
            {
              title: "AI Diagnosis",
              description: "Get instant medical guidance powered by advanced AI.",
              icon: "🧠",
              delay: 0,
            },
            {
              title: "Doctor Consultation",
              description: "Connect with qualified doctors for personalized care.",
              icon: "👨‍⚕️",
              delay: 0.1,
            },
            {
              title: "Health Records",
              description: "Securely store and access your medical history.",
              icon: "📊",
              delay: 0.2,
            },
          ].map((feature, index) => (
            <div 
              key={index}
              className="glass-card p-6 sm:p-8 flex flex-col items-center text-center"
              style={{ animationDelay: `${feature.delay}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
