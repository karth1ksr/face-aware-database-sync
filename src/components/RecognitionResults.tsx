
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Person {
  id: string;
  name: string;
  confidence: number;
  timestamp: string;
}

interface RecognitionResultsProps {
  isActive: boolean;
  recognizedFaces: Person[];
}

const RecognitionResults: React.FC<RecognitionResultsProps> = ({ isActive, recognizedFaces }) => {
  if (!isActive || recognizedFaces.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mt-6">
      <CardHeader>
        <CardTitle>Recognition Results</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default RecognitionResults;
