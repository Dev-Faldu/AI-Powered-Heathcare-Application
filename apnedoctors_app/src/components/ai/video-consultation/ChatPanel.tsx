
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageData, ParticipantData } from './types';
import { Send, Paperclip, Image, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface ChatPanelProps {
  className?: string;
  messages: MessageData[];
  participants: ParticipantData[];
  onSendMessage: (text: string, attachments?: File[]) => void;
  userId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  className,
  messages,
  participants,
  onSendMessage,
  userId
}) => {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() || attachments.length > 0) {
      onSendMessage(inputValue, attachments);
      setInputValue('');
      setAttachments([]);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };
  
  const getParticipantById = (id: string) => {
    return participants.find(p => p.id === id);
  };
  
  return (
    <div className={cn(
      "bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden flex flex-col h-full",
      className
    )}>
      <div className="bg-gray-200 dark:bg-gray-800 p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Call Chat</h3>
      </div>
      
      <ScrollArea className="flex-grow p-3" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center p-6">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-full p-4 mb-4">
              <Send className="h-6 w-6" />
            </div>
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const participant = getParticipantById(message.senderId);
              const isSelf = message.senderId === userId;
              
              return (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex",
                    isSelf ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%]",
                    isSelf ? "order-1" : "order-2"
                  )}>
                    {!isSelf && (
                      <div className="flex items-center mb-1">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>
                            {participant?.name.substring(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          {participant?.name || 'Unknown'}
                        </span>
                      </div>
                    )}
                    
                    <div className={cn(
                      "rounded-lg p-3",
                      isSelf 
                        ? "bg-medical-500 text-white" 
                        : message.isAIGenerated 
                          ? "bg-teal-100 dark:bg-teal-900/20 text-gray-800 dark:text-gray-200" 
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200",
                      message.isAIGenerated && "border border-teal-200 dark:border-teal-800"
                    )}>
                      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map(attachment => (
                            <div 
                              key={attachment.id}
                              className={cn(
                                "flex items-center p-2 rounded text-xs",
                                isSelf ? "bg-medical-600" : "bg-gray-100 dark:bg-gray-700"
                              )}
                            >
                              {attachment.type === 'image' ? (
                                <Image className="h-4 w-4 mr-2" />
                              ) : attachment.type === 'prescription' ? (
                                <FileText className="h-4 w-4 mr-2" />
                              ) : (
                                <Paperclip className="h-4 w-4 mr-2" />
                              )}
                              <span className="flex-grow truncate">{attachment.name}</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-2">
                                <FileText className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className={cn(
                      "text-xs text-gray-500 mt-1",
                      isSelf ? "text-right" : "text-left"
                    )}>
                      {format(message.timestamp, 'HH:mm')}
                      {message.isAIGenerated && (
                        <span className="ml-2 text-teal-600 dark:text-teal-400">
                          AI-generated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      
      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="px-3 pt-2">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="bg-gray-200 dark:bg-gray-800 rounded px-2 py-1 text-xs flex items-center"
              >
                {file.type.startsWith('image/') ? (
                  <Image className="h-3 w-3 mr-1" />
                ) : (
                  <Paperclip className="h-3 w-3 mr-1" />
                )}
                <span className="max-w-[100px] truncate">{file.name}</span>
                <button 
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-3 mt-auto">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            size="icon"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
          </Button>
          
          <div className="relative flex-grow">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-medical-500 dark:focus:ring-medical-400 text-gray-900 dark:text-white text-sm"
              rows={2}
            />
          </div>
          
          <Button 
            variant="default"
            size="icon"
            onClick={handleSendMessage}
            className="flex-shrink-0 bg-medical-500 hover:bg-medical-600"
            disabled={!inputValue.trim() && attachments.length === 0}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
