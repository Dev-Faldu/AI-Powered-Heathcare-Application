
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { VideoConsultation } from '@/components/ai/video-consultation';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

const VideoConsultationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const consultationId = queryParams.get('id') || undefined;
  const doctorId = queryParams.get('doctor') || undefined;
  const patientId = queryParams.get('patient') || undefined;

  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Handle fullscreen view
    const handleFullScreen = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullScreen);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreen);
    };
  }, []);
  
  const handleEndCall = () => {
    navigate('/diagnosis');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isFullscreen && (
        <>
          <AnimatedBackground dotCount={4} />
          <Navbar />
        </>
      )}
      
      <main className={cn(
        "flex-grow",
        isFullscreen ? "" : "pt-20"
      )}>
        <VideoConsultation 
          className="h-full"
          consultationId={consultationId}
          doctorId={doctorId}
          patientId={patientId}
          onEndCall={handleEndCall}
        />
      </main>
      
      {!isFullscreen && <Footer />}
    </div>
  );
};

export default VideoConsultationPage;

// Helper function to conditionally merge classes
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
