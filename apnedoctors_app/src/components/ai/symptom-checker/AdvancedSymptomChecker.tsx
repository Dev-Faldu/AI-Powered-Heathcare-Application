
import { useState, useRef, useEffect } from 'react';
import { Symptom, diagnosisService, DiagnosisResult } from '@/services/DiagnosisService';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

import { ChatTab } from './ChatTab';
import { ResultsTab } from './ResultsTab';
import { RecommendationsTab } from './RecommendationsTab';
import { ChatHeader } from './ChatHeader';

interface AdvancedSymptomCheckerProps {
  className?: string;
  onDiagnosisComplete?: (result: DiagnosisResult) => void;
}

const AdvancedSymptomChecker = ({ className, onDiagnosisComplete }: AdvancedSymptomCheckerProps) => {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [messages, setMessages] = useState<{
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }[]>([
    {
      id: '1',
      text: 'Hello! I\'m your advanced AI health assistant. Describe your symptoms or select from common ones below. I\'ll analyze them using our medical AI models.',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'results' | 'recommendations'>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const commonSymptoms: Symptom[] = [
    { id: 's1', name: 'Headache' },
    { id: 's2', name: 'Fever' },
    { id: 's3', name: 'Cough' },
    { id: 's4', name: 'Fatigue' },
    { id: 's5', name: 'Sore Throat' },
    { id: 's6', name: 'Shortness of Breath' },
    { id: 's7', name: 'Nausea' },
    { id: 's8', name: 'Dizziness' },
    { id: 's9', name: 'Chest Pain' },
    { id: 's10', name: 'Rash' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (analysisProgress < 100 && isAnalyzing) {
      const timer = setTimeout(() => {
        setAnalysisProgress(prev => prev + 10);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [analysisProgress, isAnalyzing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addSymptom = (symptom: Symptom) => {
    if (!selectedSymptoms.some(s => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' && selectedSymptoms.length === 0) return;

    let messageText = inputValue;
    if (selectedSymptoms.length > 0) {
      const symptomsText = selectedSymptoms.map(s => s.name).join(', ');
      messageText = messageText ? `${messageText}\n\nSelected symptoms: ${symptomsText}` : `I'm experiencing: ${symptomsText}`;
    }

    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // After brief typing indication, show AI is collecting more info
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: "I'm analyzing your symptoms. Based on what you've shared, I need to ask a few more questions to better understand your condition.",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      
      if (selectedSymptoms.length > 1) {
        // If we have enough symptoms, offer to run analysis
        const aiFollowUp = {
          id: (Date.now() + 2).toString(),
          text: "Would you like me to analyze these symptoms now using our medical AI models? Or would you prefer to provide more details first?",
          sender: 'ai' as const,
          timestamp: new Date(),
        };
        setTimeout(() => {
          setMessages(prev => [...prev, aiFollowUp]);
          setIsTyping(false);
        }, 1500);
      } else {
        // Ask for more symptoms
        const aiFollowUp = {
          id: (Date.now() + 2).toString(),
          text: "Could you tell me about any other symptoms you're experiencing? The more information you provide, the more accurate our analysis will be.",
          sender: 'ai' as const,
          timestamp: new Date(),
        };
        setTimeout(() => {
          setMessages(prev => [...prev, aiFollowUp]);
          setIsTyping(false);
        }, 1500);
      }
    }, 2000);
    
    setSelectedSymptoms([]);
  };

  const runDiagnosisAnalysis = async () => {
    if (selectedSymptoms.length === 0 && messages.filter(m => m.sender === 'user').length === 0) {
      toast({
        title: "No symptoms provided",
        description: "Please enter or select at least one symptom before running analysis.",
        variant: "destructive",
      });
      return;
    }
    
    // Extract symptoms from messages and selected symptoms
    const allSymptoms = [...selectedSymptoms];
    const userMessages = messages.filter(m => m.sender === 'user');
    
    if (userMessages.length > 0) {
      // In a real app, we would use NLP to extract symptoms from messages
      // For now, let's just assume any symptom mentioned in messages
      for (const message of userMessages) {
        for (const symptom of commonSymptoms) {
          if (message.text.toLowerCase().includes(symptom.name.toLowerCase()) && 
              !allSymptoms.some(s => s.id === symptom.id)) {
            allSymptoms.push(symptom);
          }
        }
      }
    }
    
    // Start analysis process
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const aiAnalysisMessage = {
      id: Date.now().toString(),
      text: "I'm running an in-depth analysis of your symptoms using our medical AI models. This will just take a moment...",
      sender: 'ai' as const,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiAnalysisMessage]);
    
    try {
      // Simulate AI analysis completion
      setTimeout(async () => {
        const result = await diagnosisService.analyzeSymptoms(allSymptoms);
        setDiagnosisResult(result);
        
        // Notify that analysis is complete
        const aiResultMessage = {
          id: Date.now().toString(),
          text: `Analysis complete! I've identified several potential conditions based on your symptoms. You can view the detailed results in the Results tab. Remember, this is not a definitive diagnosis - please consult with a healthcare professional for confirmation.`,
          sender: 'ai' as const,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResultMessage]);
        
        setIsAnalyzing(false);
        setAnalysisProgress(100);
        setActiveTab('results');
        
        if (onDiagnosisComplete) {
          onDiagnosisComplete(result);
        }
      }, 5000);
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during symptom analysis. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // Simulate speech recognition
    if (!isRecording) {
      toast({
        title: "Voice Recognition Active",
        description: "Please speak clearly into your microphone",
      });
      
      setTimeout(() => {
        setInputValue("I have a headache and feeling dizzy since yesterday. I also have a slight fever.");
        setIsRecording(false);
        
        toast({
          title: "Voice Captured",
          description: "Your speech has been transcribed",
        });
      }, 3000);
    }
  };

  const generateReport = async () => {
    if (!diagnosisResult) return;
    
    toast({
      title: "Report Generated",
      description: "Your medical report has been created and is ready to download",
    });
    
    // In a real application, this would generate a PDF or proper report
    const reportData = JSON.stringify({
      report: await diagnosisService.generateMedicalReport(
        selectedSymptoms.length > 0 ? selectedSymptoms : commonSymptoms.slice(0, 3),
        diagnosisResult
      ),
      format: "JSON"
    }, null, 2);
    
    // Create a blob and download
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("glass-card flex flex-col h-full overflow-hidden relative", className)}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex flex-col h-full">
        <ChatHeader activeTab={activeTab} />
        
        <TabsContent value="chat" className="flex-grow flex flex-col overflow-hidden p-0 m-0">
          <ChatTab 
            messages={messages}
            isTyping={isTyping}
            isAnalyzing={isAnalyzing}
            analysisProgress={analysisProgress}
            messagesEndRef={messagesEndRef}
            selectedSymptoms={selectedSymptoms}
            removeSymptom={removeSymptom}
            commonSymptoms={commonSymptoms}
            addSymptom={addSymptom}
            isRecording={isRecording}
            toggleRecording={toggleRecording}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
            runDiagnosisAnalysis={runDiagnosisAnalysis}
          />
        </TabsContent>
        
        <TabsContent value="results" className="flex-grow overflow-y-auto p-4 m-0 space-y-6">
          <ResultsTab 
            diagnosisResult={diagnosisResult} 
            setActiveTab={setActiveTab} 
            generateReport={generateReport}
          />
        </TabsContent>
        
        <TabsContent value="recommendations" className="flex-grow overflow-y-auto p-4 m-0 space-y-6">
          <RecommendationsTab 
            diagnosisResult={diagnosisResult} 
            setActiveTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSymptomChecker;
