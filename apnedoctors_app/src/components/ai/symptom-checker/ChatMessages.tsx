
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ChatMessagesProps {
  messages: {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }[];
  isTyping: boolean;
  isAnalyzing: boolean;
  analysisProgress: number;
}

export const ChatMessages = ({ messages, isTyping, isAnalyzing, analysisProgress }: ChatMessagesProps) => {
  return (
    <>
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
      
      {isAnalyzing && (
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl p-4 max-w-[85%]">
          <p className="mb-2">Analyzing your symptoms...</p>
          <Progress value={analysisProgress} className="h-2" />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Using AI models: Transformer, BERT, Decision Tree
          </p>
        </div>
      )}
    </>
  );
};
