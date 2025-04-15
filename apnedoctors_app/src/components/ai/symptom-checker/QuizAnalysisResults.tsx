
import { AlertTriangle, BrainCircuit, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DiagnosisResult } from "@/services/DiagnosisService";
import { cn } from "@/lib/utils";
import { AnalysisDetails, MedicalAIModel } from "./types";

interface QuizAnalysisResultsProps {
  isAnalyzing: boolean;
  analysisProgress: number;
  selectedModels: string[];
  aiModels: MedicalAIModel[];
  diagnosisResult: DiagnosisResult | null;
  confidenceScore: number;
  analysisDetails: AnalysisDetails | null;
  onRestartQuiz: () => void;
  onViewResults: () => void;
}

const QuizAnalysisResults = ({
  isAnalyzing,
  analysisProgress,
  selectedModels,
  aiModels,
  diagnosisResult,
  confidenceScore,
  analysisDetails,
  onRestartQuiz,
  onViewResults
}: QuizAnalysisResultsProps) => {
  
  if (isAnalyzing) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-8">
          <div className="mb-4 text-medical-600 dark:text-medical-400 animate-pulse">
            <RefreshCw className="h-12 w-12 mx-auto animate-spin" />
          </div>
          <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Advanced Analysis In Progress
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Our AI models are processing your symptoms using neural networks and clinical knowledge graphs.
          </p>
          <Progress value={analysisProgress} className="w-full max-w-md mx-auto" />
          
          <div className="mt-6 max-w-md mx-auto text-left">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Models working on your case:</div>
            <div className="grid grid-cols-2 gap-2">
              {selectedModels.map(modelId => {
                const model = aiModels.find(m => m.id === modelId);
                return (
                  <div key={modelId} className="flex items-center">
                    <BrainCircuit className="h-4 w-4 text-teal-500 mr-2" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{model?.name || modelId}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!diagnosisResult) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-8">
          <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No Analysis Available
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There was a problem analyzing your symptoms. Please try again.
          </p>
          <Button onClick={onRestartQuiz}>
            Restart Quiz
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
        <h4 className="text-xl font-medium text-gray-900 dark:text-white">
          Advanced Analysis Complete
        </h4>
      </div>
      
      <Card className="p-4 border-l-4 border-l-medical-500">
        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
          AI-Powered Assessment
        </h5>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Based on our advanced neural network analysis of your symptoms, we've identified potential conditions with associated probabilities.
        </p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">AI Confidence Score:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(confidenceScore * 100)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Models Used:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedModels.length}
            </span>
          </div>
          
          {diagnosisResult.conditions.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Primary Condition:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {diagnosisResult.conditions[0].name}
              </span>
            </div>
          )}
          
          {diagnosisResult.conditions.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Urgency Level:</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                diagnosisResult.conditions[0]?.urgency === 'high' 
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : diagnosisResult.conditions[0]?.urgency === 'medium'
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              )}>
                {diagnosisResult.conditions[0]?.urgency.toUpperCase()}
              </span>
            </div>
          )}
          
          {analysisDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <h6 className="font-medium text-sm mb-2">Model Contributions</h6>
              <div className="space-y-2">
                {analysisDetails.modelContributions.map((contribution, i) => {
                  const model = aiModels.find(m => m.id === contribution.modelId);
                  return (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{model?.name || contribution.modelId}:</span>
                        <span className="text-gray-700 dark:text-gray-300">{Math.round(contribution.confidence * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-medical-500 h-1" 
                          style={{ width: `${contribution.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {diagnosisResult.conditions.length > 0 && diagnosisResult.conditions[0].urgency === 'high' && (
            <div className="flex items-start mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h6 className="font-medium text-red-800 dark:text-red-300">
                  Urgent Care Recommended
                </h6>
                <p className="text-sm text-red-700 dark:text-red-400">
                  Your symptoms suggest a condition that may require prompt medical attention.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      <div className="space-y-4">
        <h5 className="font-medium text-gray-900 dark:text-white">
          Potential Conditions
        </h5>
        
        <div className="space-y-3">
          {diagnosisResult.conditions.map((condition, index) => (
            <Card key={index} className="p-3">
              <div className="flex justify-between items-center mb-2">
                <h6 className="font-medium text-gray-900 dark:text-white">{condition.name}</h6>
                <Badge 
                  className={cn(
                    condition.urgency === 'high' 
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      : condition.urgency === 'medium'
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  )}
                >
                  {Math.round(condition.probability * 100)}% Probability
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {condition.description}
              </p>
              <div className="mt-2 text-xs text-medical-600 dark:text-medical-400">
                Specialist: {condition.specialistType}
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onRestartQuiz}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart Quiz
        </Button>
        
        <Button
          onClick={onViewResults}
          className="bg-medical-500 hover:bg-medical-600 text-white"
        >
          View Full Results
        </Button>
      </div>
    </div>
  );
};

export default QuizAnalysisResults;
