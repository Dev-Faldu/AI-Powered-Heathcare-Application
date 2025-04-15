import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { VideoConsultationProps, ParticipantData, CallState, MessageData, AIAnalysis } from './types';
import VideoControls from './VideoControls';
import ParticipantVideo from './ParticipantVideo';
import AIAssistantPanel from './AIAssistantPanel';
import ChatPanel from './ChatPanel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Shield, 
  ChevronLeft, 
  MessageSquare,
  BrainCircuit,
  FileText
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

// Demo doctor & patient data
const mockDoctors: ParticipantData[] = [
  {
    id: 'doctor-1',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    specialization: 'General Practitioner',
    isConnected: true,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false
  },
  {
    id: 'doctor-2',
    name: 'Dr. Michael Rodriguez',
    role: 'specialist',
    specialization: 'Cardiologist',
    isConnected: false,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false
  }
];

const mockPatients: ParticipantData[] = [
  {
    id: 'patient-1',
    name: 'Alex Johnson',
    role: 'patient',
    isConnected: true,
    isMuted: false,
    isVideoEnabled: true,
    isScreenSharing: false
  }
];

const mockAssistants: ParticipantData[] = [
  {
    id: 'ai-assistant-1',
    name: 'AI Assistant',
    role: 'assistant',
    isConnected: true,
    isMuted: true,
    isVideoEnabled: false,
    isScreenSharing: false
  }
];

// Mock chat messages
const generateMockMessages = (): MessageData[] => {
  return [
    {
      id: 'msg-1',
      senderId: 'doctor-1',
      text: 'Hello Alex, how are you feeling today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: 'msg-2',
      senderId: 'patient-1',
      text: "Hi Dr. Chen, I've been experiencing chest pain and shortness of breath for the past few days.",
      timestamp: new Date(Date.now() - 1000 * 60 * 14)
    },
    {
      id: 'msg-3',
      senderId: 'ai-assistant-1',
      text: 'Detected potential symptoms of cardiac distress. Recommend inquiring about pain characteristics, duration, and any precipitating factors.',
      timestamp: new Date(Date.now() - 1000 * 60 * 13),
      isAIGenerated: true
    },
    {
      id: 'msg-4',
      senderId: 'doctor-1',
      text: 'Could you describe the pain in more detail? Is it sharp, dull, or pressure-like? Does it radiate to other areas?',
      timestamp: new Date(Date.now() - 1000 * 60 * 12)
    }
  ];
};

