
import { useState } from 'react';
import { ArrowRight, Send, PlusCircle, Mic, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Symptom {
  id: string;
  name: string;
}

interface SymptomCheckerProps {
  className?: string;
}

const SymptomChecker = ({ className }: SymptomCheckerProps) => {
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
      text: 'Hello! I\'m your AI health assistant. Describe your symptoms or select from common ones below.',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const commonSymptoms: Symptom[] = [
    { id: 's1', name: 'Headache' },
    { id: 's2', name: 'Fever' },
    { id: 's3', name: 'Cough' },
    { id: 's4', name: 'Fatigue' },
    { id: 's5', name: 'Sore Throat' },
    { id: 's6', name: 'Shortness of Breath' },
  ];

  const addSymptom = (symptom: Symptom) => {
    if (!selectedSymptoms.some(s => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
  };

  const handleSendMessage = () => {
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
    setSelectedSymptoms([]);
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: "I'm analyzing your symptoms. Based on what you've shared, I need to ask a few more questions to better understand your condition.",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // Simulate speech recognition
    if (!isRecording) {
      setTimeout(() => {
        setInputValue("I have a headache and feeling dizzy since yesterday");
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <div className={cn("glass-card flex flex-col h-full overflow-hidden relative", className)}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-medical-500 to-teal-500 flex items-center justify-center text-white font-medium">
            AI
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-900 dark:text-white">AI Health Assistant</h3>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "max-w-[85%] rounded-2xl p-4 animate-fade-in",
              message.sender === 'user' 
                ? "bg-medical-100 dark:bg-medical-900/30 text-gray-800 dark:text-gray-200 ml-auto" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            )}
          >
            <p className="whitespace-pre-line">{message.text}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        
        {isTyping && (
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl p-4 max-w-[85%] animate-pulse">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
            </div>
          </div>
        )}
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
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-center">
        <a href="/diagnosis" className="text-medical-600 dark:text-medical-400 hover:text-medical-700 dark:hover:text-medical-300 flex items-center justify-center">
          Advanced Diagnosis <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default SymptomChecker;
