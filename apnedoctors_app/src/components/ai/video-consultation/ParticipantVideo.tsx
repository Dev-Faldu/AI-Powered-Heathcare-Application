
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Video, VideoOff, Laptop, Badge, Crown, CircleEllipsis } from 'lucide-react';
import { ParticipantData } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge as UiBadge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ParticipantVideoProps {
  participant: ParticipantData;
  isLarge?: boolean;
  isLocal?: boolean;
  isSpeaking?: boolean;
  networkQuality?: number;
  className?: string;
  showControls?: boolean;
  pinParticipant?: (id: string) => void;
  removeParticipant?: (id: string) => void;
}

// Simulated video elements - in a real implementation these would be actual WebRTC video streams
const getVideoElement = (name: string, isLarge: boolean, isVideoEnabled: boolean) => {
  const bgColorClass = name.charCodeAt(0) % 2 === 0 ? 'bg-medical-700' : 'bg-teal-700';
  
  if (!isVideoEnabled) {
    return (
      <div className={cn(
        "flex items-center justify-center w-full h-full", 
        bgColorClass
      )}>
        <Avatar className="w-20 h-20">
          <AvatarFallback className="text-2xl bg-gray-800 text-white">
            {name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }
  
  // Simulation of different video backgrounds for each participant
  const bgIndex = name.charCodeAt(0) % 5;
  const bgImage = [
    "linear-gradient(45deg, #1a2a6c, #b21f1f, #fdbb2d)",
    "linear-gradient(45deg, #42275a, #734b6d)",
    "linear-gradient(45deg, #000428, #004e92)",
    "linear-gradient(45deg, #2c3e50, #4ca1af)",
    "linear-gradient(45deg, #8e2de2, #4a00e0)"
  ][bgIndex];
  
  return (
    <div 
      className="w-full h-full bg-cover bg-center"
      style={{background: bgImage}}
    >
      {/* This would be a real video element in a WebRTC implementation */}
    </div>
  );
};

const ParticipantVideo: React.FC<ParticipantVideoProps> = ({
  participant,
  isLarge = false,
  isLocal = false,
  isSpeaking = false,
  networkQuality = 5,
  className,
  showControls = true,
  pinParticipant,
  removeParticipant
}) => {
  const [videoReady, setVideoReady] = useState(false);
  
  // Simulate video loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-300",
        isLarge ? "aspect-video" : "aspect-[4/3]",
        isSpeaking && "ring-2 ring-medical-500 shadow-lg",
        className
      )}
    >
      {/* Video container */}
      {videoReady ? (
        getVideoElement(participant.name, isLarge, participant.isVideoEnabled)
      ) : (
        <div className="w-full h-full bg-gray-900 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading video...</span>
        </div>
      )}
      
      {/* Connection indicators */}
      <div className="absolute top-2 right-2 flex space-x-1">
        {isLocal && (
          <UiBadge variant="outline" className="bg-black/50 text-white border-0 text-xs">
            You
          </UiBadge>
        )}
        
        {participant.isScreenSharing && (
          <UiBadge variant="outline" className="bg-blue-500/70 text-white border-0 text-xs">
            <Laptop className="h-3 w-3 mr-1" />
            Sharing
          </UiBadge>
        )}
        
        {participant.role === 'doctor' && (
          <UiBadge variant="outline" className="bg-medical-500/70 text-white border-0 text-xs">
            <Badge className="h-3 w-3 mr-1" />
            Doctor
          </UiBadge>
        )}
        
        {participant.role === 'specialist' && (
          <UiBadge variant="outline" className="bg-purple-500/70 text-white border-0 text-xs">
            <Crown className="h-3 w-3 mr-1" />
            Specialist
          </UiBadge>
        )}
      </div>
      
      {/* Video/Audio indicators */}
      <div className="absolute bottom-2 left-2 flex items-center space-x-2">
        <span className="text-white font-medium text-sm shadow-sm">
          {participant.name}
        </span>
        
        {participant.isMuted && (
          <div className="bg-red-500 rounded-full p-1">
            <MicOff className="h-3 w-3 text-white" />
          </div>
        )}
        
        {!participant.isVideoEnabled && (
          <div className="bg-red-500 rounded-full p-1">
            <VideoOff className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      
      {/* Participant options (only show for non-local participants) */}
      {showControls && !isLocal && (
        <div className="absolute top-2 left-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-black/40 rounded-full p-1 text-white hover:bg-black/60 transition-colors">
                <CircleEllipsis className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 text-white border-gray-800">
              <DropdownMenuLabel>Participant Options</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              
              <DropdownMenuItem onClick={() => pinParticipant?.(participant.id)}>
                Pin participant
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => removeParticipant?.(participant.id)}>
                Remove participant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Network quality indicator */}
      <div className="absolute bottom-2 right-2 flex items-center space-x-1">
        {Array.from({length: 5}).map((_, i) => (
          <div 
            key={i}
            className={cn(
              "w-1 rounded-full",
              i < networkQuality ? "bg-green-500" : "bg-gray-600",
              [5, 10, 15, 20, 25][i] + "px"
            )}
            style={{height: `${(i+1) * 3}px`}}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantVideo;
