
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DiagnosisResult } from '@/services/DiagnosisService';
import { ArrowRight, ArrowLeft, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuizSymptomCheckerProps } from './types';
import QuizQuestionComponent from './QuizQuestion';
import QuizAnalysisResults from './QuizAnalysisResults';
import QuizModelSelector from './QuizModelSelector';
import QuizSymptomFilter from './QuizSymptomFilter';
import { useQuizState } from './useQuizState';

export const QuizSymptomChecker = ({ className, onDiagnosisComplete }: QuizSymptomCheckerProps) => {
  const { toast } = useToast();
  const {
    currentQuestionIndex,
    selectedSymptoms,
    answers,
    isAnalyzing,
    analysisProgress,
    diagnosisResult,
    quizComplete,
    selectedModels,
    confidenceScore,
    analysisDetails,
    activeTab,
    aiModels,
    questions,
    currentQuestion,
    progressPercentage,
    handleAnswer,
    handleBack,
    restartQuiz,
    toggleModelSelection,
    setActiveTab
  } = useQuizState(onDiagnosisComplete);

  // Handler for AI model toggle
  const handleModelToggle = (modelId: string) => {
    toggleModelSelection(modelId);
  };

  // Handler for the final "View Full Results" button
  const handleViewResults = () => {
    if (onDiagnosisComplete && diagnosisResult) {
      onDiagnosisComplete(diagnosisResult);
    }
  };

  return (
    <div className={cn("glass-card flex flex-col h-full overflow-hidden", className)}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-medical-50/50 dark:bg-medical-900/30 flex justify-between items-center">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center">
          Advanced Symptom Quiz
          {!quizComplete && (
            <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          )}
        </h3>
        
        {quizComplete && (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        {!quizComplete && (
          <QuizModelSelector 
            selectedModels={selectedModels}
            aiModels={aiModels}
            onModelSelectionChange={handleModelToggle}
          />
        )}
      </div>
      
      {!quizComplete && (
        <div className="px-4">
          <Progress value={progressPercentage} className="mt-2" />
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'quiz' && !quizComplete ? (
          <QuizQuestionComponent
            question={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            aiModels={aiModels}
            onSelectAnswer={handleAnswer}
          />
        ) : activeTab === 'analysis' || (quizComplete && activeTab === 'quiz') ? (
          <QuizAnalysisResults
            isAnalyzing={isAnalyzing}
            analysisProgress={analysisProgress}
            selectedModels={selectedModels}
            aiModels={aiModels}
            diagnosisResult={diagnosisResult}
            confidenceScore={confidenceScore}
            analysisDetails={analysisDetails}
            onRestartQuiz={restartQuiz}
            onViewResults={handleViewResults}
          />
        ) : null}
      </div>
      
      {!quizComplete && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <QuizSymptomFilter selectedSymptoms={selectedSymptoms} />
            
            <Button 
              onClick={() => {
                if (answers[currentQuestion.id]) {
                  // If answer is selected, move to next question
                  if (currentQuestionIndex < questions.length - 1) {
                    handleAnswer(
                      answers[currentQuestion.id],
                      currentQuestion.options.find(o => o.id === answers[currentQuestion.id])?.value || "",
                      currentQuestion.options.find(o => o.id === answers[currentQuestion.id])?.relatedSymptom
                    );
                  } else {
                    restartQuiz();
                  }
                } else {
                  // If no answer selected, show toast
                  toast({
                    title: "Selection Required",
                    description: "Please select an answer to continue.",
                    variant: "destructive",
                  });
                }
              }}
              disabled={!answers[currentQuestion.id]}
              className="flex items-center"
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
              ) : (
                <>Run AI Analysis <BrainCircuit className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSymptomChecker;
