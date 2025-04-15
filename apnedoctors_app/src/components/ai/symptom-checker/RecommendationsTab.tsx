
import { ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiagnosisResult } from '@/services/DiagnosisService';
import { EmptyState } from './EmptyState';

interface RecommendationsTabProps {
  diagnosisResult: DiagnosisResult | null;
  setActiveTab: (tab: 'chat' | 'results' | 'recommendations') => void;
}

export const RecommendationsTab = ({ diagnosisResult, setActiveTab }: RecommendationsTabProps) => {
  if (!diagnosisResult) {
    return (
      <EmptyState 
        icon={<Info className="h-8 w-8 text-gray-400" />}
        title="No Recommendations Yet"
        description="Complete a symptom analysis in the chat tab to receive personalized medical recommendations."
        actionLabel="Go to Chat"
        onAction={() => setActiveTab('chat')}
      />
    );
  }

  return (
    <>
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recommended Specialists</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnosisResult.suggestedSpecialists.map((specialist, index) => (
            <div key={index} className="glass-card p-4 flex items-start">
              <div className="w-10 h-10 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mr-3">
                <span className="text-medical-800 dark:text-medical-200 font-medium">
                  {specialist.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{specialist}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Specializes in conditions like those in your analysis
                </p>
                <button className="text-sm text-medical-600 dark:text-medical-400 mt-2 hover:underline">
                  Find nearby {specialist.toLowerCase()}s
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recommended Tests</h3>
        <ul className="space-y-3">
          {diagnosisResult.recommendedTests.map((test, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-medical-800 dark:text-medical-200 font-medium">{index + 1}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">{test}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Helps confirm or rule out potential conditions
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">General Advice</h3>
        <div className="glass-card p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Based on your symptoms and our analysis, here are some general recommendations:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-teal-800 dark:text-teal-300 font-medium">1</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">
                Stay hydrated and get plenty of rest
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-teal-800 dark:text-teal-300 font-medium">2</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">
                Monitor your symptoms and seek medical attention if they worsen
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-teal-800 dark:text-teal-300 font-medium">3</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">
                Schedule a follow-up with your primary care physician
              </span>
            </li>
          </ul>
          
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                This is not a definitive medical diagnosis. Always consult with a healthcare professional for proper evaluation and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Button className="w-full border border-medical-500 text-medical-600 dark:text-medical-400 bg-transparent hover:bg-medical-50 dark:hover:bg-medical-900/10">
        Find Telemedicine Options <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
};
