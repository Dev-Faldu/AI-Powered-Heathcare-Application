
import { BarChart3, FileDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DiagnosisResult } from '@/services/DiagnosisService';
import { EmptyState } from './EmptyState';

interface ResultsTabProps {
  diagnosisResult: DiagnosisResult | null;
  setActiveTab: (tab: 'chat' | 'results' | 'recommendations') => void;
  generateReport: () => void;
}

export const ResultsTab = ({ diagnosisResult, setActiveTab, generateReport }: ResultsTabProps) => {
  if (!diagnosisResult) {
    return (
      <EmptyState 
        icon={<BarChart3 className="h-8 w-8 text-gray-400" />}
        title="No Analysis Results Yet"
        description="Describe your symptoms in the chat and run an analysis to see potential conditions and recommendations."
        actionLabel="Go to Chat"
        onAction={() => setActiveTab('chat')}
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Diagnosis Results</h3>
        <div className="flex items-center bg-medical-100 dark:bg-medical-900/30 px-3 py-1 rounded-full">
          <span className="text-sm text-medical-800 dark:text-medical-200 mr-2">Confidence:</span>
          <span className="text-sm font-medium text-medical-800 dark:text-medical-200">
            {Math.round(diagnosisResult.confidenceScore * 100)}%
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Potential Conditions</h4>
        {diagnosisResult.conditions.map((condition, index) => (
          <div 
            key={index}
            className="glass-card p-4 space-y-2 border-l-4"
            style={{ 
              borderLeftColor: condition.urgency === 'high' ? '#ef4444' : 
                                condition.urgency === 'medium' ? '#f59e0b' : '#10b981'
            }}
          >
            <div className="flex justify-between items-center">
              <h5 className="font-medium text-gray-900 dark:text-white">{condition.name}</h5>
              <div className="flex items-center">
                {condition.urgency === 'high' && (
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={cn(
                  "text-sm px-2 py-0.5 rounded-full",
                  condition.urgency === 'high' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                  condition.urgency === 'medium' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                )}>
                  {condition.urgency.charAt(0).toUpperCase() + condition.urgency.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-medical-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.round(condition.probability * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {Math.round(condition.probability * 100)}%
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">{condition.description}</p>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium mr-2">Specialist:</span>
              {condition.specialistType}
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Follow-up Questions</h4>
        <ul className="space-y-2">
          {diagnosisResult.followUpQuestions.map((question, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-medical-800 dark:text-medical-200 font-medium">{index + 1}</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">{question}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button 
        onClick={generateReport}
        className="w-full bg-medical-500 hover:bg-medical-600 text-white"
      >
        <FileDown className="mr-2 h-4 w-4" /> Generate Medical Report
      </Button>
    </>
  );
};
