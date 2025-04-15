
import { RefObject } from 'react';
import { cn } from '@/lib/utils';
import { X, PlusCircle, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Symptom } from '@/services/DiagnosisService';
import { ChatMessages } from './ChatMessages';

interface ChatTabProps {
  messages: {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }[];
  isTyping: boolean;
  isAnalyzing: boolean;
  analysisProgress: number;
  messagesEndRef: RefObject<HTMLDivElement>;
  selectedSymptoms: Symptom[];
  removeSymptom: (symptomId: string) => void;
  commonSymptoms: Symptom[];
  addSymptom: (symptom: Symptom) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  runDiagnosisAnalysis: () => void;
}

export const ChatTab = ({
  messages,
  isTyping,
  isAnalyzing,
  analysisProgress,
  messagesEndRef,
  selectedSymptoms,
  removeSymptom,
  commonSymptoms,
  addSymptom,
  isRecording,
  toggleRecording,
  inputValue,
  setInputValue,
  handleSendMessage,
  runDiagnosisAnalysis
}: ChatTabProps) => {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ChatMessages 
          messages={messages}
          isTyping={isTyping}
          isAnalyzing={isAnalyzing}
          analysisProgress={analysisProgress}
        />
        
        <div ref={messagesEndRef} />
      </div>
      
      {selectedSymptoms.length > 0 && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(symptom => (
              <div 
                key={symptom.id}
                className="bg-medical-100 dark:bg-medical-900/30 text-medical-800 dark:text-medical-200 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {symptom.name}
                <button 
                  onClick={() => removeSymptom(symptom.id)}
                  className="ml-2 text-medical-500 hover:text-medical-700 dark:text-medical-300 dark:hover:text-medical-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="mb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Common symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map(symptom => (
              <button
                key={symptom.id}
                onClick={() => addSymptom(symptom)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-gray-200 flex items-center"
              >
                <PlusCircle size={14} className="mr-1" /> {symptom.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleRecording}
            className={cn(
              "p-2 rounded-full flex-shrink-0 transition-colors duration-200",
              isRecording 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            aria-label="Voice input"
          >
            <Mic size={20} />
          </button>
          
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe your symptoms..."
              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-medical-500 text-gray-800 dark:text-gray-200 pr-12"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-medical-500 text-white rounded-full hover:bg-medical-600 transition-colors duration-200"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          
          <Button 
            onClick={runDiagnosisAnalysis}
            variant="outline"
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-600 text-white border-0"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </div>
    </>
  );
};
