
import React, { useState } from 'react';
import FaceRecognitionForm, { CameraData } from '@/components/FaceRecognitionForm';
import CameraFeedDisplay from '@/components/CameraFeedDisplay';
import RecognitionResults from '@/components/RecognitionResults';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

// Mock data for demonstration purposes
const generateMockRecognizedFaces = (cameraCount = 1) => {
  const faces = [];
  for (let i = 0; i < cameraCount; i++) {
    const cameraNumber = i + 1;
    faces.push({
      id: `1-cam${cameraNumber}`,
      name: 'John Doe',
      confidence: 0.94,
      timestamp: new Date().toISOString(),
      cameraNumber,
    });
    faces.push({
      id: `2-cam${cameraNumber}`,
      name: 'Jane Smith',
      confidence: 0.87,
      timestamp: new Date().toISOString(),
      cameraNumber,
    });
  }
  return faces;
};

const Index = () => {
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [cameraData, setCameraData] = useState<CameraData | null>(null);
  const [recognizedFaces, setRecognizedFaces] = useState<any[]>([]);

  const handleStartRecognition = (data: CameraData) => {
    setCameraData(data);
    setIsRecognitionActive(true);
    
    // In a real implementation, you would:
    // 1. Connect to your Python backend
    // 2. Send the camera configuration
    // 3. Start receiving recognition data
    
    // For demo purposes, we'll simulate receiving recognition data after a delay
    const cameraCount = data.source === 'ip' ? data.cameraCount || 1 : 1;
    
    setTimeout(() => {
      setRecognizedFaces(generateMockRecognizedFaces(cameraCount));
      toast({
        title: "Face Recognition Active",
        description: `Connected to ${data.source === 'webcam' ? 'webcam' : 'IP camera(s)'} successfully`,
      });
    }, 2000);
  };

  const handleStopRecognition = () => {
    setIsRecognitionActive(false);
    setCameraData(null);
    setRecognizedFaces([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Face Recognition System</h1>
        
        <div className="flex flex-col items-center">
          {isRecognitionActive ? (
            <>
              <div className="w-full flex flex-col items-center">
                <Button 
                  variant="outline" 
                  className="mb-6 self-start"
                  onClick={handleStopRecognition}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Setup
                </Button>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  <div className="lg:col-span-2">
                    <CameraFeedDisplay 
                      isActive={isRecognitionActive} 
                      feedData={cameraData} 
                    />
                  </div>
                  
                  <div className="space-y-4 lg:col-span-2">
                    <RecognitionResults 
                      isActive={isRecognitionActive}
                      recognizedFaces={recognizedFaces}
                      cameraCount={cameraData?.cameraCount || 1}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <FaceRecognitionForm onStartRecognition={handleStartRecognition} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
