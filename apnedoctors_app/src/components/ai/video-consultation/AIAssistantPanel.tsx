
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AIAnalysis } from './types';
import { 
  BrainCircuit, 
  FileText, 
  MessageSquare, 
  Pill, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  FileCheck
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AIAssistantPanelProps {
  className?: string;
  isAnalyzing: boolean;
  analysis: AIAnalysis | null;
  refreshAnalysis: () => void;
  transcriptionEnabled: boolean;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  className,
  isAnalyzing,
  analysis,
  refreshAnalysis,
  transcriptionEnabled
}) => {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Simulate analysis progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      setAnalysisProgress(0);
      interval = setInterval(() => {
        setAnalysisProgress(prev => {
          const increment = Math.random() * 15;
          const newValue = prev + increment;
          return newValue >= 100 ? 100 : newValue;
        });
      }, 600);
    } else {
      setAnalysisProgress(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);
  
  return (
    <div className={cn(
      "bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden flex flex-col h-full max-h-full",
      className
    )}>
      <div className="bg-medical-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5" />
          <h3 className="font-semibold">AI Medical Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshAnalysis}
          disabled={isAnalyzing}
          className="hover:bg-medical-700 text-white"
        >
          <RefreshCw className={cn(
            "h-4 w-4",
            isAnalyzing && "animate-spin"
          )} />
        </Button>
      </div>
      
      {/* Analysis state */}
      {isAnalyzing ? (
        <div className="p-4 flex-grow">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-medical-100 dark:bg-medical-900/30 rounded-full mb-3">
              <BrainCircuit className="h-6 w-6 text-medical-600 dark:text-medical-400" />
            </div>
            <h4 className="font-medium text-lg text-gray-900 dark:text-white mb-1">
              AI Analysis in Progress
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our medical AI is processing the conversation...
            </p>
          </div>
          
          <Progress value={analysisProgress} className="mb-6" />
          
          <div className="space-y-4">
            {["Processing speech patterns...", 
              "Analyzing medical symptoms...", 
              "Reviewing clinical patterns...", 
              "Evaluating doctor recommendations..."
            ].map((step, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-center p-2 rounded-md",
                  analysisProgress > index * 25 
                    ? "bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-300" 
                    : "bg-gray-50 dark:bg-gray-800/50 text-gray-400"
                )}
              >
                <div className={cn(
                  "h-5 w-5 rounded-full mr-3 flex items-center justify-center text-xs",
                  analysisProgress > index * 25 
                    ? "bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-300" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}>
                  {analysisProgress > index * 25 ? "✓" : (index + 1)}
                </div>
                {step}
              </div>
            ))}
          </div>
        </div>
      ) : !analysis ? (
        <div className="p-4 flex-grow flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
              <BrainCircuit className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="font-medium text-lg text-gray-900 dark:text-white mb-1">
              No Analysis Available
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Start your consultation to enable AI assistance
            </p>
            <Button 
              variant="outline" 
              onClick={refreshAnalysis}
              className="bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-300 border-medical-200 dark:border-medical-800"
            >
              <BrainCircuit className="mr-2 h-4 w-4" />
              Start AI Analysis
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto p-3">
          <Accordion type="single" collapsible defaultValue="keyPoints" className="space-y-3">
            <AccordionItem value="keyPoints" className="border-0">
              <AccordionTrigger className="bg-medical-50 dark:bg-medical-900/20 rounded-lg py-2 px-3 hover:no-underline">
                <div className="flex items-center">
                  <FileCheck className="h-4 w-4 mr-2 text-medical-600 dark:text-medical-400" />
                  <span className="font-medium">Key Points</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-3">
                <ul className="space-y-2">
                  {analysis.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="bg-medical-100 dark:bg-medical-900/30 text-medical-800 dark:text-medical-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            {analysis.suggestedDiagnosis && (
              <AccordionItem value="diagnosis" className="border-0">
                <AccordionTrigger className="bg-teal-50 dark:bg-teal-900/20 rounded-lg py-2 px-3 hover:no-underline">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
                    <span className="font-medium">Suggested Diagnosis</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 px-3">
                  <ul className="space-y-2">
                    {analysis.suggestedDiagnosis.map((diagnosis, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{diagnosis}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <span className="font-medium">AI Confidence:</span> {Math.round(analysis.confidence * 100)}%
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {analysis.medicationSuggestions && (
              <AccordionItem value="medications" className="border-0">
                <AccordionTrigger className="bg-blue-50 dark:bg-blue-900/20 rounded-lg py-2 px-3 hover:no-underline">
                  <div className="flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">Medication Suggestions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 px-3">
                  <ul className="space-y-2">
                    {analysis.medicationSuggestions.map((medication, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{medication}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-xs italic text-gray-500 dark:text-gray-400">
                    *For reference only. Final prescription at doctor's discretion.
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {transcriptionEnabled && (
              <AccordionItem value="transcript" className="border-0">
                <AccordionTrigger className="bg-gray-100 dark:bg-gray-800 rounded-lg py-2 px-3 hover:no-underline">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium">Live Transcript</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 px-3">
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {analysis.transcript.map((line, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{line}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-800 p-3 mt-auto">
        <Button variant="outline" className="w-full" onClick={refreshAnalysis}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {isAnalyzing ? 'Analysis in progress...' : 'Refresh Analysis'}
        </Button>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
