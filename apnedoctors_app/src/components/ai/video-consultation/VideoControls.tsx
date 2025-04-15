
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Mic, MicOff, Video, VideoOff, Phone, MessageSquare,
  MonitorUp, UserPlus, Shield, FileText, Settings, MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CallState } from './types';

interface VideoControlsProps {
  className?: string;
  isMuted: boolean;
  toggleMute: () => void;
  isVideoEnabled: boolean;
  toggleVideo: () => void;
  isScreenSharing: boolean;
  toggleScreenShare: () => void;
  openChat: () => void;
  endCall: () => void;
  callState: CallState;
  toggleRecording: () => void;
  toggleAIAnalysis: () => void;
  toggleTranscription: () => void;
  toggleVirtualBackground: () => void;
  inviteParticipant?: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  className,
  isMuted,
  toggleMute,
  isVideoEnabled,
  toggleVideo,
  isScreenSharing,
  toggleScreenShare,
  openChat,
  endCall,
  callState,
  toggleRecording,
  toggleAIAnalysis,
  toggleTranscription,
  toggleVirtualBackground,
  inviteParticipant
}) => {
  return (
    <div className={cn(
      "flex items-center justify-center gap-3 p-3 rounded-lg backdrop-blur-md bg-black/20 w-full",
      className
    )}>
      {/* Main controls */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full bg-gray-800/60 text-white hover:bg-gray-700",
          isMuted && "bg-red-600/80 hover:bg-red-700"
        )}
        onClick={toggleMute}
      >
        {isMuted ? <MicOff /> : <Mic />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full bg-gray-800/60 text-white hover:bg-gray-700",
          !isVideoEnabled && "bg-red-600/80 hover:bg-red-700"
        )}
        onClick={toggleVideo}
      >
        {isVideoEnabled ? <Video /> : <VideoOff />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full bg-gray-800/60 text-white hover:bg-gray-700",
          isScreenSharing && "bg-green-600/80 hover:bg-green-700"
        )}
        onClick={toggleScreenShare}
      >
        <MonitorUp />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-800/60 text-white hover:bg-gray-700"
        onClick={openChat}
      >
        <MessageSquare />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-800/60 text-white hover:bg-gray-700"
        onClick={inviteParticipant}
      >
        <UserPlus />
      </Button>

      {/* Advanced features dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-800/60 text-white hover:bg-gray-700"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="bg-gray-900 text-white border-gray-800">
          <DropdownMenuLabel>Advanced Features</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-800" />
          
          <DropdownMenuItem 
            className={cn(callState.recordingConsent && callState.isRecording && "text-red-400")}
            onClick={toggleRecording}
          >
            <FileText className="mr-2 h-4 w-4" />
            {callState.recordingConsent && callState.isRecording ? "Stop Recording" : "Start Recording"}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className={cn(callState.aiAnalysisEnabled && "text-blue-400")}
            onClick={toggleAIAnalysis}
          >
            <Shield className="mr-2 h-4 w-4" />
            {callState.aiAnalysisEnabled ? "Disable AI Analysis" : "Enable AI Analysis"}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className={cn(callState.transcriptionEnabled && "text-green-400")}
            onClick={toggleTranscription}
          >
            <FileText className="mr-2 h-4 w-4" />
            {callState.transcriptionEnabled ? "Disable Transcription" : "Enable Transcription"}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className={cn(callState.virtualBackgroundEnabled && "text-purple-400")}
            onClick={toggleVirtualBackground}
          >
            <Settings className="mr-2 h-4 w-4" />
            {callState.virtualBackgroundEnabled ? "Disable Virtual Background" : "Enable Virtual Background"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* End call button */}
      <Button
        variant="destructive"
        size="icon"
        className="rounded-full bg-red-600 text-white hover:bg-red-700"
        onClick={endCall}
      >
        <Phone className="rotate-[135deg]" />
      </Button>
    </div>
  );
};

export default VideoControls;
