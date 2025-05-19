import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Person {
  id: string;
  name: string;
  confidence: number;
  timestamp: string;
  cameraNumber?: number; // Add camera number to track which camera detected the person
}

interface RecognitionResultsProps {
  isActive: boolean;
  recognizedFaces: Person[];
  cameraCount?: number;
}

const RecognitionResults: React.FC<RecognitionResultsProps> = ({ isActive, recognizedFaces, cameraCount = 1 }) => {
  if (!isActive || recognizedFaces.length === 0) {
    return null;
  }

  // Group faces by camera if multiple cameras
  const facesByCamera = recognizedFaces.reduce((acc, person) => {
    const cameraKey = person.cameraNumber || 1;
    if (!acc[cameraKey]) {
      acc[cameraKey] = [];
    }
    acc[cameraKey].push(person);
    return acc;
  }, {} as Record<number, Person[]>);

  const cameraKeys = Object.keys(facesByCamera).map(Number).sort((a, b) => a - b);

  return (
    <Card className="w-full max-w-3xl mt-6">
      <CardHeader>
        <CardTitle>Recognition Results</CardTitle>
      </CardHeader>
      <CardContent>
        {cameraCount > 1 ? (
          // Multiple cameras view
          cameraKeys.map((cameraNumber) => (
            <div key={cameraNumber} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold mb-2">Camera {cameraNumber}</h3>
              <div className="space-y-4">
                {facesByCamera[cameraNumber].map((person) => (
                  <div 
                    key={person.id} 
                    className="p-3 border rounded-lg bg-muted/30 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{person.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(person.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {Math.round(person.confidence * 100)}% match
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Single camera view - keep original layout
          <div className="space-y-4">
            {recognizedFaces.map((person) => (
              <div 
                key={person.id} 
                className="p-3 border rounded-lg bg-muted/30 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{person.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(person.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {Math.round(person.confidence * 100)}% match
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecognitionResults;
