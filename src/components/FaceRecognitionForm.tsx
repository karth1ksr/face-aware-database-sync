
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface FaceRecognitionFormProps {
  onStartRecognition: (cameraData: CameraData) => void;
}

export interface CameraData {
  source: 'webcam' | 'ip';
  ipAddress?: string;
  cameraCount?: number;
  cameraLocation?: string;
  cameraNumber?: number;
}

const FaceRecognitionForm: React.FC<FaceRecognitionFormProps> = ({ onStartRecognition }) => {
  const [cameraSource, setCameraSource] = useState<'webcam' | 'ip'>('webcam');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [cameraCount, setCameraCount] = useState<number>(1);
  const [cameraLocation, setCameraLocation] = useState<string>('');
  const [cameraNumber, setCameraNumber] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cameraData: CameraData = {
      source: cameraSource,
    };

    if (cameraSource === 'ip') {
      if (!ipAddress) {
        toast({
          title: "Error",
          description: "Please enter IP camera address",
          variant: "destructive"
        });
        return;
      }
      
      cameraData.ipAddress = ipAddress;
      cameraData.cameraCount = cameraCount;
      cameraData.cameraLocation = cameraLocation;
      cameraData.cameraNumber = cameraNumber;
    }

    onStartRecognition(cameraData);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Face Recognition System</CardTitle>
        <CardDescription>Configure camera settings to start face recognition</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="camera-source">Camera Source</Label>
              <RadioGroup 
                id="camera-source" 
                value={cameraSource} 
                onValueChange={(value) => setCameraSource(value as 'webcam' | 'ip')} 
                className="flex flex-col space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="webcam" id="webcam" />
                  <Label htmlFor="webcam">Webcam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ip" id="ip" />
                  <Label htmlFor="ip">IP Camera</Label>
                </div>
              </RadioGroup>
            </div>

            {cameraSource === 'ip' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ip-address">Camera IP Address</Label>
                  <Input 
                    id="ip-address" 
                    value={ipAddress} 
                    onChange={(e) => setIpAddress(e.target.value)} 
                    placeholder="e.g., rtsp://192.168.1.100:554/live"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="camera-count">Number of Cameras</Label>
                  <Input 
                    id="camera-count" 
                    type="number" 
                    value={cameraCount.toString()} 
                    onChange={(e) => setCameraCount(parseInt(e.target.value))} 
                    min="1"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="camera-location">Camera Location</Label>
                  <Input 
                    id="camera-location" 
                    value={cameraLocation} 
                    onChange={(e) => setCameraLocation(e.target.value)} 
                    placeholder="e.g., Main Entrance"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="camera-number">Camera Number</Label>
                  <Input 
                    id="camera-number" 
                    type="number" 
                    value={cameraNumber.toString()} 
                    onChange={(e) => setCameraNumber(parseInt(e.target.value))} 
                    min="1"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Start Recognition
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FaceRecognitionForm;