const VideoConsultation: React.FC<VideoConsultationProps> = ({
  className,
  consultationId = 'demo-consultation',
  patientId = 'patient-1',
  doctorId = 'doctor-1',
  scheduledTime,
  onEndCall,
  aiModels = []
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'ai'>('chat');
  const [participants, setParticipants] = useState<ParticipantData[]>([...mockDoctors, ...mockPatients, ...mockAssistants]);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(doctorId);
  const [localParticipant, setLocalParticipant] = useState<ParticipantData>(mockPatients[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callState, setCallState] = useState<CallState>({
    isConnected: true,
    isRecording: false,
    duration: 0,
    quality: 'excellent',
    encryptionEnabled: true,
    recordingConsent: true,
    transcriptionEnabled: false,
    translationEnabled: false,
    translationLanguage: undefined,
    aiAnalysisEnabled: true,
    virtualBackgroundEnabled: false
  });
  const [callTimer, setCallTimer] = useState(0);
  const [messages, setMessages] = useState<MessageData[]>(generateMockMessages());
  const [isEndCallDialogOpen, setIsEndCallDialogOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  
  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Simulate call duration timer
  useEffect(() => {
    if (callState.isConnected) {
      timerRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState.isConnected]);
  
  // Format call duration
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle local user audio
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    setLocalParticipant(prev => ({
      ...prev,
      isMuted: !prev.isMuted
    }));
  };
  
  // Toggle local user video
  const toggleVideo = () => {
    setIsVideoEnabled(prev => !prev);
    setLocalParticipant(prev => ({
      ...prev,
      isVideoEnabled: !prev.isVideoEnabled
    }));
  };
  
  // Toggle screen sharing
  const toggleScreenShare = () => {
    setIsScreenSharing(prev => !prev);
    setLocalParticipant(prev => ({
      ...prev,
      isScreenSharing: !prev.isScreenSharing
    }));
    
    if (!isScreenSharing) {
      toast({
        title: "Screen sharing started",
        description: "All participants can now see your screen",
      });
    }
  };
  
  // Toggle AI analysis
  const toggleAIAnalysis = () => {
    setCallState(prev => ({
      ...prev,
      aiAnalysisEnabled: !prev.aiAnalysisEnabled
    }));
    
    toast({
      title: callState.aiAnalysisEnabled ? "AI analysis disabled" : "AI analysis enabled",
      description: callState.aiAnalysisEnabled 
        ? "The AI will no longer analyze your conversation" 
        : "The AI will now analyze your conversation and provide insights",
    });
  };
  
  // Toggle recording
  const toggleRecording = () => {
    if (!callState.recordingConsent) {
      toast({
        title: "Recording consent required",
        description: "All participants must consent to recording before it can be enabled",
        variant: "destructive"
      });
      return;
    }
    
    setCallState(prev => ({
      ...prev,
      isRecording: !prev.isRecording
    }));
    
    toast({
      title: callState.isRecording ? "Recording stopped" : "Recording started",
      description: callState.isRecording 
        ? "The recording has been saved securely" 
        : "This call is now being recorded with end-to-end encryption",
    });
  };
  
  // Toggle transcription
  const toggleTranscription = () => {
    setCallState(prev => ({
      ...prev,
      transcriptionEnabled: !prev.transcriptionEnabled
    }));
    
    toast({
      title: callState.transcriptionEnabled ? "Transcription disabled" : "Transcription enabled",
      description: callState.transcriptionEnabled 
        ? "The AI will no longer transcribe your conversation" 
        : "The AI will now transcribe your conversation in real-time",
    });
  };
  
  // Toggle virtual background
  const toggleVirtualBackground = () => {
    setCallState(prev => ({
      ...prev,
      virtualBackgroundEnabled: !prev.virtualBackgroundEnabled
    }));
    
    toast({
      title: callState.virtualBackgroundEnabled ? "Virtual background disabled" : "Virtual background enabled",
      description: callState.virtualBackgroundEnabled 
        ? "Your real background is now visible" 
        : "Your background has been replaced with a virtual one",
    });
  };
  
  // End call
  const handleEndCall = () => {
    if (onEndCall) {
      onEndCall();
    } else {
      setIsEndCallDialogOpen(true);
    }
  };
  
  // Confirm end call
  const confirmEndCall = () => {
    setCallState(prev => ({
      ...prev,
      isConnected: false
    }));
    setIsEndCallDialogOpen(false);
    
    toast({
      title: "Call ended",
      description: "Your consultation has ended successfully",
    });
    
    setTimeout(() => {
      navigate('/diagnosis');
    }, 1500);
  };
  
  // Send message
  const handleSendMessage = (text: string, attachments?: File[]) => {
    const newMessage: MessageData = {
      id: `msg-${messages.length + 1}`,
      senderId: localParticipant.id,
      text: text,
      timestamp: new Date(),
      attachments: attachments?.map((file, idx) => ({
        id: `attachment-${messages.length + 1}-${idx}`,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      }))
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (callState.aiAnalysisEnabled) {
      setTimeout(() => {
        const aiResponse: MessageData = {
          id: `msg-${messages.length + 2}`,
          senderId: 'ai-assistant-1',
          text: 'Based on the symptoms described, I recommend discussing potential cardiac evaluation. Consider asking about family history of heart disease and recent lifestyle changes.',
          timestamp: new Date(),
          isAIGenerated: true
        };
        
        setMessages(prev => [...prev, aiResponse]);
      }, 3000);
    }
  };
  
  // Invite participant
  const inviteParticipant = () => {
    const isSpecialistAlreadyJoined = participants.some(p => p.id === 'doctor-2' && p.isConnected);
    
    if (!isSpecialistAlreadyJoined) {
      setParticipants(prev => prev.map(p => 
        p.id === 'doctor-2' ? { ...p, isConnected: true } : p
      ));
      
      toast({
        title: "Specialist joined",
        description: "Dr. Michael Rodriguez has joined the consultation",
      });
    } else {
      toast({
        title: "Invite sent",
        description: "An invitation has been sent to join this consultation",
      });
    }
  };
  
  // Pin participant
  const pinParticipant = (participantId: string) => {
    setPinnedParticipantId(participantId);
  };
  
  // Refresh AI analysis
  const refreshAIAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysis({
        transcript: [
          "Dr. Chen: Hello Alex, how are you feeling today?",
          "Alex: Hi Dr. Chen, I've been experiencing chest pain and shortness of breath for the past few days.",
          "Dr. Chen: Could you describe the pain in more detail? Is it sharp, dull, or pressure-like? Does it radiate to other areas?",
          "Alex: It's more of a pressure, like something's sitting on my chest. Sometimes it goes to my left arm."
        ],
        keyPoints: [
          "Patient reports chest pain and shortness of breath for several days",
          "Pain described as pressure-like, radiating to left arm",
          "Patient appears anxious and has elevated heart rate",
          "No history of similar symptoms in the past"
        ],
        suggestedDiagnosis: [
          "Possible Angina",
          "Anxiety-related chest pain",
          "Gastroesophageal reflux"
        ],
        medicationSuggestions: [
          "Consider ECG to rule out acute cardiac event",
          "Low-dose aspirin as preventative measure",
          "Short-acting nitroglycerin for acute symptoms"
        ],
        followUpRecommendations: [
          "Urgent cardiology evaluation",
          "Stress test within 48 hours",
          "Daily blood pressure monitoring"
        ],
        confidence: 0.87
      });
      
      toast({
        title: "AI Analysis Complete",
        description: "The AI has analyzed the consultation and provided insights",
      });
    }, 5000);
  };
  
  // Get network quality label
  const getNetworkQualityLabel = (quality: CallState['quality']) => {
    switch(quality) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      case 'poor': return 'Poor';
      default: return 'Unknown';
    }
  };
  
  // Generate array of participants for grid view (exclude pinnedParticipant if set)
  const gridParticipants = pinnedParticipantId 
    ? participants.filter(p => p.id !== pinnedParticipantId && p.isConnected)
    : participants.filter(p => p.isConnected);
  
  // Get pinned participant if set
  const pinnedParticipant = pinnedParticipantId 
    ? participants.find(p => p.id === pinnedParticipantId)
    : null;
  
  return (
    <div className={cn(
      "w-full h-full bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden",
      className
    )}>
      <div className="bg-gray-800 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-gray-700 mr-2"
            onClick={() => navigate('/diagnosis')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className="hidden md:block">
            <h3 className="font-medium">Medical Consultation</h3>
            <p className="text-xs text-gray-400">ID: {consultationId}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            <span className="text-sm">{formatDuration(callTimer)}</span>
          </div>
          
          <div className="hidden md:flex items-center">
            <Shield className="h-4 w-4 mr-1 text-green-400" />
            <span className="text-sm">Encrypted</span>
          </div>
          
          {callState.isRecording && (
            <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-700 animate-pulse">
              REC
            </Badge>
          )}
          
          <Badge 
            variant="outline" 
            className={cn(
              "border-transparent",
              callState.quality === 'excellent' && "bg-green-500/20 text-green-300",
              callState.quality === 'good' && "bg-green-500/20 text-green-300",
              callState.quality === 'fair' && "bg-yellow-500/20 text-yellow-300",
              callState.quality === 'poor' && "bg-red-500/20 text-red-300"
            )}
          >
            {getNetworkQualityLabel(callState.quality)}
          </Badge>
        </div>
      </div>
      
      <div className="flex-grow flex overflow-hidden">
        <div className="flex-grow flex flex-col p-1 md:p-4 overflow-hidden bg-gray-900">
          <div className="flex-grow flex flex-col">
            <div className="flex-grow flex flex-col md:flex-row gap-3 overflow-hidden">
              {(pinnedParticipant || gridParticipants[0]) && (
                <div className="flex-grow">
                  <ParticipantVideo 
                    participant={pinnedParticipant || gridParticipants[0]}
                    isLarge={true}
                    isLocal={
                      (pinnedParticipant || gridParticipants[0]).id === localParticipant.id
                    }
                    isSpeaking={true}
                    pinParticipant={pinParticipant}
                  />
                </div>
              )}
              
              {gridParticipants.length > (pinnedParticipant ? 0 : 1) && (
                <div className="flex flex-row md:flex-col flex-wrap md:flex-nowrap md:w-1/4 gap-2 overflow-y-auto">
                  {gridParticipants.slice(pinnedParticipant ? 0 : 1).map(participant => (
                    <div key={participant.id} className="w-1/2 md:w-full">
                      <ParticipantVideo 
                        participant={participant}
                        isLocal={participant.id === localParticipant.id}
                        pinParticipant={pinParticipant}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <VideoControls 
              className="mt-3"
              isMuted={isMuted}
              toggleMute={toggleMute}
              isVideoEnabled={isVideoEnabled}
              toggleVideo={toggleVideo}
              isScreenSharing={isScreenSharing}
              toggleScreenShare={toggleScreenShare}
              openChat={() => setShowChat(true)}
              endCall={handleEndCall}
              callState={callState}
              toggleRecording={toggleRecording}
              toggleAIAnalysis={toggleAIAnalysis}
              toggleTranscription={toggleTranscription}
              toggleVirtualBackground={toggleVirtualBackground}
              inviteParticipant={inviteParticipant}
            />
          </div>
        </div>
        
        {!isMobile && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-800 overflow-hidden hidden md:block">
            <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
              <TabsList className="p-0 h-10 bg-gray-200 dark:bg-gray-800 rounded-none">
                <TabsTrigger 
                  value="chat" 
                  className="flex-1 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="ai" 
                  className="flex-1 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                >
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="flex-grow m-0 p-0">
                <ChatPanel 
                  messages={messages}
                  participants={participants}
                  onSendMessage={handleSendMessage}
                  userId={localParticipant.id}
                />
              </TabsContent>
              
              <TabsContent value="ai" className="flex-grow m-0 p-0">
                <AIAssistantPanel 
                  isAnalyzing={isAnalyzing}
                  analysis={aiAnalysis}
                  refreshAnalysis={refreshAIAnalysis}
                  transcriptionEnabled={callState.transcriptionEnabled}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      
      {isMobile && (
        <Sheet open={showChat} onOpenChange={setShowChat}>
          <SheetContent side="bottom" className="h-[90%] p-0">
            <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
              <TabsList className="p-0 h-10 bg-gray-200 dark:bg-gray-800 rounded-none">
                <TabsTrigger 
                  value="chat" 
                  className="flex-1 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="ai" 
                  className="flex-1 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                >
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger 
                  value="transcript" 
                  className="flex-1 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Transcript
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="flex-grow m-0 p-0">
                <ChatPanel 
                  messages={messages}
                  participants={participants}
                  onSendMessage={handleSendMessage}
                  userId={localParticipant.id}
                />
              </TabsContent>
              
              <TabsContent value="ai" className="flex-grow m-0 p-0">
                <AIAssistantPanel 
                  isAnalyzing={isAnalyzing}
                  analysis={aiAnalysis}
                  refreshAnalysis={refreshAIAnalysis}
                  transcriptionEnabled={callState.transcriptionEnabled}
                />
              </TabsContent>
              
              <TabsContent value="transcript" className="flex-grow m-0 p-0">
                <div className="p-4 h-full overflow-y-auto">
                  <h3 className="font-semibold mb-4">Live Transcript</h3>
                  <div className="space-y-4">
                    {aiAnalysis?.transcript.map((line, idx) => (
                      <div key={idx} className="pb-3 border-b border-gray-200 dark:border-gray-800">
                        <p className="text-gray-900 dark:text-white">{line}</p>
                      </div>
                    )) || (
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <p>No transcript available</p>
                        <p className="text-sm mt-2">Enable transcription in call settings to see live transcripts</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      )}
      
      <Dialog open={isEndCallDialogOpen} onOpenChange={setIsEndCallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End consultation?</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this consultation? All participants will be disconnected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEndCallDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmEndCall}>
              End Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoConsultation;
