
import { Check, Zap, Lock, Activity, Users, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturesProps {
  className?: string;
}

const Features = ({ className }: FeaturesProps) => {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-medical-500" />,
      title: "AI-Powered Diagnostics",
      description: "Advanced machine learning algorithms analyze your symptoms and provide accurate medical guidance.",
      checklist: [
        "NLP-based symptom analysis",
        "Adaptive questioning system",
        "Disease probability assessment",
        "Personalized health recommendations"
      ]
    },
    {
      icon: <Users className="h-6 w-6 text-medical-500" />,
      title: "Doctor Consultations",
      description: "Connect with qualified healthcare professionals through our secure platform.",
      checklist: [
        "Video and chat consultations",
        "AI-verified doctor profiles",
        "Secure e-prescriptions",
        "Automated appointment scheduling"
      ]
    },
    {
      icon: <FileText className="h-6 w-6 text-medical-500" />,
      title: "Health Records Management",
      description: "Keep all your medical information organized and accessible in one secure place.",
      checklist: [
        "Secure cloud storage",
        "FHIR-compatible medical reports",
        "Immutable record tracking",
        "Hospital system integration"
      ]
    },
    {
      icon: <Activity className="h-6 w-6 text-medical-500" />,
      title: "Health Analytics",
      description: "Track your health metrics and receive personalized insights to improve your wellbeing.",
      checklist: [
        "Health trend visualization",
        "Medication tracking",
        "Automated health reminders",
        "Wearable device integration"
      ]
    },
    {
      icon: <Lock className="h-6 w-6 text-medical-500" />,
      title: "Privacy & Security",
      description: "Your health data is protected with military-grade encryption and HIPAA-compliant systems.",
      checklist: [
        "End-to-end encryption",
        "HIPAA & GDPR compliance",
        "Secure authentication",
        "Privacy-focused design"
      ]
    }
  ];

  return (
    <div className={cn("py-20 bg-gray-50 dark:bg-gray-900/50", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive Healthcare <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Cutting-edge technology meets medical expertise for a complete healthcare solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-8 flex flex-col h-full animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{feature.description}</p>
              <div className="mt-auto">
                <ul className="space-y-2">
                  {feature.checklist.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-2 mt-1 bg-medical-100 dark:bg-medical-900/30 p-1 rounded-full">
                        <Check className="h-3 w-3 text-medical-600 dark:text-medical-400" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
