
import { MessageSquare, BarChart3, Info } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatHeaderProps {
  activeTab: string;
}

export const ChatHeader = ({ activeTab }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-medical-500 to-teal-500 flex items-center justify-center text-white font-medium">
          AI
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Advanced AI Health Assistant</h3>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-xs text-gray-500 dark:text-gray-400">HIPAA Compliant</span>
          </div>
        </div>
      </div>
      
      <TabsList className="grid grid-cols-3 w-auto">
        <TabsTrigger value="chat" className="px-3">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </TabsTrigger>
        <TabsTrigger value="results" className="px-3">
          <BarChart3 className="h-4 w-4 mr-2" />
          Results
        </TabsTrigger>
        <TabsTrigger value="recommendations" className="px-3">
          <Info className="h-4 w-4 mr-2" />
          Advice
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
