
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CameraFeedDisplayProps {
  isActive: boolean;
  feedData?: any; // This would normally be your video feed data
}

const CameraFeedDisplay: React.FC<CameraFeedDisplayProps> = ({ isActive, feedData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // This is a placeholder for where you would integrate your actual video feed
  useEffect(() => {
    if (isActive && videoRef.current) {
      // In a real implementation, you would:
      // 1. Connect to your Python backend (possibly via WebSocket or API)
      // 2. Receive video frames and recognition data
      // 3. Update the video element or canvas with the received data
      
      // For demo purposes, we'll just access the webcam if user selected that option
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch(err => {
            console.error("Error accessing the camera:", err);
          });
      }
    }
    
    // Cleanup function to stop the video when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        
        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, [isActive, feedData]);

  if (!isActive) {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl mt-6">
      <CardHeader>
        <CardTitle>Recognition Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 text-sm rounded">
            Live Feed
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeedDisplay;
