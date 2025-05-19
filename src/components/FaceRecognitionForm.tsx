
import React, { useState, useEffect } from 'react';
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
  ipAddresses?: string[];
  cameraCount?: number;
  cameraLocations?: string[];
  cameraNumbers?: number[];
}

const FaceRecognitionForm: React.FC<FaceRecognitionFormProps> = ({ onStartRecognition }) => {
  const [cameraSource, setCameraSource] = useState<'webcam' | 'ip'>('webcam');
  const [cameraCount, setCameraCount] = useState<number>(1);
  const [ipAddresses, setIpAddresses] = useState<string[]>(['']);
  const [cameraNumbers, setCameraNumbers] = useState<number[]>([1]);
  const [cameraLocations, setCameraLocations] = useState<string[]>(['']);

  // Update camera fields when count changes
  useEffect(() => {
    // Resize arrays based on camera count
    setIpAddresses(prev => {
      const newArray = [...prev];
      // Add or remove elements to match the new count
      if (newArray.length < cameraCount) {
        while (newArray.length < cameraCount) {
          newArray.push('');
        }
      } else if (newArray.length > cameraCount) {
        return newArray.slice(0, cameraCount);
      }
      return newArray;
    });
    
    setCameraNumbers(prev => {
      const newArray = [...prev];
      if (newArray.length < cameraCount) {
        while (newArray.length < cameraCount) {
          newArray.push(newArray.length + 1);
        }
      } else if (newArray.length > cameraCount) {
        return newArray.slice(0, cameraCount);
      }
      return newArray;
    });

    setCameraLocations(prev => {
      const newArray = [...prev];
      if (newArray.length < cameraCount) {
        while (newArray.length < cameraCount) {
          newArray.push('');
        }
      } else if (newArray.length > cameraCount) {
        return newArray.slice(0, cameraCount);
      }
      return newArray;
    });
  }, [cameraCount]);

  const updateIpAddress = (index: number, value: string) => {
    const newAddresses = [...ipAddresses];
    newAddresses[index] = value;
    setIpAddresses(newAddresses);
  };

  const updateCameraNumber = (index: number, value: number) => {
    const newNumbers = [...cameraNumbers];
    newNumbers[index] = value;
    setCameraNumbers(newNumbers);
  };

  const updateCameraLocation = (index: number, value: string) => {
    const newLocations = [...cameraLocations];
    newLocations[index] = value;
    setCameraLocations(newLocations);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cameraData: CameraData = {
      source: cameraSource,
    };

    if (cameraSource === 'ip') {
      // Validate IP camera data
      if (ipAddresses.some(address => !address) || cameraLocations.some(location => !location)) {
        toast({
          title: "Error",
          description: "Please fill in all camera addresses and locations",
          variant: "destructive"
        });
        return;
      }
      
      cameraData.ipAddresses = ipAddresses;
      cameraData.cameraCount = cameraCount;
      cameraData.cameraLocations = cameraLocations;
      cameraData.cameraNumbers = cameraNumbers;
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
                  <Label htmlFor="camera-count">Number of Cameras</Label>
                  <Input 
                    id="camera-count" 
                    type="number" 
                    value={cameraCount.toString()} 
                    onChange={(e) => setCameraCount(parseInt(e.target.value) || 1)} 
                    min="1"
                    required
                  />
                </div>
                
                {/* Dynamic camera details based on camera count */}
                {Array.from({ length: cameraCount }).map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-md bg-muted/20">
                    <h3 className="font-medium">Camera {index + 1}</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`ip-address-${index}`}>IP Address</Label>
                      <Input 
                        id={`ip-address-${index}`} 
                        value={ipAddresses[index] || ''} 
                        onChange={(e) => updateIpAddress(index, e.target.value)} 
                        placeholder="e.g., rtsp://192.168.1.100:554/live"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`camera-number-${index}`}>Camera Number</Label>
                      <Input 
                        id={`camera-number-${index}`} 
                        type="number" 
                        value={cameraNumbers[index]?.toString() || ''} 
                        onChange={(e) => updateCameraNumber(index, parseInt(e.target.value) || 1)} 
                        min="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`camera-location-${index}`}>Camera Location</Label>
                      <Input 
                        id={`camera-location-${index}`} 
                        value={cameraLocations[index] || ''} 
                        onChange={(e) => updateCameraLocation(index, e.target.value)} 
                        placeholder="e.g., Main Entrance, Lobby, etc."
                        required
                      />
                    </div>
                  </div>
                ))}
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
