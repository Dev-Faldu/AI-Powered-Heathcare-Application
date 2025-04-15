
import { BrainCircuit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { QuizQuestion, QuizOption, MedicalAIModel } from "./types";

interface QuizQuestionProps {
  question: QuizQuestion;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  aiModels: MedicalAIModel[];
  onSelectAnswer: (optionId: string, value: string, relatedSymptom?: any) => void;
}

const QuizQuestionComponent = ({ 
  question, 
  currentQuestionIndex, 
  answers, 
  aiModels, 
  onSelectAnswer 
}: QuizQuestionProps) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center text-medical-600 dark:text-medical-400 flex-shrink-0">
          {currentQuestionIndex + 1}
        </div>
        <div>
          <h4 className="text-xl font-medium text-gray-900 dark:text-white">
            {question.question}
          </h4>
          {question.medicalContext && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Medical context: {question.medicalContext}
            </p>
          )}
        </div>
      </div>
      
      {question.aiModelId && (
        <div className="flex items-center">
          <BrainCircuit className="h-4 w-4 text-teal-500 mr-2" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Analyzed by {aiModels.find(m => m.id === question.aiModelId)?.name || 'AI model'}
          </span>
        </div>
      )}
      
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectAnswer(option.id, option.value, option.relatedSymptom)}
            className={cn(
              "w-full text-left p-4 rounded-xl border transition-all duration-200",
              answers[question.id] === option.id
                ? "border-medical-500 bg-medical-50 dark:bg-medical-900/50"
                : "border-gray-200 dark:border-gray-800 hover:border-medical-300 dark:hover:border-medical-700 bg-white dark:bg-gray-950"
            )}
          >
            <div className="flex justify-between items-center">
              <span>{option.text}</span>
              {option.aiModelWeight && option.aiModelWeight > 0.8 && (
                <Badge variant="outline" className="bg-yellow-100/50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                  High Signal
                </Badge>
              )}
            </div>
            {option.relatedSymptom && (
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Related symptom: {option.relatedSymptom.name}
                {option.relatedSymptom.severity && (
                  <span className="ml-1">(Severity: {option.relatedSymptom.severity}/10)</span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestionComponent;
